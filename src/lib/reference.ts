import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/content/reference/manifest.json";
import chrome from "@/content/reference/chrome.json";

export const referencePages: Record<string, { file: string; title: string; heading: string; description: string; searchText: string; theme: string; source: string }> = manifest;
export const referenceChrome = chrome;

export async function readReferencePage(file: string) {
  // File names come exclusively from the checked-in manifest, never user input.
  return readFile(path.join(process.cwd(), "src/content/reference", `${file}.html`), "utf8");
}
