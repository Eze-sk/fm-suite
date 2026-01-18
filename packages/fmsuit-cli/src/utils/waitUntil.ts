/**
 * Waits until a given condition becomes true.
 * @param {Function} condition - A function that returns a boolean indicating if the condition is met
 * @returns {Promise<void>} A promise that resolves when the condition becomes true
 */
export function waitUntil(condition: () => boolean): Promise<void> {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (condition()) {
        console.log(condition())
        clearInterval(interval);
        resolve();
      }
    }, 100);
  })
}