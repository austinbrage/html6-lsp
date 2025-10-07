import { validateElsePosition } from '../../src/diagnostics/else';
import { walkTemplateAST } from '../../src/diagnostics/walker';
import { describe, it, expect } from 'vitest';

describe('Else Validator', () => {
    describe('valid placement', () => {
        it('should allow else immediately after if', () => {
            const text = `
                <div if="count > 0">Positive</div>
                <div else>Non-positive</div>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            console.log('diagnostics', diagnostics);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow else immediately after elsif', () => {
            const text = `
                <div if="count > 0">Positive</div>
                <div elsif="count === 0">Zero</div>
                <div else>Negative</div>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(0);
        });

        it('should allow else immediately after if on template tag', () => {
            const text = `
                <template is="header">
					<div if="true">Something</div>
                	<div else>Invalid</div>
				</template>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(0);
        });
    });

    describe('invalid placement', () => {
        it('should detect else following by nothing', () => {
            const text = `
                <div else>Invalid</div>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain(
                'else must follow an element with "if" or "elsif".'
            );
        });

        it('should detect else not following if or elsif', () => {
            const text = `
                <div>Something</div>
                <div else>Invalid</div>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain(
                'else must follow an element with "if" or "elsif".'
            );
        });

        it('should detect elsif not following if or elsif', () => {
            const text = `
                <div>Something</div>
                <div elsif="true">Invalid</div>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain(
                'elsif must follow an element with "if" or "elsif".'
            );
        });

        it('should detect else not following if or elsif on template tag', () => {
            const text = `
                <template is="header">
					<div>Something</div>
                	<div else>Invalid</div>
				</template>
            `;
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toContain(
                'else must follow an element with "if" or "elsif".'
            );
        });

        it('should detect elsif not following if or elsif and highlight entire attribute', () => {
            const text = '<div elsif="true">Invalid</div>';
            const diagnostics = walkTemplateAST(text, [validateElsePosition]);

            expect(diagnostics).toHaveLength(1);

            const attrString = `elsif="true"`;
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
