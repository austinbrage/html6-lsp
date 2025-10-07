import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateIsSyntax(ctx: ValidationContext) {
    const { node, text, diagnostics } = ctx;
    if (node.type !== 'element' && node.tagName !== 'template') {
        return;
    }

    if (!node.attributes || node.attributes?.length === 0) {
        pushDiag(
            `template tags must have a non-empty "is" attribute indicating its name.`,
            DiagnosticSeverity.Warning
        );
        return;
    }

    const isAttr = node.attributes.filter((a) => a.key === 'is');

    if (isAttr.length === 0) {
        pushDiag(`"is" attributes on template tags must have a value.`, DiagnosticSeverity.Warning);
    } else if (!isAttr[0]?.value) {
        pushDiag(`"is" attributes on template tags must have a value.`, DiagnosticSeverity.Warning);
    }

    function pushDiag(message: string, severity: DiagnosticSeverity) {
        const attrIndex = text.indexOf('template');
        const start = getPositionFromIndex(text, attrIndex);
        const end = getPositionFromIndex(text, attrIndex + 'template'.length);
        diagnostics.push({
            severity,
            range: { start, end },
            message,
            source: 'html6-lsp',
        });
    }
}
