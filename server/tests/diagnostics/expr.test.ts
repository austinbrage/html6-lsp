import { walkTemplateAST } from '../../src/diagnostics/walker';
import { validateExprSyntax } from '../../src/diagnostics/expr';
import { describe, it, expect } from 'vitest';

describe('Expr Validator', () => {
    describe('valid expressions', () => {
        it('should pass for simple property access', () => {
            const text = `<div id="{{user?.isAdmin}}">{{user?.isAdmin}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for comparison expression', () => {
            const text = `<div data-count="{{count > 0}}">"{{count > 0}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for single pipe', () => {
            const text = `<div>{{value |> esc}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for single pipe with arg', () => {
            const text = `<div>{{value |> split '.'}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for single pipe with complex arg', () => {
            const text = `<div>{{value |> process { a: '1' }}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should pass for chained pipes with args', () => {
            const text = `<div>{{user.name |> upper |> truncate 5 |> split '.'}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('invalid expressions', () => {
        it('should return error for wrong property access on content', () => {
            const text = `<div id="{{user.isAdmin}}">{{user./isAdmin}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid expression inside {{ }}/);
        });

        it('should return error for wrong property access on attribute', () => {
            const text = `<div id="{{user./isAdmin}}">{{user.isAdmin}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid expression inside {{ }}/);
        });

        it('should return error if left side is invalid JS', () => {
            const text = `<div>{{user. |> esc}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid expression inside {{ }}/);
        });

        it('should return error if pipe name is empty', () => {
            const text = `<div>{{value |> }}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Empty pipe expression/);
        });

        it('should return error if pipe name is invalid', () => {
            const text = `<div>{{value |> 0esc}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid pipe name/);
        });

        it('should return error if pipe arg is invalid', () => {
            const text = `<div>{{value |> split /'.'}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid pipe arguments/);
        });

        it('should return error if complex pipe arg is invalid', () => {
            const text = `<div>{{value |> process { a: /'1' }}}</div>`;
            const diagnostics = walkTemplateAST(text, [validateExprSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(/Invalid pipe arguments/);
        });
    });
});
