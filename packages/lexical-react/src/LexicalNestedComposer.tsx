/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalComposerContextType} from '@lexical/react/LexicalComposerContext';
import type {KlassConstructor, Transform} from 'lexical';

import { EditorThemeClasses, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from 'lexical'
import { useContext, useEffect, useMemo, ReactNode } from 'react'
import invariant from 'shared/invariant'

import { createLexicalComposerContext, LexicalComposerContext } from '@lexical/react/LexicalComposerContext'

function getTransformSetFromKlass(
  klass: KlassConstructor<typeof LexicalNode>,
): Set<Transform<LexicalNode>> {
  const transform = klass.transform();
  return transform !== null
    ? new Set<Transform<LexicalNode>>([transform])
    : new Set<Transform<LexicalNode>>();
}

export function LexicalNestedComposer({
  initialEditor,
  children,
  initialNodes,
  initialTheme,
}: {
  children: ReactNode;
  initialEditor: LexicalEditor;
  initialTheme?: EditorThemeClasses;
  initialNodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
}): JSX.Element {
  const parentContext = useContext(LexicalComposerContext);

  if (parentContext == null) {
    invariant(false, 'Unexpected parent context null on a nested composer');
  }

  const [parentEditor, {getTheme: getParentTheme}] = parentContext;

  const composerContext: [LexicalEditor, LexicalComposerContextType] = useMemo(
    () => {
      const composerTheme: EditorThemeClasses | undefined =
        initialTheme || getParentTheme() || undefined;

      const context: LexicalComposerContextType = createLexicalComposerContext(
        parentContext,
        composerTheme,
      );

      if (composerTheme !== undefined) {
        initialEditor._config.theme = composerTheme;
      }

      initialEditor._parentEditor = parentEditor;

      if (!initialNodes) {
        const parentNodes = (initialEditor._nodes = new Map(
          parentEditor._nodes,
        ));
        for (const [type, entry] of parentNodes) {
          initialEditor._nodes.set(type, {
            exportDOM: entry.exportDOM,
            klass: entry.klass,
            replace: entry.replace,
            replaceWithKlass: entry.replaceWithKlass,
            transforms: getTransformSetFromKlass(entry.klass),
          });
        }
      } else {
        for (let klass of initialNodes) {
          let replace = null;
          let replaceWithKlass = null;

          if (typeof klass !== 'function') {
            const options = klass;
            klass = options.replace;
            replace = options.with;
            replaceWithKlass = options.withKlass || null;
          }
          const registeredKlass = initialEditor._nodes.get(klass.getType());

          initialEditor._nodes.set(klass.getType(), {
            exportDOM: registeredKlass ? registeredKlass.exportDOM : undefined,
            klass,
            replace,
            replaceWithKlass,
            transforms: getTransformSetFromKlass(klass),
          });
        }
      }

      initialEditor._config.namespace = parentEditor._config.namespace;

      initialEditor._editable = parentEditor._editable;

      return [initialEditor, context];
    },

    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Update `isEditable` state of nested editor in response to the same change on parent editor.
  useEffect(() => {
    return parentEditor.registerEditableListener((editable) => {
      initialEditor.setEditable(editable);
    });
  }, [initialEditor, parentEditor]);

  return (
    <LexicalComposerContext.Provider value={composerContext}>
      {children}
    </LexicalComposerContext.Provider>
  );
}