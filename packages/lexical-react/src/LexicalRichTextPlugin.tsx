/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'

import { useCanShowPlaceholder } from './shared/useCanShowPlaceholder'
import { useDecorators, ErrorBoundaryType } from './shared/useDecorators'
import { useRichTextSetup } from './shared/useRichTextSetup'

export function RichTextPlugin({
	contentEditable,
	// TODO Remove. This property is now part of ContentEditable
	placeholder = null,
	ErrorBoundary,
	text_mode
}: {
	contentEditable: JSX.Element
	placeholder?: ((isEditable: boolean) => null | JSX.Element) | null | JSX.Element
	ErrorBoundary: ErrorBoundaryType
	text_mode?: boolean
}): JSX.Element {
	const [editor] = useLexicalComposerContext()
	const decorators = useDecorators(editor, ErrorBoundary)

	useRichTextSetup(editor, text_mode)

	return (
		<>
			{contentEditable}
			<Placeholder content={placeholder} />
			{decorators}
		</>
	)
}

// TODO remove
function Placeholder({
	content
}: {
	content: ((isEditable: boolean) => null | JSX.Element) | null | JSX.Element
}): null | JSX.Element {
	const [editor] = useLexicalComposerContext()
	const showPlaceholder = useCanShowPlaceholder(editor)
	const editable = useLexicalEditable()

	if (!showPlaceholder) {
		return null
	}

	if (typeof content === 'function') {
		return content(editable)
	} else {
		return content
	}
}
