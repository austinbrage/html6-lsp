export const ifDocs = `
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
