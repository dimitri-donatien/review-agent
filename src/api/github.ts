import { Octokit } from "@octokit/rest";
import "dotenv/config";

export class GitHubAPI {
  private octokit: Octokit;

  constructor(token: string) {
    token = token || process.env.GH_TOKEN!;
    this.octokit = new Octokit({
      auth: token,
      userAgent: process.env.OLLAMA_MODEL || "deepseek-r1",
      previews: ["diffviewer"], // si besoin de previews GitHub
    });
  }

  /**
   * Liste les PR ouvertes d'un repo.
   */
  async listOpenPRs(owner: string, repo: string) {
    const response = await this.octokit.paginate(this.octokit.pulls.list, {
      owner,
      repo,
      state: "open",
      per_page: 100, // nombre de PR par page
    });
    return response; // tableau d’objets PR
  }

  /**
   * Récupère le diff d'une PR (unified diff).
   */
  async getPRDiff(owner: string, repo: string, prNumber: number) {
    const { data } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: "diff",
      },
    });
    return data as unknown as string; // TypeScript typiquement renvoie un string
  }

  /**
   * Post un commentaire sur la PR.
   */
  async postReviewComment(
    owner: string,
    repo: string,
    prNumber: number,
    body: string
  ) {
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
    });
  }
}
