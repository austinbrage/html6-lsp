import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { getPositionFromIndex } from '../utils/position';

/**
 * Validates `if` and `elsif` attributes in HTML-like templates.
 * Checks if the value is a valid JavaScript expression.
 *
 * @param text - The template text containing `if` / `elsif` attributes.
 * @returns Array of diagnostics for invalid expressions.
 */
function validateIfSyntax(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const ifAttrRegex = /(if|elsif)="([^"]+)"/g;

    let match;
    while ((match = ifAttrRegex.exec(text)) !== null) {
        const attrName = match[1];
        const value = match[2].trim();

        // Try parsing the expression using Function constructor
        try {
            // Wrap in a return to check as an expression
            new Function(`return (${value});`);
        } catch (e) {
            const startPos = getPositionFromIndex(text, match.index);
            const endPos = getPositionFromIndex(text, match.index + match[0].length);

            diagnostics.push({
                severity: DiagnosticSeverity.Error,
                range: { start: startPos, end: endPos },
                message: `Invalid ${attrName} expression: "${value}".\n\nMust be a valid JavaScript expression.`,
                source: 'html6-lsp',
            });
        }
    }

    return diagnostics;
}

export { validateIfSyntax };
