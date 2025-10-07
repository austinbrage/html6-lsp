import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateIfSyntax(ctx: ValidationContext) {
    const { node, text, diagnostics } = ctx;
    if (node.type !== 'element' || !node.attributes) {
        return;
    }

    const ifAttrs = node.attributes.filter((a) => a.key === 'if' || a.key === 'elsif');

    for (const attr of ifAttrs) {
        const attrName = attr.key;
        const value = attr.value;

        if (value?.trim() === '') {
            pushDiag(`${attrName} attributes cannot be empty`, DiagnosticSeverity.Warning);
            continue;
        }

        if (!value) {
            pushDiag(`${attrName} attributes must have a value`, DiagnosticSeverity.Warning);
            continue;
        }

        // Validate JS expression
        try {
            new Function(`return (${value});`);
        } catch {
            pushDiag(
                `Invalid ${attrName} expression: "${value}".\n\nMust be a valid JavaScript expression.`,
                DiagnosticSeverity.Error
            );
        }

        function pushDiag(message: string, severity: DiagnosticSeverity) {
            let attrString = value !== undefined ? `${attrName}="${attr.value}"` : attrName;
            const attrIndex = text.indexOf(attrString);
            const start = getPositionFromIndex(text, attrIndex);
            const end = getPositionFromIndex(text, attrIndex + attrString.length);
            diagnostics.push({
                severity,
                range: { start, end },
                message,
                source: 'html6-lsp',
            });
        }
    }
}
