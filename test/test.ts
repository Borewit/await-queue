import {describe, it} from 'mocha';
import {expect} from 'chai';
import {AsyncQueue} from '../lib/queue.js';

describe('await-queue', () => {

    it('add item to queue, read item from', async () => {
        const queue = new AsyncQueue<string>();
        queue.push('1');

        const message = await queue.next();
        expect(message).to.be.equal('1');
    });

    it('should return an item that was pushed before calling next()', async () => {
        const queue = new AsyncQueue<number>();
        queue.push(1);
        const result = await queue.next();
        expect(result).to.equal(1);
    });

    it('should resolve a waiting next() promise when an item is pushed', async () => {
        const queue = new AsyncQueue<number>();
        const promise = queue.next();
        queue.push(2);
        const result = await promise;
        expect(result).to.equal(2);
    });

    it('should process multiple queued items in FIFO order', async () => {
        const queue = new AsyncQueue<number>();
        queue.push(10);
        queue.push(20);
        queue.push(30);
        const result1 = await queue.next();
        const result2 = await queue.next();
        const result3 = await queue.next();

        expect(result1).to.equal(10);
        expect(result2).to.equal(20);
        expect(result3).to.equal(30);
    });

    it('should resolve multiple waiting next() promises in FIFO order', async () => {
        const queue = new AsyncQueue<string>();
        const promise1 = queue.next();
        const promise2 = queue.next();
        const promise3 = queue.next();

        // Push items after promises have been requested.
        queue.push('first');
        queue.push('second');
        queue.push('third');

        const result1 = await promise1;
        const result2 = await promise2;
        const result3 = await promise3;

        expect(result1).to.equal('first');
        expect(result2).to.equal('second');
        expect(result3).to.equal('third');
    });

    it('should mix queued items and waiting promises correctly', async () => {
        const queue = new AsyncQueue<number>();

        // Push one item so that next() resolves immediately.
        queue.push(100);
        const result1 = await queue.next();

        // Request a new item (will wait).
        const promise2 = queue.next();

        // Push another item.
        queue.push(200);
        const result2 = await promise2;

        expect(result1).to.equal(100);
        expect(result2).to.equal(200);
    });

    it('should not resolve next() promise until push() is called', async () => {
        const queue = new AsyncQueue<number>();
        let resolved = false;

        // Call next() without pushing anything. It should wait.
        const promise = queue.next().then(() => { resolved = true; });

        // Wait a short time to simulate asynchronous delay.
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(resolved).to.be.false;

        // Now push an item and the waiting promise should resolve.
        queue.push(500);
        await promise;
        expect(resolved).to.be.true;
    });

});