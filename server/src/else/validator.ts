import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { getPositionFromIndex } from '../utils/position';
import { parse } from 'himalaya';

function validateElseSyntax(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const ast = parse(text);

    function walkNodes(nodes: HimalayaNode[]) {
        nodes.forEach((node, index, siblings) => {
            if (node.type === 'element' && node.attributes) {
                const elseAttr = node.attributes.find((a) => a.key === 'else');
                const elsifAttr = node.attributes.find((a) => a.key === 'elsif');

                if (node.tagName === 'template' && node.children?.length) {
                    node.children.forEach((child) => {
                        if (child.type === 'text' && child?.content?.trim()) {
                            const innerAst = parse(child.content);
                            walkNodes(innerAst);
                        }
                    });
                    return;
                }

                if (elseAttr || elsifAttr) {
                    // Look for previous ELEMENT node
                    let prevElement = null;
                    for (let i = index - 1; i >= 0; i--) {
                        const prev = siblings[i];
                        if (prev.type === 'element') {
                            prevElement = prev;
                            break;
                        }
                    }

                    const isValidPrev =
                        prevElement &&
                        prevElement.attributes?.some((a) => a.key === 'if' || a.key === 'elsif');

                    if (!isValidPrev) {
                        const attrName = elseAttr ? 'else' : 'elsif';
                        const searchString = elseAttr
                            ? 'else'
                            : `elsif="${elsifAttr?.value ?? ''}"`;
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

                // Recursively traverse child nodes
                if (node.children?.length) {
                    walkNodes(node.children);
                }
            }
        });
    }

    walkNodes(ast);
    return diagnostics;
}

export { validateElseSyntax };
