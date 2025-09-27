import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function createFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex").substring(0, 8);
}

export function findFilesByExtension(dirPath, extensions, ignoredFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = [];
  const extensionPattern = extensions.map(ext => ext.replace('.', '\\.')).join('|');
  const hashPattern = `\\.([a-f0-9]{8})\\.(${extensionPattern})$`;

  function searchRecursively(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchRecursively(fullPath);
      } else if (stat.isFile()) {
        const hasValidExtension = extensions.some(ext => item.endsWith(ext));
        const hasNoHash = !new RegExp(hashPattern).test(item);
        
        if (hasValidExtension && hasNoHash) {
          const relativePath = path.relative(dirPath, fullPath);
          const isIgnored = ignoredFiles.some(ignoredFile => 
            relativePath === ignoredFile || relativePath.endsWith(ignoredFile)
          );
          
          if (!isIgnored) {
            files.push(relativePath);
          }
        }
      }
    }
  }

  searchRecursively(dirPath);
  return files;
}
