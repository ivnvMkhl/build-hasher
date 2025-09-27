import fs from "node:fs";
import path from "node:path";
import { findFilesByExtension } from "./common.js";

export function updateHashedLinks({ hashManifest, outputDir, extensions = ['.html'], files = [], replaceRule = {} }) {
  if (!outputDir) {
    throw new Error('outputDir parameter is required for updateHashedLinks');
  }

  if (!hashManifest || Object.keys(hashManifest).length === 0) {
    console.log('No files to update (empty manifest)');
    return;
  }

  const filesByExtensions = findFilesByExtension(outputDir, extensions);
  const allFiles = [...filesByExtensions, ...files];
  
  console.log(`Updating ${allFiles.length} files:`);

  allFiles.forEach((relativePath) => {
    const filePath = path.join(outputDir, relativePath);
    const content = fs.readFileSync(filePath, "utf8");
    
    const updatedContent = Object.entries(hashManifest).reduce(
      (acc, [original, hashed]) => {
        const fileExtension = path.extname(filePath);
        const rules = replaceRule[fileExtension];
        
        if (rules && Array.isArray(rules) && rules.length >= 2) {
          const [fromPrefix, toPrefix] = rules;
          const originalWithPrefix = original.replace(fromPrefix, toPrefix);
          const hashedWithPrefix = hashed.replace(fromPrefix, toPrefix);
          return acc.replaceAll(originalWithPrefix, hashedWithPrefix);
        }
        
        return acc.replaceAll(original, hashed);
      },
      content
    );

    fs.writeFileSync(filePath, updatedContent);
    console.log(`  Updated: ${relativePath}`);
  });
}
