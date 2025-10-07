import { walkTemplateAST } from '../../src/diagnostics/walker';
import { validateMapSyntax } from '../../src/diagnostics/map';
import { describe, it, expect } from 'vitest';

describe('Map Validator', () => {
    describe('Valid map attributes', () => {
        it('should allow "item of items"', () => {
            const text = `<li map="item of items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "item, i of items"', () => {
            const text = `<li map="item, i of items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "nav of layout?.navigation"', () => {
            const text = `<li map="nav of layout?.navigation"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "item of layout?.[0]?.items"', () => {
            const text = `<li map="item of layout?.[0]?.items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "x, i of data[0].list?.[3]"', () => {
            const text = `<li map="x, i of data[0].list?.[3]"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow valid expression on map items', () => {
            const text = `<li map="item of project.items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('Invalid map attributes', () => {
        it('should detect "item in items" as invalid', () => {
            const text = `<li map="item in items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map syntax');
        });

        it('should detect "item, of items" as invalid', () => {
            const text = `<li map="item, of items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map variable part');
        });

        it('should detect "item," as invalid', () => {
            const text = `<li map="item,"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map syntax');
        });

        it('should detect empty map attribute as invalid', () => {
            const text = `<li map=""></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Map attribute must have a value');
        });

        it('should detect invalid expression on map items', () => {
            const text = `<li map="item of project/.items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid expression in map item');
        });

        it('should detect invalid expression on map items and highlight entire attribute', () => {
            const text = `<li map="item of project/.items"></li>`;
            const diagnostics = walkTemplateAST(text, [validateMapSyntax]);

            expect(diagnostics).toHaveLength(1);

            const attrString = `map="item of project/.items"`;
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
