#!/usr/bin/env sh
# Démarre Ollama sandbox (exemple)
ollama serve --model $OLLAMA_MODEL &
# Lance l’agent
node ./dist/cli/index.js
