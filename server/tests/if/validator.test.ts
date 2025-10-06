import { validateIfSyntax } from '../../src/if/validator';
import { describe, it, expect } from 'vitest';

describe('If Validator', () => {
    describe('valid expressions', () => {
        it('should pass for simple property access', () => {
            const text = `<div if="user.isAdmin"></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for comparison expression', () => {
            const text = `<div if="count > 0"></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for logical AND', () => {
            const text = `<div if="count > 0 && items.length > 0"></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for string comparison', () => {
            const text = `<div elsif="item.value === 'test'"></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('invalid expressions', () => {
        it('should return error for missing closing parenthesis', () => {
            const text = `<div if="user.isAdmin("></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid if expression/);
        });

        it('should return error for incomplete comparison', () => {
            const text = `<div if="count > "></div>`;
            const diagnostics = validateIfSyntax(text);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid if expression/);
        });
    });
});
