import { TextDocument } from 'vscode-languageserver-textdocument';
import { mapDocs, hoverMapSyntax } from '../../src/map/hover';
import { describe, it, expect } from 'vitest';

describe('Map Hover', () => {
    it('should return hover content when over map attribute', () => {
        const doc = TextDocument.create(
            'file://test.html',
            'html',
            1,
            '<li map="item of items"></li>'
        );

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverMapSyntax(documents as any);

        // Call the hover function at a position INSIDE the map attribute
        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 6 },
        });

        expect(hover).not.toBeNull();
        expect((hover!.contents as any).value).toBe(mapDocs);
    });

    it('should return null when outside map attribute', () => {
        const doc = TextDocument.create(
            'file://test.html',
            'html',
            1,
            '<li map="item of items"></li>'
        );

        const documents = new Map<string, TextDocument>();
        documents.set(doc.uri, doc);

        const hoverHandler = hoverMapSyntax(documents as any);

        // Call the hover function at a position OUTSIDE the map attribute
        const hover = hoverHandler({
            textDocument: { uri: doc.uri },
            position: { line: 0, character: 0 },
        });

        expect(hover).toBeNull();
    });
});
