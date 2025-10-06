import { TextDocument } from 'vscode-languageserver-textdocument';
import { ifDocs, hoverIfSyntax } from '../../src/if/hover';
import { describe, it, expect } from 'vitest';

describe('If Hover', () => {
    it('should return hover content when over if attribute', () => {
        const doc = TextDocument.create(
            'file://test.html',
            'html',
            1,
            '<div if="user.isAdmin"></div>'
        );

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverIfSyntax(documents as any);

        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 5 }, // inside `if`
        });

        expect(hover).not.toBeNull();
        expect((hover!.contents as any).value).toBe(ifDocs);
    });

    it('should return null when outside if attribute', () => {
        const doc = TextDocument.create(
            'file://test.html',
            'html',
            1,
            '<div if="user.isAdmin"></div>'
        );

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverIfSyntax(documents as any);

        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 0 }, // outside `if`
        });

        expect(hover).toBeNull();
    });
});
