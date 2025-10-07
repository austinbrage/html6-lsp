import { walkTemplateAST } from '../../src/diagnostics/walker';
import { describe, it, expect, vi } from 'vitest';

describe('walkTemplateAST', () => {
    it('should walk a simple HTML structure', () => {
        const text = `<div><span></span></div>`;
        const mockValidator = vi.fn();

        walkTemplateAST(text, [mockValidator]);

        expect(mockValidator).toHaveBeenCalled();
        expect(mockValidator.mock.calls.length).toBeGreaterThan(0);
    });

    it('should walk nested template tags correctly', () => {
        const text = `
        <template>
            <div if="x > 0">
                <template>
                    <p else></p>
                </template>
            </div>
        </template>`;
        const mockValidator = vi.fn();

        walkTemplateAST(text, [mockValidator]);

        const calls = mockValidator.mock.calls.map((c) => c[0].node.tagName);
        expect(calls).toContain('div');
        expect(calls).toContain('p');
    });

    it('should accumulate diagnostics returned by validators', () => {
        const text = `<div></div>`;
        const fakeValidator = (ctx: any) => {
            ctx.diagnostics.push({
                message: 'fake error',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
                severity: 1,
                source: 'test',
            });
        };

        const diagnostics = walkTemplateAST(text, [fakeValidator]);

        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].message).toBe('fake error');
    });
});
