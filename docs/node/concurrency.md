---
title: Node.js 并发：多进程
description: Node.js 是单进程多线程的，JavaScript 代码是单线程执行的
date: 2024-11-15T11:11:00+08:00
tags:
  - Node.js
---

# Node.js 并发：多进程

> 首先下一些前置结论：
>
> - Node.js 是单进程多线程的，JavaScript 代码是单线程执行的
>  - 环境变量 UV_THEADPOOL_SIZE 可以控制 libuv 开启的线程池大小，默认大小是 4

这里探讨 Node.js 如何充分利用多进程来发挥多核 CPU 的性能

[[TOC]]

## 1. 解决方案

1. 单进程启动，使用 Docker 的进程守护机制（即启动多个 Docker 容器）

   > 缺陷：重新拉起较耗时，基本上耗时 5-6s 以上

2. **使用进程管理工具 - PM2，以 cluster 模式启动**

   > 几乎是毫秒级的重启

   ```bash
   NODE_ENV=production \
   pm2 start ./bootstrap.js -n $INSTANCE_NAME --no-daemon -i 2 --log-date-format "YYYY-MM-DD HH:mm:ss"
   ```

  - `-n`：给实例命名
  - `--no-daemon`：不以守护进程的方式运行，也就是在前台运行，关闭启动它的终端窗口将会停止运行
  - `-i`：启动多少个 Node.js 实例，也就是同时运行的进程副本的数量
  - `--log-date-format`：日志记录的日期格式

实际上我们也可以用 Node.js 编写一个简易的进程管理工具来实现乞丐版的 pm2

## 2. 实现类似的进程管理工具

想要实现 pm2 的最小链路，我们需要做到这些事情：

- 创建子进程
- 请求处理负载均衡
- 进程守护
  - 后台常驻运行
  - 监听程序退出（进程事件）
- 进程退出前回收资源（优雅退出）
  - 信号机制
- 接收退出命令，退出所有子进程并释放资源
- 工作进程日志处理

下面可能是一些容易遇到的问题：

### 2.1 多进程下如何监听同一个端口

1. 反向代理：父子进程各自监听独立的端口，父进程接收请求后，去请求子进程。

   > 缺陷：性能太差

2. IPC 传递 Socket：父进程监听请求，利用 IPC 通信将 Socket 传递给子进程

   > 缺陷：对子进程监听服务的写法有侵入性
  
   1. process.send('message', handle) 和 process.on('message', callback)
   2. 原理
      - File Descriptor 机制
      - 进程间通过 IPC 通道传递文件描述符

    ```js
    /** master.js */
    const { fork } = require('child_process');

    const net = require('net');

    const subprocess = fork('./child.js');

    const server = net.createServer((socket) => {
      subprocess.send('socket', socket);
    });

    server.listen(9999);
    ```

    ```js
    /** child.js */
    process.on('message', (msg, socket) => {
      if (msg !== 'socket') {
        return;
      }
      const body = Buffer.from('<html><body>Hello World</body></html>');
      socket.end(`HTTP/1.1 200 OK\r\nContent-Type: text/html;charset=utf-8\r\nContent-Length: ${body.length}\r\n\r\n${body.toString()}`);
    });
    ```

