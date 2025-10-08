declare module 'himalaya' {
    export interface ParseOptions {
        includePositions?: boolean;
    }

    export const parseDefaults: ParseOptions;

    export function parse(html: string, options?: ParseOptions): HimalayaNode[];
}

interface HimalayaAttribute {
    key: string;
    value: string | null;
}

interface HimalayaNode {
    type: 'element' | 'text';
    tagName?: string;
    content?: string;
    attributes?: HimalayaAttribute[];
    children?: HimalayaNode[];
    position?: {
        start: { index: number; line: number; column: number };
        end: { index: number; line: number; column: number };
    };
}
