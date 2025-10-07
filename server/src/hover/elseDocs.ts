export const elseDocs = `
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
