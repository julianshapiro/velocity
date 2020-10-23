/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { ListNode } from "./node";

/**
 * A doubly-linked list. Additionally whenever something is added to the end of
 * the list it will be remembered, which can then be consumed (via `list.next`),
 * moving the pointer to the next entry.
 */
export class LinkedList<T = any> {
	/**
	 * First item in list.
	 */
	#head: ListNode | undefined = undefined;

	/**
	 * Number of items in list.
	 */
	#length: number = 0;

	/**
	 * Next item that has not been consumed via `next()`.
	 */
	#next: ListNode | undefined = undefined;

	/**
	 * Last item in list.
	 */
	#tail: ListNode | undefined = undefined;

	/**
	 * Iterate through the values in the list. The current node can be removed
	 * without affecting this.
	 */
	public *[Symbol.iterator](): Generator<T, void, undefined> {
		let next = this.#head;

		for (let node = next; node; node = next) {
			next = node.next;
			yield node.value;
		}
	}

	/**
	 * Get the current unprocessed entry from the list. Unlike `.next` this will
	 * not change the pointer.
	 */
	public get current(): T | undefined {
		return this.#next?.value;
	}

	/**
	 * Find the node related to a value.
	 */
	private find(value: T): ListNode<T> | undefined {
		for (let node = this.#head; node; node = node.next) {
			if (node.value === value) {
				return node;
			}
		}
	}

	/**
	 * Get the first entry in the list.
	 */
	public get first(): T | undefined {
		return this.#head?.value;
	}

	/**
	 * Clear the remembered next entry.
	 */
	public forget(): this {
		this.#next = undefined;

		return this;
	}
	/**
	 * Get the value at a specific index in the list.
	 */
	public get(index: number): T | undefined {
		return this.getNode(index)?.value;
	}

	/**
	 * Get the `ListNode` at a specific index in the list. Returns undefined if
	 * the index is longer than the list.
	 */
	protected getNode(index: number): ListNode<T> | undefined {
		if (index >= this.#length) {
			return;
		}
		let node = this.#head;

		while (index-- > 0 && node) {
			node = node.next;
		}

		return node;
	}

	/**
	 * Get the first `ListNode` entry in the list.
	 */
	public get head(): ListNode<T> | undefined {
		return this.#head;
	}

	/**
	 * Insert a value at a specified index in the list. If the added node is not
	 * added to the end of the list then it will not appear as the next item.
	 */
	public insert(index: number, value: T): this {
		const node = new ListNode<T>(value);

		if (!this.#head) {
			this.#head = this.#tail = this.#next = node;
		} else if (index <= 0) {
			node.next = this.#head;
			this.#head.prev = node;
			this.#head = node;
		} else if (index >= this.#length) {
			node.prev = this.#tail;
			if (this.#tail) {
				this.#tail.next = node;
			}
			this.#tail = node;
			this.#next ||= node;
		} else {
			const next = node.next = this.getNode(index)!; // We're definitely within bounds
			const prev = node.prev = next.prev!; // We're definitely within bounds

			next.prev = node;
			prev.next = node;
		}
		this.#length++;

		return this;
	}

	/**
	 * Get the last entry in the list.
	 */
	public get last(): T | undefined {
		return this.#tail?.value;
	}

	/**
	 * Get the number of items in the list.
	 */
	public get length(): number {
		return this.#length;
	}

	/**
	 * Get the next unprocessed entry from the list. Anything added to the tail
	 * is automatically remembered, so this allows you to consume the entries at
	 * a later point.
	 */
	public get next(): T | undefined {
		const stash = this.#next;

		this.#next = stash?.next;

		return stash?.value;
	}

	/**
	 * Remove and return the last value from the list.
	 */
	public pop(): T | undefined {
		if (this.#next === this.#tail) {
			this.#next = undefined;
		}
		return this.removeNode(this.#tail);
	}

	/**
	 * Add a value to the end of the list.
	 */
	public push(value: T): this {
		return this.insert(this.#length, value);
	}

	/**
	 * Remove and return the value at a specified index in the list.
	 */
	public remove(value: T): T | undefined {
		return this.removeNode(this.find(value));
	}

	/**
	 * Remove and return the `ListNode` at a specified index in the list.
	 */
	protected removeNode(node?: ListNode<T>): T | undefined {
		if (!node) {
			return;
		}

		const { prev, next } = node;

		if (prev) {
			prev.next = next;
		} else {
			this.#head = next;
		}
		if (next) {
			next.prev = prev;
		} else {
			if (this.#next === node) {
				this.#next = undefined;
			}
			this.#tail = prev;
		}
		node.next = node.prev = undefined;
		this.#length--;

		return node.value;
	}

	/**
	 * Get the value at a specific index in the list.
	 */
	public set(index: number, value: T): this {
		const node = this.getNode(index);

		if (node) {
			node.value = value;
		}

		return this;
	}

	/**
	 * Remove and return the first value from the list.
	 */
	public shift(): T | undefined {
		return this.removeNode(this.#head);
	}

	/**
	 * Get the last `ListNode` entry in the list.
	 */
	public get tail(): ListNode<T> | undefined {
		return this.#tail;
	}

	/**
	 * Add a value to the start of the list. This cannot affect the next item
	 * unlesss the list is currently empty.
	 */
	public unshift(value: T): this {
		return this.insert(0, value);
	}
}
