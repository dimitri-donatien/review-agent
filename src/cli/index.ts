#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { GitHubAPI } from "../api/github";
import { GitLabAPI } from "../api/gitlab";
import { OllamaAgent } from "../ai/ollamaAgent";
import { Reviewer } from "../review/reviewer";
import { logger } from "../utils/logger";

interface CliArgs {
  "github-owner"?: string;
  "github-repo"?: string;
  "gitlab-project"?: string;
  "dry-run"?: boolean;
}

async function runGitHubReview(
  owner: string,
  repo: string,
  reviewer: Reviewer,
  dryRun: boolean
) {
  const gh = new GitHubAPI(process.env.GH_TOKEN!);
  const prs = await gh.listOpenPRs(owner, repo);
  for (const pr of prs) {
    if (!pr.user) continue;
    logger.info(`Processing GitHub PR #${pr.number} by ${pr.user.login}`);
    const diff = await gh.getPRDiff(owner, repo, pr.number);
    const feedback = await reviewer.review({
      diff,
      author: pr.user.login,
      commitMsg: pr.title,
    });
    console.log(`\nSuggestions for PR #${pr.number}:\n${feedback}`);
    if (!dryRun) {
      await gh.postReviewComment(owner, repo, pr.number, feedback);
      logger.info(`Comment posted on PR #${pr.number}`);
    } else {
      logger.info(`Dry run: no comment posted for PR #${pr.number}`);
    }
  }
}

async function runGitLabReview(
  projectId: string,
  reviewer: Reviewer,
  dryRun: boolean
) {
  const gl = new GitLabAPI(process.env.GL_TOKEN!);
  const mrs = await gl.listOpenMRs(projectId);
  for (const mr of mrs) {
    if (!mr.author) continue;
    logger.info(`Processing GitLab MR !${mr.iid} by ${mr.author.username}`);
    const diff = await gl.getMRDiff(projectId, mr.iid);
    const feedback = await reviewer.review({
      diff,
      author: mr.author.username,
      commitMsg: mr.title,
    });
    console.log(`\nSuggestions for MR !${mr.iid}:\n${feedback}`);
    if (!dryRun) {
      await gl.postComment(projectId, mr.iid, feedback);
      logger.info(`Comment posted on MR !${mr.iid}`);
    } else {
      logger.info(`Dry run: no comment posted for MR !${mr.iid}`);
    }
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("github-owner", { type: "string", description: "GitHub owner/org" })
    .option("github-repo", {
      type: "string",
      description: "GitHub repository name",
    })
    .option("gitlab-project", {
      type: "string",
      description: "GitLab project ID or path",
    })
    .option("dry-run", {
      type: "boolean",
      default: false,
      description: "Do not post comments",
    })
    .demandOption(
      [],
      "Specify at least one of --github-owner/--github-repo or --gitlab-project"
    )
    .parseSync() as CliArgs;

  const ai = new OllamaAgent(process.env.OLLAMA_MODEL);
  const reviewer = new Reviewer(ai);

  if (argv["github-owner"] && argv["github-repo"]) {
    await runGitHubReview(
      argv["github-owner"],
      argv["github-repo"],
      reviewer,
      argv["dry-run"]!
    );
  }

  if (argv["gitlab-project"]) {
    await runGitLabReview(argv["gitlab-project"], reviewer, argv["dry-run"]!);
  }
}

main().catch((err) => {
  logger.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
