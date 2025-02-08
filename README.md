[![Node.js CI](https://github.com/Borewit/await-queue/actions/workflows/ci.yml/badge.svg)](https://github.com/Borewit/await-queue/actions/workflows/ci.yml)
[![NPM version](https://badge.fury.io/js/@borewit%2Fasync-queue.svg)](https://npmjs.org/package/@borewit/async-queue)
[![npm downloads](http://img.shields.io/npm/dm/@borewit/async-queue.svg)](https://npmcharts.com/compare/@borewit/async-queue?start=356)

# @borewit/async-queue

`await-queue` is a lightweight, generic, and type-safe asynchronous queue implemented in TypeScript. It allows you to enqueue items and retrieve them one at a time using promises, making it ideal for processing events, messages, or tasks in a first-in-first-out (FIFO) order. This is especially handy when reading asynchronous items received via events.

## Features

- **Generic & Type-Safe:** Write once and use with any type (e.g., string, number, object).
- **FIFO Order:** Processes items in the order they were received.
- **Promise-Based:** Retrieve items asynchronously using promises.
- **Event Integration:** Perfect for handling asynchronous events like user actions, network messages, or other event-driven data.

## Installation

Install `@borewit/async-queue` from npm:

```bash
npm install @borewit/async-queue
```

## Usage
Below is an example of how to add and read string messages to/from the queue. This example simulates asynchronous events (using setTimeout) that push string messages into the queue:

```ts
import { AsyncQueue } from '@borewit/async-queue';

// Create a new queue for string messages
const queue = new AsyncQueue<string>();

// Example: Simulate incoming messages via asynchronous events
function simulateIncomingMessages() {
  setTimeout(() => queue.push("Hello"), 1000);
  setTimeout(() => queue.push("World"), 2000);
  setTimeout(() => queue.push("From AsyncQueue!"), 3000);
}

simulateIncomingMessages();

// Process messages asynchronously, one at a time
async function processMessages() {
  while (true) {
    const message = await queue.next();
    console.log("Received message:", message);
    // Add additional processing logic here...
  }
}

processMessages();
```
In this example, the queue is used to collect string messages that are simulated to arrive at different times. The asynchronous loop in processMessages waits for each message, ensuring they are handled in FIFO order.


## API

```ts
push(item: T): void
```
Adds an item to the queue.

- Parameters
  -  `item: T` - The item to add.

If there are pending consumers waiting for an item (via `next(`)),
the promise is immediately resolved with the new item.

```ts
next(): Promise<T>
```
Returns a promise that resolves with the next item in the queue.
- Returns:
  - `Promise<T>` - A promise that resolves to the next item.

If the queue already contains an item, the promise resolves immediately;
otherwise, it waits until an item is pushed.

## When to Use This Queue

This queue is particularly useful when you need to process asynchronous events in a controlled, sequential manner. Instead of handling events directly as they arrive, you can push them into the queue and then process them one by one. This approach is beneficial in scenarios such as:

* Handling user input events.
* Processing network messages.
* Managing asynchronous tasks or jobs in order.

## License

This project is licensed under the MIT License. See the [LICENSE file](LICENSE.txt) for details.
