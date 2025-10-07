import { HoverParams, Hover, type TextDocuments } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';

const elseDocs = `
## Else Attribute

The \`else\` attribute controls conditional rendering in templates after \`if\` and \`elsif\`.

**Basic Syntax:**
- \`else\` – render the element if the previous conditional is falsy.

### Examples:

**Simple else:**
\`\`\`html
<div if="user.isAdmin">
  Admin content
</div>
<div else>
  Generic content
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
 * Creates a hover provider for `else` attributes.
 *
 * Returns Markdown documentation (`elseDocs`) when hovering over an `else` attribute.
 *
 * @param documents - The collection of text documents to provide hover info for.
 * @returns A function that handles hover requests and returns a `Hover` or `null`.
 */
function hoverElseSyntax(documents: TextDocuments<TextDocument>) {
    return (params: HoverParams): Hover | null => {
        const doc = documents.get(params.textDocument.uri);
        if (!doc) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const text = doc.getText();

        // Regex to match only `else` attributes
        const elseRegex = /\selse(?=\s|>)/g;
        let match: RegExpExecArray | null;

        while ((match = elseRegex.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;

            if (offset >= start && offset <= end) {
                return {
                    contents: {
                        kind: 'markdown',
                        value: elseDocs,
                    },
                };
            }
        }

        return null;
    };
}

export { elseDocs, hoverElseSyntax };
