import { parseDiff } from "./diffParser";
import { OllamaAgent } from "../ai/ollamaAgent";

export class Reviewer {
  private ai: OllamaAgent;
  constructor(ai: OllamaAgent) {
    this.ai = ai;
  }

  async review(pr: {
    diff: string;
    author: string;
    commitMsg: string;
    docChanges?: string;
  }) {
    const files = parseDiff(pr.diff);
    // (optionnel) extraire docChanges si README modifié
    const feedback = await this.ai.reviewDiff(pr.diff, {
      author: pr.author,
      commitMsg: pr.commitMsg,
      docChanges: pr.docChanges,
    });
    return feedback;
  }
}
