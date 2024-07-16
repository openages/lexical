/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorConfig, LexicalNode, NodeKey, RangeSelection, SerializedElementNode } from 'lexical'

import { $applyNodeReplacement, $setImportNode, ElementNode } from 'lexical'

/** @noInheritDoc */
export class OverflowNode extends ElementNode {
	constructor(key?: NodeKey) {
		super(key)
		this.__type = 'overflow'
	}

	static getType(): string {
		return 'overflow'
	}

	static clone(node: OverflowNode): OverflowNode {
		return new OverflowNode(node.__key)
	}

	static importJSON(serializedNode: SerializedElementNode, update?: boolean): OverflowNode {
		const node = $createOverflowNode(serializedNode.key)

		if (!update) $setImportNode(serializedNode.key, node)

		return node
	}

	static importDOM(): null {
		return null
	}

	exportJSON(): SerializedElementNode {
		return {
			...super.exportJSON(),
			type: 'overflow'
		}
	}

	createDOM(config: EditorConfig): HTMLElement {
		const div = document.createElement('span')
		const className = config.theme.characterLimit
		if (typeof className === 'string') {
			div.className = className
		}
		return div
	}

	updateDOM(prevNode: OverflowNode, dom: HTMLElement): boolean {
		return false
	}

	insertNewAfter(selection: RangeSelection, restoreSelection = true): null | LexicalNode {
		const parent = this.getParentOrThrow()
		return parent.insertNewAfter(selection, restoreSelection)
	}

	excludeFromCopy(): boolean {
		return true
	}
}

export function $createOverflowNode(key?: string): OverflowNode {
	return $applyNodeReplacement(new OverflowNode(key))
}

export function $isOverflowNode(node: LexicalNode | null | undefined): node is OverflowNode {
	return node instanceof OverflowNode
}
