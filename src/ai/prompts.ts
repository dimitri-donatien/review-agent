// export function buildPrompt(
//   diff: string,
//   {
//     author,
//     commitMsg,
//     docChanges,
//   }: { author: string; commitMsg: string; docChanges?: string }
// ): string {
//   return `
//   You are a senior developer full-stack. Review the following changes and provide:
//   1. Style suggestions (naming, formatting).
//   2. Performance tips.
//   3. Security anti-pattern warnings.
//   4. Documentation quality feedback.
//   5. Architectural/design pattern observations.

//   Author: ${author}
//   Commit: ${commitMsg}

//   Diff:
//   ${diff}

//   ${docChanges ? `Documentation changes:\n${docChanges}` : ""}

//   Generate a list of suggestions with explanations, and optionally a patch.
//   `;
// }

export function buildPrompt(
  diff: string,
  {
    author,
    commitMsg,
    docChanges,
  }: { author: string; commitMsg: string; docChanges?: string }
): string {
  return `
SYSTEM: You are a senior full-stack TypeScript engineer specialized in code reviews.
CONTEXT:
  • Author: ${author}
  • Commit message: ${commitMsg}
${docChanges ? `  • Documentation changes:\n${docChanges}` : ""}

INSTRUCTION:
  1. Analyze the diff below.
  2. Provide **five** sections of feedback:
     a. Style (naming, formatting)  
     b. Performance (algorithmic, I/O)  
     c. Security (vulnerabilities, anti-patterns)  
     d. Documentation (clarity, completeness)  
     e. Architecture & Design Patterns  
  3. For each item, include:
     - A **brief title**  
     - A **severity** tag (\`[low|medium|high]\`)  
     - A clear **explanation**  
     - (Optional) a **unified-diff patch** suggestion  
  4. Output your response as **valid JSON** with this schema:

\`\`\`json
[
  {
    "category": "Style",
    "severity": "medium",
    "title": "Use explicit types",
    "explanation": "...",
    "patch": "diff --git a/...\\n..."
  },
  …
]
\`\`\`

EXAMPLES:
\`\`\`diff
--- a/src/foo.ts
+++ b/src/foo.ts
@@ -10,7 +10,7 @@ function foo() {
-  const x = anyValue;
+  const x: number = anyValue;
}
\`\`\`
\`\`\`json
[
  {
    "category": "Style",
    "severity": "low",
    "title": "Add explicit type annotation",
    "explanation": "Using explicit types improves readability and prevents inadvertent any typing.",
    "patch": "diff --git a/src/foo.ts b/src/foo.ts\n@@ -10,7 +10,7 @@ function foo() {\n-  const x = anyValue;\n+  const x: number = anyValue;\n}"
  }
]
\`\`\`

DIFF_TO_REVIEW:
\`\`\`diff
${diff}
\`\`\`

END_OF_PROMPT
`.trim();
}
