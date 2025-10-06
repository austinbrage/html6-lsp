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

/**
 * Creates a hover provider for `if` attributes.
 *
 * Returns Markdown documentation (`ifDocs`) when hovering over an `if` attribute.
 *
 * @param documents - The collection of text documents to provide hover info for.
 * @returns A function that handles hover requests and returns a `Hover` or `null`.
 */
function hoverIfSyntax(documents: TextDocuments<TextDocument>) {
    return (params: HoverParams): Hover | null => {
        const doc = documents.get(params.textDocument.uri);
        if (!doc) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const text = doc.getText();

        // Regex to match only `if="..."` attributes
        const ifRegex = /if="[^"]*"/g;
        let match: RegExpExecArray | null;

        while ((match = ifRegex.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;

            if (offset >= start && offset <= end) {
                return {
                    contents: {
                        kind: 'markdown',
                        value: ifDocs,
                    },
                };
            }
        }

        return null;
    };
}

export { ifDocs, hoverIfSyntax };
