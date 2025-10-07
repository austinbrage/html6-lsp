import { walkTemplateAST } from './walker';
import { validateIfSyntax } from './if';

export function validateTemplate(text: string) {
    return walkTemplateAST(text, [validateIfSyntax]);
}
