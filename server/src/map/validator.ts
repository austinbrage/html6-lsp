import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { getPositionFromIndex } from '../utils/position';

/**
 * Validates `map` attributes in a string.
 * Checks that they follow "item of items" or "item, i of items" syntax,
 * and that the expression after `of` is a valid JavaScript expression.
 *
 * @param text - Text containing `map` attributes.
 * @returns Array of diagnostics for invalid syntax.
 */
function validateMapSyntax(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const mapAttrRegex = /map="([^"]*)"/g;

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
    while ((match = mapAttrRegex.exec(text)) !== null) {
        const value = match[1].trim();
        const startIdx = match.index;
        const endIdx = match.index + match[0].length;

        if (value.length === 0) {
            addDiagnostic(
                startIdx,
                endIdx,
                'Map attribute cannot be empty',
                DiagnosticSeverity.Warning
            );
            continue;
        }

        const parts = value.split(/\s+of\s+/);
        if (parts.length !== 2) {
            addDiagnostic(
                startIdx,
                endIdx,
                `Invalid map syntax: "${value}".\n\n Expected "item of items" or "item, i of items".`
            );
            continue;
        }

        const [left, right] = parts;
        if (!/^\w+(,\s*\w+)?$/.test(left)) {
            addDiagnostic(
                startIdx,
                endIdx,
                `Invalid map variable part: "${left}".\n\n Must be "item" or "item, i".`
            );
            continue;
        }

        try {
            new Function(`return (${right});`);
        } catch {
            addDiagnostic(
                startIdx,
                endIdx,
                `Invalid expression in map item: "${right}".\n\n Must be a valid JavaScript expression.`
            );
        }
    }

    return diagnostics;
}

export { validateMapSyntax };
