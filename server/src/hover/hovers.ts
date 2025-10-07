import { createHoverProvider } from './provider';
import { ifDocs } from './ifDocs';
import { mapDocs } from './mapDocs';
import { elsifDocs } from './elsifDocs';
import { elseDocs } from './elseDocs';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { type TextDocuments } from 'vscode-languageserver';

export function hoverProvider(documents: TextDocuments<TextDocument>) {
    return createHoverProvider(documents, [
        {
            regex: /\s(if|elsif)="[^"]*"/g,
            getDoc: (attrName) => (attrName === 'if' ? ifDocs : elsifDocs),
        },
        {
            regex: /\selse(?=\s|>)/g,
            getDoc: () => elseDocs,
        },
        {
            regex: /map="([^"]*)"/g,
            getDoc: () => mapDocs,
        },
    ]);
}
