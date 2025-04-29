# Code Review Agent

L’AI Code Review Agent est un outil CLI TypeScript qui automatise la revue de code sur GitHub et GitLab grâce à un modèle LLM local (Ollama). Il analyse les diffs, la documentation et les messages de commit pour proposer des suggestions : style, performance, sécurité, documentation et architecture. Ce README agit comme une vitrine complète du projet, facilitant la première prise en main pour tout contributeur ou utilisateur.

## Fonctionnalités

- Connexion multi‐SCM : GitHub (via Octokit) et GitLab (API REST).
- Analyse IA contextuelle : prompts structurés, few‐shot examples, sortie JSON pour intégration continue.
- Commentaires interactifs : sélection des suggestions en CLI avant publication.
- Sandbox Docker : exécution isolée du LLM pour limiter les risques de sécurité.
- Extensible & configurable : critères de revue activables/désactivables via JSON.
- Support multi‐langage : TypeScript, Python, Java, etc.

## Architecture du projet

```bash
/docker
  ├─ Dockerfile
  └─ entrypoint.sh
/src
  /api
    ├─ github.ts
    └─ gitlab.ts
  /ai
    ├─ ollamaAgent.ts
    └─ prompts.ts
  /review
    ├─ diffParser.ts
    └─ reviewer.ts
  /cli
    └─ index.ts
  /config
    ├─ default.json
    └─ schema.json
  /utils
    ├─ logger.ts
    └─ sandbox.ts
/tests
  ├─ api.github.test.ts
  ├─ api.gitlab.test.ts
  ├─ ai.ollamaAgent.test.ts
  ├─ review.reviewer.test.ts
  └─ cli.integration.test.ts
package.json  
tsconfig.json  
README.md
```

## Installation

1. Cloner le dépôt et installer les dépendances.

```bash
git clone https://github.com/dimitri-donatien/cli-etl.git
cd cli-etl
```

2. Installer les dépendances

```bash
pnpm install
```

3. Compiler le TypeScript

```bash
pnpm build
```

## Configuration

1. Copier et adapter /config/default.json

2. Vérifier la conformité via le schéma /config/schema.json

3. Définir les variables d’environnement :

```bash
export GH_TOKEN="votre_pat_github"
export GL_TOKEN="votre_pat_gitlab"
export OLLAMA_MODEL="gpt-code-review"
export LOG_LEVEL="info"
```

## Utilisation

Commande principale

```bash
node dist/cli/index.js --github-owner <owner> --github-repo <repo> [--gitlab-project <project>] [--dry-run]
```

- --github-owner / --github-repo : cible GitHub

- --gitlab-project : cible GitLab

- --dry-run : affiche sans poster les commentaires

## Exemple d’utilisation

```bash
node dist/cli/index.js \
  --github-owner dimitri-donatien \
  --github-repo cli-etl \
  --gitlab-project dimitri-donatien/cli-etl \
  --dry-run
```

## Contribuer

Les contributions sont les bienvenues !

1. Forkez le projet

2. Créez une branche feature/ma-feature

3. Soumettez un PR détaillé et passez les tests

Pour finir, merge après revue.

## Support

Pour signaler un bug ou proposer une amélioration, ouvrez une issue sur GitHub. Pour toute question, contactez [donatien.dim@gmail.com].

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
