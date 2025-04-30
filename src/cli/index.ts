#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { GitHubAPI } from "../api/github";
import { GitLabAPI } from "../api/gitlab";
import { OllamaAgent } from "../ai/ollamaAgent";
import { Reviewer } from "../review/reviewer";
import { logger } from "../utils/logger";
import {
  reviewsCounter,
  reviewDuration,
  startMetricsServer,
} from "../utils/metrics";
import ora from "ora";
import { SingleBar, Presets } from "cli-progress";
import chalk from "chalk";

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
  const bar = new SingleBar({
    ...Presets.shades_classic,
    format:
      "GitHub PRs |" +
      chalk.cyan("{bar}") +
      "| {percentage}% || {value}/{total} PRs",
  });
  bar.start(prs.length, 0);

  for (const pr of prs) {
    bar.increment();
    if (!pr.user) continue;
    const spinner = ora(
      `Processing GH PR #${pr.number} by ${pr.user.login}`
    ).start();

    const endTimer = reviewDuration.startTimer();
    try {
      const diff = await gh.getPRDiff(owner, repo, pr.number);
      const feedback = await reviewer.review({
        diff,
        author: pr.user.login,
        commitMsg: pr.title,
      });

      spinner.succeed(`Completed PR #${pr.number}`);
      console.log(
        chalk.yellow(`\nSuggestions for PR #${pr.number}:\n`) + feedback
      );

      if (!dryRun) {
        await gh.postReviewComment(owner, repo, pr.number, feedback);
        logger.info({ pr: pr.number }, "Comment posted");
      } else {
        logger.info({ pr: pr.number }, "Dry run – no comment posted");
      }

      reviewsCounter.inc();
    } catch (err: any) {
      spinner.fail(`Error on PR #${pr.number}: ${err.message}`);
      logger.error({ pr: pr.number, err: err.message }, "Review failed");
    } finally {
      endTimer();
    }
  }

  bar.stop();
}

async function runGitLabReview(
  projectId: string,
  reviewer: Reviewer,
  dryRun: boolean
) {
  const gl = new GitLabAPI(process.env.GL_TOKEN!);
  const mrs = await gl.listOpenMRs(projectId);
  const bar = new SingleBar({
    ...Presets.shades_classic,
    format:
      "GitLab MRs|" +
      chalk.magenta("{bar}") +
      "| {percentage}% || {value}/{total} MRs",
  });
  bar.start(mrs.length, 0);

  for (const mr of mrs) {
    bar.increment();
    if (!mr.author) continue;
    const spinner = ora(
      `Processing GL MR !${mr.iid} by ${mr.author.username}`
    ).start();

    const endTimer = reviewDuration.startTimer();
    try {
      const diff = await gl.getMRDiff(projectId, mr.iid);
      const feedback = await reviewer.review({
        diff,
        author: mr.author.username,
        commitMsg: mr.title,
      });

      spinner.succeed(`Completed MR !${mr.iid}`);
      console.log(
        chalk.yellow(`\nSuggestions for MR !${mr.iid}:\n`) + feedback
      );

      if (!dryRun) {
        await gl.postComment(projectId, mr.iid, feedback);
        logger.info({ mr: mr.iid }, "Comment posted");
      } else {
        logger.info({ mr: mr.iid }, "Dry run – no comment posted");
      }

      reviewsCounter.inc();
    } catch (err: any) {
      spinner.fail(`Error on MR !${mr.iid}: ${err.message}`);
      logger.error({ mr: mr.iid, err: err.message }, "Review failed");
    } finally {
      endTimer();
    }
  }

  bar.stop();
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
    .help()
    .parseSync() as CliArgs;

  // Démarrer le serveur de métriques en parallèle
  startMetricsServer();

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
  logger.fatal({ err: err.message }, "Fatal error");
  process.exit(1);
});
