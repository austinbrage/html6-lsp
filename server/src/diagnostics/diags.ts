import { walkTemplateAST } from './walker';
import { validateIfSyntax } from './if';
import { validateElsePosition } from './else';

export function validateTemplate(text: string) {
    return walkTemplateAST(text, [validateIfSyntax, validateElsePosition]);
}
