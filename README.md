# Code Review Agent

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.12.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/SCM-GitHub-181717?logo=github)](https://github.com/dimitri-donatien/review-agent)
[![GitLab](https://img.shields.io/badge/SCM-GitLab-FC6D26?logo=gitlab&logoColor=white)](#)
[![Ollama](https://img.shields.io/badge/LLM-Ollama-000000?logo=ollama&logoColor=white)](https://ollama.com/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![ESLint](https://img.shields.io/badge/Linter-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

AI Code Review Agent is a TypeScript CLI tool that automates code review on GitHub and GitLab using a local LLM (Ollama). It analyzes diffs, documentation, and commit messages to provide suggestions on style, performance, security, documentation, and architecture.

## Features

- **Multi-SCM support**: GitHub (via Octokit) and GitLab (REST API).
- **Contextual AI analysis**: structured prompts with few-shot examples and JSON output for CI integration.
- **Interactive comments**: select which suggestions to publish via CLI before posting.
- **Multi-language support**: TypeScript, Python, Java, and more.
- **Extensible & configurable**: review criteria can be toggled via configuration.

## Project Structure

```md
src/
  ai/
    ollamaAgent.ts    # Ollama LLM wrapper - sends diffs for AI review
    prompts.ts        # Builds structured review prompts (JSON output)
  api/
    github.ts         # GitHub API client (list PRs, get diffs, post comments)
    gitlab.ts         # GitLab API client (list MRs, get diffs, post comments)
  cli/
    index.ts          # Main CLI entry point (yargs)
  review/
    diffParser.ts     # Unified diff parser (parse-diff wrapper)
    reviewer.ts       # Orchestrator: diff -> AI analysis -> formatted feedback
  utils/
    logger.ts         # Winston-based logging (LOG_LEVEL configurable)
eslint.config.mjs
package.json
tsconfig.json
README.md
```

## Requirements

- **Node.js** >= 18.12.0
- **pnpm** (package manager)
- **Ollama** installed and running locally

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dimitri-donatien/review-agent.git
cd review-agent
```

1. Install dependencies:

```bash
pnpm install
```

1. Compile TypeScript:

```bash
pnpm build
```

## Configuration

Set the following environment variables:

```bash
export GH_TOKEN="your_github_pat"
export GL_TOKEN="your_gitlab_pat"
export OLLAMA_MODEL="deepseek-r1"
export LOG_LEVEL="info"
```

| Variable | Description | Default |
|---|---|---|
| `GH_TOKEN` | GitHub personal access token | - |
| `GL_TOKEN` | GitLab personal access token | - |
| `OLLAMA_MODEL` | Ollama model to use for review | `deepseek-r1` |
| `LOG_LEVEL` | Logging level (`debug`, `info`, `warn`, `error`) | `info` |

## Usage

```bash
node dist/cli/index.js --github-owner <owner> --github-repo <repo> [--gitlab-project <project>] [--dry-run]
```

| Option | Description |
|---|---|
| `--github-owner` | GitHub repository owner |
| `--github-repo` | GitHub repository name |
| `--gitlab-project` | GitLab project path (e.g. `owner/repo`) |
| `--dry-run` | Preview review comments without posting them |

You can also run directly without compiling:

```bash
pnpm dev -- --github-owner <owner> --github-repo <repo>
```

### Example

```bash
node dist/cli/index.js \
  --github-owner dimitri-donatien \
  --github-repo review-agent \
  --gitlab-project dimitri-donatien/review-agent \
  --dry-run
```

## Contributing

Contributions are welcome!

1. Fork the project
2. Create a feature branch (`feature/my-feature`)
3. Submit a detailed PR and make sure all checks pass
4. Merge after review

## Support

To report a bug or suggest an improvement, open an issue on GitHub. For questions, reach out at [donatien.dim@gmail.com].

## License

This project is licensed under the MIT License.
