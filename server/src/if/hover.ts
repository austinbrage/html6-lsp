import { HoverParams, Hover, type TextDocuments } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';

const ifDocs = `
## If Attribute

The \`if\` attribute controls conditional rendering in templates.

**Basic Syntax:**
- \`if="condition"\` – render the element if the condition is truthy.

### Examples:

**Simple if:**
\`\`\`html
<div if="user.isAdmin">
  Admin content
</div>
\`\`\`

**If / Elsif / Else:**
\`\`\`html
<div if="count > 0">
  Positive
</div>
<div elsif="count === 0">
  Zero
</div>
<div else>
  Negative
</div>
\`\`\`
`;

const elsifDocs = `
## Elsif Attribute

The \`elsif\` attribute works like \`if\`, but only executes if the previous \`if\` or \`elsif\` was false.

**Basic Syntax:**
- \`elsif="condition"\` – render the element if the condition is truthy and previous \`if\` or \`elsif\` was false.

### Examples:

**If / Elsif / Else:**
\`\`\`html
<div if="count > 0">
  Positive
</div>
<div elsif="count === 0">
  Zero
</div>
<div else>
  Negative
</div>
\`\`\`
`;

/**
 * Creates a hover provider for `if` and `elsif` attributes.
 */
function hoverIfSyntax(documents: TextDocuments<TextDocument>) {
    return (params: HoverParams): Hover | null => {
        const doc = documents.get(params.textDocument.uri);
        if (!doc) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const text = doc.getText();

        // match if="..." or elsif="..." with at least one space before attribute
        const attrRegex = /\s(if|elsif)="[^"]*"/g;
        let match: RegExpExecArray | null;

        while ((match = attrRegex.exec(text)) !== null) {
            const start = match.index + 1; // skip leading space
            const end = start + match[0].trim().length;

            if (offset >= start && offset <= end) {
                const attrName = match[1];
                return {
                    contents: {
                        kind: 'markdown',
                        value: attrName === 'if' ? ifDocs : elsifDocs,
                    },
                };
            }
        }

        return null;
    };
}

export { ifDocs, elsifDocs, hoverIfSyntax };
