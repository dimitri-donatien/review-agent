import unifiedDiffParser from "parse-diff";

export function parseDiff(raw: string) {
  return unifiedDiffParser(raw); // returns file-by-file hunks
}
