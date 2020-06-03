export async function retry<T>(promiseFactory:()=>Promise<T>, retryCount: number, delay: number):Promise<T> {
  try {
    return await promiseFactory();
  } catch (error) {
    if (retryCount <= 0) {
      throw error;
    }
    return new Promise<T>(resolve => {
      setTimeout(() => {
        retry(promiseFactory, retryCount-1, delay).then((value: T) => resolve(value));
      }, delay);
    });
  }
}

test("always pass - this is a helper library", ()=>{});