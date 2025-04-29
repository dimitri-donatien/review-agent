import { spawn } from "child_process";
import { buildPrompt } from "./prompts";

export class OllamaAgent {
  private model: string;

  /**
   * Initialise l'agent avec le nom du modèle Ollama à utiliser.
   * @param model Nom du modèle configuré dans Ollama (ex. "gpt-code-review")
   */
  constructor(model = process.env.OLLAMA_MODEL || "deepseek-r1") {
    this.model = model;
  }

  /**
   * Lance une revue de diff en soumettant un prompt à Ollama et renvoie la réponse texte.
   * @param diff Le texte du diff unified à analyser.
   * @param metadata Métadonnées pour enrichir le prompt (auteur, message de commit, docChanges).
   */
  async reviewDiff(
    diff: string,
    metadata: { author: string; commitMsg: string; docChanges?: string }
  ): Promise<string> {
    const prompt = buildPrompt(diff, metadata);

    return new Promise<string>((resolve, reject) => {
      // Appel CLI : ollama run <model> "<prompt>"
      const proc = spawn("ollama", ["run", this.model, prompt], {
        stdio: ["ignore", "pipe", "pipe"],
      });

      let output = "";
      let errorOutput = "";

      proc.stdout.on("data", (data) => {
        output += data.toString();
      });

      proc.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(
            new Error(
              `Ollama exited with code ${code}${
                errorOutput ? `: ${errorOutput}` : ""
              }`
            )
          );
        }
      });
    });
  }
}
