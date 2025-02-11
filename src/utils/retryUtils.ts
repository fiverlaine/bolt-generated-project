const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_DELAY = 1000;

export const retry = async <T>(
  fn: () => Promise<T>,
  retries = DEFAULT_RETRY_COUNT,
  delay = DEFAULT_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};
