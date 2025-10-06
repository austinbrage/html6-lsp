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

/**
 * Validates `map` attributes in a string.
 * Checks if they follow "item of items" or "item, i of items" syntax,
 * supporting optional chaining and array access.
 *
 * @param text - Text containing `map` attributes.
 * @returns Array of diagnostics for invalid syntax.
 */
function validateMapSyntax(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const mapAttrRegex = /map="([^"]+)"/g;

    let match;
    while ((match = mapAttrRegex.exec(text)) !== null) {
        const value = match[1].trim();

        // Validate syntax: "item of items" o "item, i of items"
        const valid = /^(\w+)(,\s*\w+)?\s+of\s+[\w$.?\[\]]+$/.test(value);
        if (!valid) {
            // Create a diagnosis (error)
            const startPos = getPositionFromIndex(text, match.index); // function that converts an index into a Position
            const endPos = getPositionFromIndex(text, match.index + match[0].length);

            diagnostics.push({
                severity: DiagnosticSeverity.Error,
                range: { start: startPos, end: endPos },
                message: `Invalid map syntax: "${value}".\n\nExpected "item of items" or "item, i of items".`,
                source: 'html6-lsp',
            });
        }
    }

    return diagnostics;
}

export { validateMapSyntax };
