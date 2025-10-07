import { walkTemplateAST } from './walker';
import { validateIsSyntax } from './is';
import { validateIfSyntax } from './if';
import { validateElsePosition } from './else';
import { validateMapSyntax } from './map';

export function validateTemplate(text: string) {
    return walkTemplateAST(text, [
        validateIsSyntax,
        validateIfSyntax,
        validateElsePosition,
        validateMapSyntax,
    ]);
}
