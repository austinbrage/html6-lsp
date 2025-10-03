export const mapDocs = `
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
