export const elsifDocs = `
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
