import { describe, it, expect, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createHoverProvider } from '../../src/hover/provider';

describe('createHoverProvider', () => {
    it('should return hover content when cursor is over the attribute', () => {
        const text = `<div id="my-element"></div>`;
        const doc = TextDocument.create('file://test.html', 'html', 1, text);

        const documents: any = {
            get: vi.fn(() => doc),
        };

        const hoverProvider = createHoverProvider(documents, [
            {
                regex: /\s(id)="[^"]*"/g,
                getDoc: () => 'Fake hover content',
            },
        ]);

        const position = doc.positionAt(text.indexOf('id'));
        const hover = hoverProvider({ textDocument: { uri: doc.uri }, position });

        expect(hover).not.toBeNull();
        expect((hover?.contents as any).value).toBe('Fake hover content');
    });

    it('should return null when cursor is not over the attribute', () => {
        const text = `<div id="my-element"></div>`;
        const doc = TextDocument.create('file://test.html', 'html', 1, text);

        const documents: any = {
            get: vi.fn(() => doc),
        };

        const hoverProvider = createHoverProvider(documents, [
            {
                regex: /\s(id)="[^"]*"/g,
                getDoc: () => 'Fake hover content',
            },
        ]);

        const position = doc.positionAt(text.indexOf('<div'));
        const hover = hoverProvider({ textDocument: { uri: doc.uri }, position });

        expect(hover).toBeNull();
    });
});
