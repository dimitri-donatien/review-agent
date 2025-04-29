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

// export function buildPrompt(
//   diff: string,
//   {
//     author,
//     commitMsg,
//     docChanges,
//   }: { author: string; commitMsg: string; docChanges?: string }
// ): string {
//   return `
// SYSTEM: You are a senior full-stack TypeScript engineer specialized in code reviews.
// CONTEXT:
//   • Author: ${author}
//   • Commit message: ${commitMsg}
// ${docChanges ? `  • Documentation changes:\n${docChanges}` : ""}

// INSTRUCTION:
//   1. Analyze the diff below.
//   2. Provide **five** sections of feedback:
//      a. Style (naming, formatting)
//      b. Performance (algorithmic, I/O)
//      c. Security (vulnerabilities, anti-patterns)
//      d. Documentation (clarity, completeness)
//      e. Architecture & Design Patterns
//   3. For each item, include:
//      - A **brief title**
//      - A **severity** tag (\`[low|medium|high]\`)
//      - A clear **explanation**
//      - (Optional) a **unified-diff patch** suggestion
//   4. Output your response as **valid JSON** with this schema:

// \`\`\`json
// [
//   {
//     "category": "Style",
//     "severity": "medium",
//     "title": "Use explicit types",
//     "explanation": "...",
//     "patch": "diff --git a/...\\n..."
//   },
//   …
// ]
// \`\`\`

// EXAMPLES:
// \`\`\`diff
// --- a/src/foo.ts
// +++ b/src/foo.ts
// @@ -10,7 +10,7 @@ function foo() {
// -  const x = anyValue;
// +  const x: number = anyValue;
// }
// \`\`\`
// \`\`\`json
// [
//   {
//     "category": "Style",
//     "severity": "low",
//     "title": "Add explicit type annotation",
//     "explanation": "Using explicit types improves readability and prevents inadvertent any typing.",
//     "patch": "diff --git a/src/foo.ts b/src/foo.ts\n@@ -10,7 +10,7 @@ function foo() {\n-  const x = anyValue;\n+  const x: number = anyValue;\n}"
//   }
// ]
// \`\`\`

// DIFF_TO_REVIEW:
// \`\`\`diff
// ${diff}
// \`\`\`

// END_OF_PROMPT
// `.trim();
// }

// export function buildPrompt(
//   diff: string,
//   {
//     author,
//     commitMsg,
//     docChanges,
//     repoName,
//     branch,
//     issueLink,
//   }: {
//     author: string;
//     commitMsg: string;
//     docChanges?: string;
//     repoName: string;
//     branch: string;
//     issueLink?: string;
//   }
// ): string {
//   return `
// SYSTEM:
// You are a highly experienced full-stack software engineer and architecture consultant. You perform code reviews against professional industry standards.

// CONTEXT:
// - Repository: ${repoName} on branch ${branch}
// - Commit author: ${author}
// - Commit message: "${commitMsg}"
// ${issueLink ? `- Related issue/ticket: ${issueLink}` : ""}
// ${docChanges ? `- Documentation updates:\n${docChanges}` : ""}

// TASK:
// Given the following unified diff, produce:

// 1. **Summary** (2-3 sentences): Contexte et portée des changements.
// 2. **Categorized Findings**: pour chaque catégorie indiquée ci-dessous, listez de 0 à N remarques sous forme d’objets JSON :
//    - **Style & Lisibilité** (naming, indentation, conventions TS/JS, clarté)
//    - **Performance & Scalabilité** (complexité algorithmique, appels I/O, lazy loading)
//    - **Sécurité** (injections, validation, gestion des permissions, dépendances vulnérables)
//    - **Robustesse & Fiabilité** (gestion d’erreurs, tests, coverage, cas limites)
//    - **Architecture & Design** (couplage, responsabilités, patterns, modularité)
//    - **Documentation & Commentaires** (qualité des docstrings, README, changelog)
//    - **Accessibilité & Internationalisation** (pour le front-end, si applicable)

// 3. **Suggestions d’améliorations** : pour chaque remarque, fournissez :
//    - **path** : fichier concerné
//    - **line** : numéro de ligne ou plage
//    - **titre** : courte description
//    - **explanation** : 1-2 phrases expliquant le problème
//    - **patch** : extrait de diff ou snippet de code proposé

// 4. **Priorisation** : classez chaque remarque par priorité (P0 = bloquant, P1 = important, P2 = suggestion).

// 5. **Conclusion** (optionnel) : remarques générales ou bonnes pratiques à garder à l’esprit.

