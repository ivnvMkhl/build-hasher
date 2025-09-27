import fs from "node:fs";
import path from "node:path";
import { createFileHash, findFilesByExtension } from "./common.js";

function hashFiles(outputDir, files, extensions) {
  return files.reduce((fileMappings, file) => {
    const originalPath = path.join(outputDir, file);
    const hash = createFileHash(originalPath);
    
    const extension = extensions.find(ext => file.endsWith(ext));
    const newFileName = file.replace(extension, `.${hash}${extension}`);
    const newPath = path.join(outputDir, newFileName);

    fs.renameSync(originalPath, newPath);

    return {
      ...fileMappings,
      [file]: newFileName
    };
  }, {});
}

export function hashAssets({ outputDir, extensions, ignoredFiles = [] }) {
  if (!outputDir) {
    throw new Error('outputDir parameter is required for hashAssets');
  }
  
  if (!extensions || !Array.isArray(extensions) || extensions.length === 0) {
    return {};
  }

  const files = findFilesByExtension(outputDir, extensions, ignoredFiles);
  const hashManifest = hashFiles(outputDir, files, extensions);
  const totalFiles = Object.keys(hashManifest).length;
  console.log(`Found ${totalFiles} files for hashing:`);
  
  Object.entries(hashManifest).forEach(([original, hashed]) => {
    console.log(`  ${original} -> ${hashed} (original removed)`);
  });

  return hashManifest;
}
