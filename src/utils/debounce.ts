export function debounce<T>(
  callback: (...args: any[]) => Promise<T>,
  tailInvocation: boolean = true,
  timeoutInMs: number = 300
) {
  let timeoutHandle: number;

  return (...args: any[]) =>
    new Promise<T>((resolve) => {
      const headInvocation = !tailInvocation && !timeoutHandle;

      const invokeFunction = async () => {
        const result = await callback(...args);
        resolve(result);
      };

      const timeoutHandler = () => {
        if (tailInvocation) {
          invokeFunction();
        }

        timeoutHandle = 0;
      };

      window.clearTimeout(timeoutHandle);
      timeoutHandle = window.setTimeout(timeoutHandler, timeoutInMs);

      if (headInvocation) {
        invokeFunction();
      }
    });
}