3. Cluster 方案：使用 Node.js 提供的 cluster 模块，该模块已经处理好了这个问题

   > Cluster 模块到底做了什么魔法？👉 [Stackoverflow](https://v00enb6jfap.feishu.cn/docx/O44gddGlsoJL9bxrUEjc54cynQf#share-RFIBdcEONoDgsTxTMaJcQDRYnZ9)

    ```js
    /** master.js */
    const cluster = require('cluster');

    cluster.setupPrimary({
      exec: 'worker.js',
    });

    const workers = [];

    for (let i = 0; i < 10; ++i) {
      const child = cluster.fork();
      workers.push(child);
    }
    ```

    ```js
    /** worker.js */
    const http = require('http');

    http.createServer((req, res) => {
      res.end('Hello World');
    })
    .listen(9000, () => {
      console.log('process %s started', process.pid);
    });
    ```


### 2.2 监听子进程退出并重启该子进程

主要要对 master 进行改造，在 subprocess exit 时重新 fork 一个新的子进程

```js
import cluster from 'cluster';

cluster.setupPrimary({
  exec: 'worker.js',
});

const workers = [];

const fork = () => {
  const child = cluster.fork();

  child.on('exit', (code, signal) => {
    console.log(`worker ${child.process.pid} died`);
    setTimeout(() => {
      fork();
    }, 500);
    workers.splice(workers.indexOf(child), 1);
  });

  workers.push(child);
}

for (let i = 0; i < 10; ++i) {
  fork();
}
```

下面我们来验证一下子进程被杀掉之后确实会被重新 fork 出新的

1. 启动 master 脚本
2. 使用 `ps -ef | grep node` 查看被创建出来的 node 进程

![ps-ef](https://cdn.img2ipfs.com/ipfs/QmYuxQ6we53dGukKz75JMp4pJ2PFqaYEwxZiEaKHiJJST9?filename=1730304946-936296-qmxradhyghrdtkasu31h43i3cvdxfdsptrkgdurpjvquyl.jpg)


   红线划出来的就是进程的 pid，可以数出来现在有 10 个 worker 进程在运行，随机选一个幸运的 worker 进程复制它的 pid。

3. 使用 `kill -9 pid` 杀死该 worker 进程
4. 再使用 `ps -ef | grep node` 查看所有 node 进程

   发现 worker 进程还是 10 个，但是被杀掉的那个 pid 已经消失了，取而代之的是一个之前没出现过的 pid，说明新的 worker 进程启动成功了


### 2.3 Daemon 模式

前置知识

1. [Linux: setsid](https://linux.die.net/man/2/setsid)
   - 表现为：当前进程退出，子进程常驻后台运行，且 ppid 为 1
2. Node.js Child 模块 [fork 的 options - detached](https://nodejs.org/docs/latest/api/child_process.html#child_processforkmodulepath-args-options)
3. 退出后台常驻运行进程
   - OS 信号机制
     - SIGKILL（kill -9）
     - SIGINT（ctrl + C）
     - SIGTERM（kill -15），kill 不传任何参数时的默认表现
   - process.kill(pid, signal)

首先利用 detached 选项，做到进程后台常驻

```js
/** 新增 command.js */
import { fork } from 'child_process';

fork('./master.js', {
  detached: true,
  stdio: 'ignore',
});

process.exit(0);
```

在 fork 出子进程后，把 pid 写进文件 io，如果 argv 为 stop 则读取该文件然后用 process.kill 把文件中的 pid 杀掉

```js
import { fork } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

const pidFile = resolve(__dirname, '.pid');

async function main() {
  const cmd = process.argv[2];
  if (cmd === 'start') {
    const subprocess = fork('./master.js', {
      detached: true,
      stdio: 'ignore',
    });
    await writeFile(pidFile, subprocess.pid.toString(), 'utf-8');
    console.log('started');
  } else if (cmd === 'stop') {
    const pid = await readFile(pidFile, 'utf-8');
    if (pid.length) {
      process.kill(+pid, 'SIGKILL');
    } else {
      console.log('no pid found');
    }
    console.log('stopped');
    await unlink(pidFile);
  } else {
    console.log('unknown command');
  }
  process.exit(0);
}

main();
```

然后我们就可以这样来使用进程管理工具了：

- 启动：`node command.js start`
- 停止：`node command.js stop`

Daemon 进程监听 SIGTERM、SIGKILL、SIGINT，回收所有子进程（cluster 模块已经帮我们做好了）

### 2.4 日志写入文件 IO

Fork 的时候通过 options.stdio 指定子进程的 fd，相当于把 IO 流进行了重定向

```js
import { fork } from 'child_process';
import { writeFile, readFile, unlink, open } from 'fs/promises';
import { resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

const pidFile = resolve(__dirname, '.pid');
const appLogFile = resolve(__dirname, 'app.log');
const errorFile = resolve(__dirname, 'error.log');

async function main() {
  const appLog = await open(appLogFile, 'a+');
  const errorLog = await open(errorFile, 'a+');
  const cmd = process.argv[2];
  if (cmd === 'start') {
    const subprocess = fork('./master.js', {
      detached: true,
      stdio: [0, appLog, errorLog, 'ipc'],
    });
    // ...
  } else if (cmd === 'stop') {
    // ...
  } else {
    console.log('unknown command');
  }
  process.exit(0);
}

main();
```

到此我们就实现了一个极其简易的类似 pm2 的进程管理工具了，需要注意的是不要把这个东西用到生产环境中。

## 3. 拓展

对于 Node.js 的多核并行运算来说，还有一个 Worker Thread API 可以考虑使用。从线程的角度去调度，相比进程轻一些：https://nodejs.org/api/worker_threads.html


> ***Node.js 的“多线程”和系统级的多线程有什么区别***


![Node.js 多线程和系统级多线程区别](https://cdn.img2ipfs.com/ipfs/QmZ8Php1uAJNhp17tLeQNPQSXStkV3HrRpMUz9QBJ2PxXB?filename=1730305137-891862-qmzdejdgwgujs4sqboulfewtv6bvsxez1q1epzs4iyv5tb.jpg)

:::info
- 参见：https://0xffff.one/d/2048
:::