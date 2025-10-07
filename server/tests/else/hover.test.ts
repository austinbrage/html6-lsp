import { TextDocument } from 'vscode-languageserver-textdocument';
import { elseDocs, hoverElseSyntax } from '../../src/else/hover';
import { describe, it, expect } from 'vitest';

describe('Else Hover', () => {
    it('should return hover content when over else attribute', () => {
        const doc = TextDocument.create('file://test.html', 'html', 1, '<div else></div>');

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverElseSyntax(documents as any);

        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 5 }, // inside `else`
        });

        expect(hover).not.toBeNull();
        expect((hover!.contents as any).value).toBe(elseDocs);
    });

    it('should return null when outside else attribute', () => {
        const doc = TextDocument.create('file://test.html', 'html', 1, '<div else></div>');

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverElseSyntax(documents as any);

        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 0 }, // outside `else`
        });

        expect(hover).toBeNull();
    });
});
