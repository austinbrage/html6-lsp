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
    const ifAttrRegex = /(if|elsif)(?:="([^"]*)")?/g;

    const addDiagnostic = (
        start: number,
        end: number,
        message: string,
        severity?: DiagnosticSeverity
    ) => {
        diagnostics.push({
            severity: severity ?? DiagnosticSeverity.Error,
            range: {
                start: getPositionFromIndex(text, start),
                end: getPositionFromIndex(text, end),
            },
            message,
            source: 'html6-lsp',
        });
    };

    let match;
    while ((match = ifAttrRegex.exec(text)) !== null) {
        const attrName = match[1];
        const value = match[2];

        const preText = text.slice(0, match.index);
        const lastOpen = preText.lastIndexOf('<');
        const lastClose = preText.lastIndexOf('>');

        if (lastOpen <= lastClose) {
            continue;
        }

        const startIdx = match.index;
        const endIdx = match.index + match[0].length;

        if (value === undefined) {
            addDiagnostic(
                startIdx,
                endIdx,
                `${attrName} attributes must have a value`,
                DiagnosticSeverity.Warning
            );
            continue;
        }

        if (value.length === 0) {
            addDiagnostic(
                startIdx,
                endIdx,
                `${attrName} attributes cannot be empty`,
                DiagnosticSeverity.Warning
            );
            continue;
        }

        // If non-empty, try parsing as JS expression
        try {
            new Function(`return (${value});`);
        } catch (e) {
            addDiagnostic(
                startIdx,
                endIdx,
                `Invalid ${attrName} expression: "${value}".\n\nMust be a valid JavaScript expression.`
            );
        }
    }

    return diagnostics;
}

export { validateIfSyntax };
