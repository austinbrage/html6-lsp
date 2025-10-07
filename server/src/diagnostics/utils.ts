import { Diagnostic, DiagnosticSeverity, Position } from 'vscode-languageserver';

/**
 * Converts a string index into a VS Code `Position` (line and character).
 *
 * @param text The full text content.
 * @param index The zero-based character index in the text.
 * @returns A `Position` object with `line` and `character` properties.
 *
 * @example
 * const text = "hello\nworld";
 * console.log(getPositionFromIndex(text, 7)); // { line: 1, character: 1 }
 */
function getPositionFromIndex(text: string, index: number): Position {
    const lines = text.slice(0, index).split(/\r?\n/);
    const line = lines.length - 1;
    const character = lines[lines.length - 1].length;
    return { line, character };
}

function addDiagnostic({
    start,
    end,
    text,
    message,
    diagnostics,
    severity,
}: {
    start: number;
    end: number;
    text: string;
    message: string;
    diagnostics: Diagnostic[];
    severity?: DiagnosticSeverity;
}) {
    diagnostics.push({
        severity: severity ?? DiagnosticSeverity.Error,
        range: {
            start: getPositionFromIndex(text, start),
            end: getPositionFromIndex(text, end),
        },
        message,
        source: 'html6-lsp',
    });
}

export { addDiagnostic };
