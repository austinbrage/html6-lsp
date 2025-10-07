import { walkTemplateAST } from '../../src/diagnostics/walker';
import { validateIsSyntax } from '../../src/diagnostics/is';
import { describe, it, expect } from 'vitest';

describe('Is Validator', () => {
    describe('valid expressions', () => {
        it('should pass for correct attribute', () => {
            const text = `<template is="header"></template>`;
            const diagnostics = walkTemplateAST(text, [validateIsSyntax]);
            expect(diagnostics).toHaveLength(0);
        });
    });
    describe('invalid expressions', () => {
        it('should return error for missing attr key', () => {
            const text = `<template></template>`;
            const diagnostics = walkTemplateAST(text, [validateIsSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(
                /template tags must have a non-empty "is" attribute indicating its name./
            );
        });

        it('should return error for missing attr value', () => {
            const text = `<template is></template>`;
            const diagnostics = walkTemplateAST(text, [validateIsSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(
                /"is" attributes on template tags must have a value./
            );
        });

        it('should return error for missing attr value', () => {
            const text = `<template is=""></template>`;
            const diagnostics = walkTemplateAST(text, [validateIsSyntax]);
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].message).toMatch(
                /"is" attributes on template tags must have a value./
            );
        });
    });
});
