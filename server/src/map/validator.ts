import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { getPositionFromIndex } from '../utils/position';

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
    const mapAttrRegex = /map="([^"]*)"/g;

    let match;
    while ((match = mapAttrRegex.exec(text)) !== null) {
        const value = match[1].trim();

        // Validate syntax: "item of items" or "item, i of items"
        const valid = value.length > 0 && /^(\w+)(,\s*\w+)?\s+of\s+[\w$.?\[\]]+$/.test(value);
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
