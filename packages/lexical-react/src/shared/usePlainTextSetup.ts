/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalEditor} from 'lexical';

import useLayoutEffect from 'shared/useLayoutEffect'

import { registerPlainText } from '@lexical/plain-text'
import { mergeRegister } from '@lexical/utils'

export function usePlainTextSetup(editor: LexicalEditor): void {
  useLayoutEffect(() => {
    return mergeRegister(
      registerPlainText(editor),
    );

    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
}