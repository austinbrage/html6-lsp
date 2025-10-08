import { walkTemplateAST } from '../../src/diagnostics/walker';
import { validateIfSyntax } from '../../src/diagnostics/if';
import { describe, it, expect } from 'vitest';

describe('If Validator', () => {
    describe('valid expressions', () => {
        it('should pass for simple property access', () => {
            const text = `<div if="user.isAdmin"></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for comparison expression', () => {
            const text = `<div if="count > 0"></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for logical AND', () => {
            const text = `<div if="count > 0 && items.length > 0"></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for string comparison', () => {
            const text = `<div elsif="item.value === 'test'"></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('invalid expressions', () => {
        it('should not match attributes that only contain "if" as substring (e.g., aif)', () => {
            const text = `<div aif="false"></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should return error for missing closing parenthesis', () => {
            const text = `<div if="user.isAdmin("></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid if expression/);
        });

        it('should return error for incomplete comparison', () => {
            const text = `<div if="count > "></div>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid if expression/);
        });

        it('should detect empty if attribute as invalid', () => {
            const text = `<li if=""></li>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/if attributes cannot be empty/);
        });

        it('should detect empty if attribute as invalid and highlight entire attribute', () => {
            const text = `<li if=""></li>`;
            const diagnostics = walkTemplateAST(text, [validateIfSyntax]);

            expect(diagnostics).toHaveLength(1);

            const attrString = `if=""`;
            const startOffset = text.indexOf(attrString);
            const endOffset = startOffset + attrString.length;

            const { start, end } = diagnostics[0].range;

            const startIdx = start.line * text.length + start.character;
            const endIdx = end.line * text.length + end.character;

            expect(startIdx).toBe(startOffset);
            expect(endIdx).toBe(endOffset);
        });
    });
});
