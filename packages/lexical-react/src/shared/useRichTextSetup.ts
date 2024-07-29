/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical'

import useLayoutEffect from 'shared/useLayoutEffect'

import { registerRichText } from '@lexical/rich-text'
import { mergeRegister } from '@lexical/utils'

export function useRichTextSetup(editor: LexicalEditor, text_mode?: boolean): void {
	useLayoutEffect(() => {
		return mergeRegister(registerRichText(editor, text_mode))
	}, [editor])
}
