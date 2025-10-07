import { Diagnostic } from 'vscode-languageserver';
import { parse } from 'himalaya';
import { type ValidationContext } from '../../types/diagnostics';

export function walkTemplateAST(
    text: string,
    validators: ((ctx: ValidationContext) => void)[]
): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const ast = parse(text);

    function walk(nodes: HimalayaNode[]) {
        nodes.forEach((node, index, siblings) => {
            const ctx: ValidationContext = { text, node, index, siblings, diagnostics };

            for (const validator of validators) {
                validator(ctx);
            }

            // Traverse and walk over children inside template tags
            if (node.type === 'element' && node.tagName === 'template' && node.children?.length) {
                node.children.forEach((child) => {
                    if (child.type === 'text' && child.content?.trim()) {
                        const innerAst = parse(child.content);
                        walk(innerAst);
                    }
                });
            }

            // Traverse over normal children
            if (node.type === 'element' && node.children?.length) {
                walk(node.children);
            }
        });
    }

    walk(ast);
    return diagnostics;
}
