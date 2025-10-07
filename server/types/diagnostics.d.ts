import { type Diagnostic } from 'vscode-languageserver';

type ValidationContext = {
    text: string;
    node: HimalayaNode;
    index: number;
    siblings: HimalayaNode[];
    diagnostics: Diagnostic[];
};