// OUTPUT FORMAT (JSON):
// \`\`\`json
// {
//   "summary": "…",
//   "findings": {
//     "style": [ /* array d’objets */ ],
//     "performance": [ /* … */ ],
//     "security": [ /* … */ ],
//     "reliability": [ /* … */ ],
//     "architecture": [ /* … */ ],
//     "documentation": [ /* … */ ],
//     "accessibility": [ /* … */ ]
//   },
//   "conclusion": "…"
// }
// \`\`\`

// INPUT DIFF:
// \`\`\`diff
// ${diff}
// \`\`\`

// END_OF_PROMPT
//   `.trim();
// }

// export function buildPrompt(
//   diff: string,
//   {
//     author,
//     commitMsg,
//     docChanges,
//     repoName,
//     branch,
//     issueLink,
//   }: {
//     author: string;
//     commitMsg: string;
//     docChanges?: string;
//     repoName: string;
//     branch: string;
//     issueLink?: string;
//   }
// ): string {
//   return `
// SYSTEM:
// You are a senior full-stack software engineer. You are performing a professional code review.

// CONTEXT:
// - Repository: ${repoName}
// - Branch: ${branch}
// - Commit author: ${author}
// - Commit message: "${commitMsg}"
// ${issueLink ? `- Related issue/ticket: ${issueLink}` : ""}
// ${docChanges ? `- Documentation updates:\n${docChanges}` : ""}

// TASK:
// Analyze the code diff below and return a structured **Markdown** review report including the following:

// ---

// ### 📝 Summary

// Provide a 2–3 sentence summary of what this change does.

// ---

// ### ✅ Review

// Break down the findings into the following sections:

// #### 1. **Style & Readability**
// - Highlight issues with naming, formatting, or clarity.
// - Use bullet points and code blocks if needed.

// #### 2. **Performance**
// - Mention any inefficiencies or opportunities for optimization.

// #### 3. **Security**
// - Flag anything that could lead to vulnerabilities or poor validation.

// #### 4. **Robustness**
// - Comment on error handling, edge cases, and testing.

// #### 5. **Architecture & Design**
// - Identify violations of clean code principles or architecture smells.

// #### 6. **Documentation**
// - Point out missing or unclear documentation/comments.

// #### 7. **Other Observations**
// - Anything else that doesn't fit above.

// For each point, use this format:

// \`\`\`markdown
// - **[Category] [Priority: P0/P1/P2]** – Title of the issue
//   - Explanation of the problem
//   - (Optional) Suggested fix or improvement
// \`\`\`

// ---

// ### ✨ Suggested Improved Version

// Using your previous feedback, rewrite the updated file(s) or snippets, applying best practices. Use proper formatting and headers:

// \`\`\`ts
// // Example of improved code here
// \`\`\`

// ---

// INPUT DIFF:
// \`\`\`diff
// ${diff}
// \`\`\`

// END_OF_PROMPT
//   `.trim();
// }

export function buildPrompt(
  diff: string,
  {
    author,
    commitMsg,
    docChanges,
    repoName = "unknown-repo",
    branch = "main",
    issueLink,
  }: {
    author: string;
    commitMsg: string;
    docChanges?: string;
    repoName?: string;
    branch?: string;
    issueLink?: string;
  }
): string {
  return `
SYSTEM:
You are a senior full-stack software engineer. You perform professional code reviews and propose improved code samples.

CONTEXT:
- **Repo**: ${repoName}  
- **Branch**: ${branch}  
- **Auteur**: ${author}  
- **Commit**: "${commitMsg}"  
${issueLink ? `- **Issue/Ticket**: ${issueLink}` : ""}  
${docChanges ? `- **Docs**:\n${docChanges}` : ""}

TASK:
Analyse the following diff and produce a **Markdown** review report, followed by a **proposed improved code** snippet.  

---

## 📝 Summary  
2–3 sentences to explain what the change does.

---

## ✅ Review Findings

### 1. Style & Readability  
- **[P1]** – Issue title  
  - Explanation…  
  - _(optionally) suggested fix snippet_

### 2. Performance  
- **[P2]** – Issue title  
  - Explanation…

### 3. Security  
- **[P0]** – Issue title  
  - Explanation…

### 4. Robustness  
- **[P1]** – Issue title  
  - Explanation…

### 5. Architecture & Design  
- **[P2]** – Issue title  
  - Explanation…

### 6. Documentation  
- **[P2]** – Issue title  
  - Explanation…

### 7. Other Observations  
- Optional notes that don't fit above

---

## ✨ Proposal for an improved version

_Apply your recommendations below to provide a reworked code extract (file or complete snippet). Use for example for a JS project: TypeScript, JSDoc and clear logs (and this for any programming language):_

\`\`\`ts
// e.g. src/lib/adapters/…
<– your improved code here –>
\`\`\`

---

### DIFF TO BE REVIEWED

\`\`\`diff
${diff}
\`\`\`

END_OF_PROMPT
  `.trim();
}
