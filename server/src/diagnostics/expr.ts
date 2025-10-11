import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateExprSyntax(ctx: ValidationContext) {
    const { node, text, diagnostics } = ctx;

    if (node.type === 'text' && node.content) {
        validateInText(node.content, text, node.position?.start.index ?? 0);
    }

    if (node.type === 'element' && node.attributes) {
        for (const attr of node.attributes) {
            if (!attr.value) {
                continue;
            }
            validateInText(attr.value, text, text.indexOf(attr.value));
        }
    }

    function validateInText(str: string, fullText: string, baseIndex: number) {
        let match;
        // const exprRegex = /\{\{([\s\S]+?)\}\}/g;

        // Matches {{ ... }} expressions, but ignores closing braces that are part of a triple "}}}" sequence
        // Example: in "{{value |> fn { a: 1 }}}", it ensures the match ends at the last "}}"
        const exprRegex = /\{\{([\s\S]+?)\}\}(?!\})/g;

        while ((match = exprRegex.exec(str)) !== null) {
            const fullMatch = match[0];
            const expression = match[1].trim();
            const exprStart = baseIndex + match.index;
            const exprEnd = exprStart + fullMatch.length;

            if (!expression) {
                pushDiag('Empty {{}} expression', DiagnosticSeverity.Warning);
                continue;
            }

            const pipeParts = expression.split('|>').map((p) => p.trim());
            if (pipeParts.length > 1) {
                validatePipeExpression(pipeParts);
            } else {
                validateJsExpression(expression);
            }

            function validateJsExpression(expr: string) {
                try {
                    new Function(`return (${expr});`);
                } catch {
                    pushDiag(
                        `Invalid expression inside {{ }}: "${expr}".\n\nMust be a valid JavaScript expression.`,
                        DiagnosticSeverity.Error
                    );
                }
            }

            function validatePipeExpression(parts: string[]) {
                const [first, ...rest] = parts;
                if (!first) {
                    pushDiag('Left side of |> cannot be empty', DiagnosticSeverity.Error);
                    return;
                }

                validateJsExpression(first);

                for (const pipe of rest) {
                    if (!pipe) {
                        pushDiag(
                            'Empty pipe expression after |> operator',
                            DiagnosticSeverity.Error
                        );
                        return;
                    }

                    const j = pipe.indexOf(' ');
                    const pipeName = j === -1 ? pipe : pipe.slice(0, j).trim();
                    const args = j === -1 ? '' : pipe.slice(j + 1).trim();

                    const validName = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
                    if (!validName.test(pipeName)) {
                        pushDiag(
                            `Invalid pipe name: "${pipeName}".\n\nMust be a valid JavaScript function name.`,
                            DiagnosticSeverity.Error
                        );
                        return;
                    }

                    if (args) {
                        try {
                            new Function(`return (${args});`);
                        } catch {
                            pushDiag(
                                `Invalid pipe arguments for "${pipeName}": "${args}".\n\nArguments must be valid JavaScript expressions.`,
                                DiagnosticSeverity.Error
                            );
                            return;
                        }
                    }
                }
            }

            function pushDiag(message: string, severity: DiagnosticSeverity) {
                const start = getPositionFromIndex(fullText, exprStart);
                const end = getPositionFromIndex(fullText, exprEnd);
                diagnostics.push({
                    severity,
                    range: { start, end },
                    message,
                    source: 'html6-lsp',
                });
            }
        }
    }
}
