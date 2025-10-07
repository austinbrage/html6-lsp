import { HoverParams, Hover, type TextDocuments } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';

interface HoverConfig {
    regex: RegExp;
    getDoc: (attrName: string) => string;
}

export function createHoverProvider(
    documents: TextDocuments<TextDocument>,
    configs: HoverConfig[]
) {
    return (params: HoverParams): Hover | null => {
        const doc = documents.get(params.textDocument.uri);
        if (!doc) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const text = doc.getText();

        for (const { regex, getDoc } of configs) {
            let match: RegExpExecArray | null;
            while ((match = regex.exec(text)) !== null) {
                const start = match.index + (match[0].startsWith(' ') ? 1 : 0);
                const end = start + match[0].trim().length;

                if (offset >= start && offset <= end) {
                    const attrName = match[1] ?? match[0].trim();
                    return {
                        contents: {
                            kind: 'markdown',
                            value: getDoc(attrName),
                        },
                    };
                }
            }
        }

        return null;
    };
}
