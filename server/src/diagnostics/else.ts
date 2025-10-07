import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateElsePosition(ctx: ValidationContext) {
    const { node, index, siblings, text, diagnostics } = ctx;

    if (node.type !== 'element' || !node.attributes) {
        return;
    }

    const elseAttr = node.attributes.find((a) => a.key === 'else');
    const elsifAttr = node.attributes.find((a) => a.key === 'elsif');
    if (!elseAttr && !elsifAttr) {
        return;
    }

    // Look for previous node of type "element"
    let prevElement = null;
    for (let i = index - 1; i >= 0; i--) {
        if (siblings[i].type === 'element') {
            prevElement = siblings[i];
            break;
        }
    }

    const isValidPrev =
        prevElement &&
        (prevElement as HimalayaNode).attributes?.some((a) => a.key === 'if' || a.key === 'elsif');

    if (!isValidPrev) {
        const attrName = elseAttr ? 'else' : 'elsif';
        const searchString = attrName;
        const attrIndex = text.indexOf(searchString);
        const startPos = getPositionFromIndex(text, attrIndex);
        const endPos = getPositionFromIndex(text, attrIndex + searchString.length);

        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: { start: startPos, end: endPos },
            message: `${attrName} must follow an element with "if" or "elsif".`,
            source: 'html6-lsp',
        });
    }
}
