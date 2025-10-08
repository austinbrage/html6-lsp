import { loadTemplateTags } from './load';
import { CompletionItemKind, type Connection } from 'vscode-languageserver';

export function completionHandlers(connection: Connection, workspaceRoot: string) {
    let templates = loadTemplateTags(workspaceRoot);

    connection.onDidChangeWatchedFiles((_change) => {
        // console.log('Updating template tags');
        templates = loadTemplateTags(workspaceRoot);
    });

    connection.onCompletion((_params) => {
        // console.log('templates', templates);
        return templates.map((t) => ({
            label: t,
            kind: CompletionItemKind.Class,
            insertText: `<${t}></${t}>`,
            documentation: `Call HTML6 component <${t}>|</${t}>`,
        }));
    });
}
