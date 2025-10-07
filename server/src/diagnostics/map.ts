import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateMapSyntax(ctx: ValidationContext) {
    const { node, text, diagnostics } = ctx;
    if (node.type !== 'element' || !node.attributes) {
        return;
    }

    const mapAttrs = node.attributes.filter((a) => a.key === 'map');

    for (const attr of mapAttrs) {
        const value = attr.value?.trim();
        const attrName = attr.key;

        if (!value) {
            pushDiag('Map attribute must have a value', DiagnosticSeverity.Warning);
            continue;
        }

        const parts = value.split(/\s+of\s+/);
        if (parts.length !== 2) {
            pushDiag(
                `Invalid map syntax: "${value}".\n\nExpected "item of items" or "item, i of items".`,
                DiagnosticSeverity.Error
            );
            continue;
        }

        const [left, right] = parts;
        if (!/^\w+(,\s*\w+)?$/.test(left)) {
            pushDiag(
                `Invalid map variable part: "${left}".\n\nMust be "item" or "item, i".`,
                DiagnosticSeverity.Error
            );
            continue;
        }

        try {
            new Function(`return (${right});`);
        } catch {
            pushDiag(
                `Invalid expression in map items: "${right}".\n\nMust be a valid JavaScript expression.`,
                DiagnosticSeverity.Error
            );
        }

        function pushDiag(message: string, severity: DiagnosticSeverity) {
            let attrString = value !== undefined ? `${attrName}="${attr.value}"` : attrName;
            const attrIndex = text.indexOf(attrString);
            const start = getPositionFromIndex(text, attrIndex);
            const end = getPositionFromIndex(text, attrIndex + attrString.length);
            diagnostics.push({ severity, range: { start, end }, message, source: 'html6-lsp' });
        }
    }
}
