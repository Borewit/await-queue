export class AsyncQueue<T> {

  private queue: T[] = []; // Holds messages that have arrived
  private waiters: Array<(item: T) => void> = []; // Holds resolve functions for pending promises

  // Called when a new message arrives (e.g., from an event)
  public push(item: T): void {
    // If someone is waiting for a message, resolve their promise immediately.
    if (this.waiters.length > 0) {
      const resolve = this.waiters.shift()!;
      resolve(item);
    } else {
      // Otherwise, add the message to the queue.
      this.queue.push(item);
    }
  }

  // Returns a promise that resolves with the next message.
  public next(): Promise<T> {
    // If there is already a message waiting, return it immediately.
    if (this.queue.length > 0) {
      return Promise.resolve(this.queue.shift()!);
    }

    // Otherwise, return a promise that will resolve when a new message arrives.
    return new Promise<T>(resolve => {
      this.waiters.push(resolve);
    });
  }
}