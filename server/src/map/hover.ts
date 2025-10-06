import { HoverParams, Hover, type TextDocuments } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';

const mapDocs = `
## Map Attribute

The \`map\` attribute is used to iterate over arrays in templates.

**Basic Syntax:**
- \`map="item of items"\` – loops through each item.
- \`map="item, i of items"\` – also exposes the index.

### Examples:

**Simple loop:**
\`\`\`html
<ul>
  <li map="item of items">{{item.name}}</li>
</ul>
\`\`\`

**With index:**
\`\`\`html
<ul>
  <li map="item, i of items">{{i}}: {{item.name}}</li>
</ul>
\`\`\`

**With condition:**
\`\`\`html
<ul>
  <li map="p of projects" if="p.title.length > 0">{{p.title}}</li>
</ul>
\`\`\`

**Nested loops:**
\`\`\`html
<div map="group of groups">
  <h2>{{group.name}}</h2>
  <ul>
	<li map="item of group.items">{{item}}</li>
  </ul>
</div>
\`\`\`
`;

/**
 * Creates a hover provider for `map` attributes in documents.
 *
 * Returns Markdown documentation (`mapDocs`) when hovering over a `map` attribute.
 *
 * @param documents - The collection of text documents to provide hover info for.
 * @returns A function that handles hover requests and returns a `Hover` or `null`.
 */
function hoverMapSyntax(documents: TextDocuments<TextDocument>) {
    return (params: HoverParams): Hover | null => {
        const doc = documents.get(params.textDocument.uri);
        if (!doc) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const text = doc.getText();

        // Check if hover is over a map attribute
        const mapRegex = /map="([^"]*)"/g;
        let match: RegExpExecArray | null;
        while ((match = mapRegex.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;
            if (offset >= start && offset <= end) {
                return {
                    contents: {
                        kind: 'markdown',
                        value: mapDocs,
                    },
                };
            }
        }

        return null;
    };
}

export { mapDocs, hoverMapSyntax };
