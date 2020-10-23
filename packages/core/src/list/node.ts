/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * A doubly-linked data node containing any type of data.
 */
export class ListNode<T = any> {
	public prev: ListNode | undefined = undefined;
	public next: ListNode | undefined = undefined;

	constructor(public value: T) { }
}
