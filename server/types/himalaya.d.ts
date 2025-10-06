declare module 'himalaya' {
    export function parse(html: string): HimalayaNode[];
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
}
