import { exec } from 'child_process';

export default function callBash<T = unknown>(command: string) {
  return new Promise<T>((resolve, reject) => {
    exec(
      command,
      {
        cwd: process.cwd(),
      },
      (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.slice(0, -1) as T);
      },
    );
  });
}
