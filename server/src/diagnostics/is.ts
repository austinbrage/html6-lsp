import { DiagnosticSeverity } from 'vscode-languageserver';
import { ValidationContext } from '../../types/diagnostics';
import { getPositionFromIndex } from './utils';

export function validateIsSyntax(ctx: ValidationContext) {
    const { node, text, diagnostics } = ctx;
    if (node.type !== 'element' || node.tagName !== 'template') {
        return;
    }

    if (!node.attributes || node.attributes.length === 0) {
        pushDiag(
            `template tags must have a non-empty "is" attribute indicating its name.`,
            DiagnosticSeverity.Warning
        );
        return;
    }

    const isAttr = node.attributes.find((a) => a.key === 'is');

    if (!isAttr || !isAttr.value) {
        pushDiag(`"is" attributes on template tags must have a value.`, DiagnosticSeverity.Warning);
    }

    function pushDiag(message: string, severity: DiagnosticSeverity) {
        const nodeStart = text.indexOf(`<template`);
        const start = getPositionFromIndex(text, nodeStart);
        const end = getPositionFromIndex(text, nodeStart + 'template'.length);
        diagnostics.push({
            severity,
            range: { start, end },
            message,
            source: 'html6-lsp',
        });
    }
}
