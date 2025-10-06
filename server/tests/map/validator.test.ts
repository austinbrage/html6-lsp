import { validateMapSyntax } from '../../src/map/validator';
import { describe, it, expect } from 'vitest';

describe('Map Validator', () => {
    describe('Valid map attributes', () => {
        it('should allow "item of items"', () => {
            const text = `<li map="item of items"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "item, i of items"', () => {
            const text = `<li map="item, i of items"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "nav of layout?.navigation"', () => {
            const text = `<li map="nav of layout?.navigation"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "item of layout?.[0]?.items"', () => {
            const text = `<li map="item of layout?.[0]?.items"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow "x, i of data[0].list?.[3]"', () => {
            const text = `<li map="x, i of data[0].list?.[3]"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('Invalid map attributes', () => {
        it('should detect "item in items" as invalid', () => {
            const text = `<li map="item in items"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map syntax');
        });

        it('should detect "item, of items" as invalid', () => {
            const text = `<li map="item, of items"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map syntax');
        });

        it('should detect "item," as invalid', () => {
            const text = `<li map="item,"></li>`;
            const diagnostics = validateMapSyntax(text);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain('Invalid map syntax');
        });

        // it('should detect empty map attribute as invalid', () => {
        //     const text = `<li map=""></li>`;
        //     const diagnostics = validateMapSyntax(text);
        //     expect(diagnostics).toHaveLength(1);
        //     expect(diagnostics[0].message).toContain('Invalid map syntax');
        // });
    });
});
