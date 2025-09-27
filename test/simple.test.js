import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { hashAssets, updateHashedLinks } from '../src/index.js';

describe('build-hasher integration tests', () => {
  const testDir = './test-temp';

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should hash files and update references', () => {
    fs.writeFileSync(path.join(testDir, 'app.js'), 'console.log("app");');
    fs.writeFileSync(path.join(testDir, 'style.css'), 'body { color: red; }');
    fs.writeFileSync(path.join(testDir, 'index.html'), `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <script src="app.js"></script>
</body>
</html>`);

    const manifest = hashAssets({
      outputDir: testDir,
      extensions: ['.js', '.css']
    });

    expect(manifest).toBeDefined();
    expect(manifest['app.js']).toBeDefined();
    expect(manifest['style.css']).toBeDefined();
    expect(manifest['app.js']).toMatch(/app\.[a-f0-9]{8}\.js/);
    expect(manifest['style.css']).toMatch(/style\.[a-f0-9]{8}\.css/);

    expect(fs.existsSync(path.join(testDir, 'app.js'))).toBe(false);
    expect(fs.existsSync(path.join(testDir, 'style.css'))).toBe(false);

    expect(fs.existsSync(path.join(testDir, manifest['app.js']))).toBe(true);
    expect(fs.existsSync(path.join(testDir, manifest['style.css']))).toBe(true);

    updateHashedLinks({
      hashManifest: manifest,
      outputDir: testDir,
      extensions: ['.html']
    });

    const htmlContent = fs.readFileSync(path.join(testDir, 'index.html'), 'utf8');
    expect(htmlContent).toContain(manifest['app.js']);
    expect(htmlContent).toContain(manifest['style.css']);
    expect(htmlContent).not.toContain('app.js');
    expect(htmlContent).not.toContain('style.css');
  });

  it('should handle empty manifest', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    updateHashedLinks({
      hashManifest: {},
      outputDir: testDir,
      extensions: ['.html']
    });

    expect(consoleSpy).toHaveBeenCalledWith('No files to update (empty manifest)');
    consoleSpy.mockRestore();
  });

  it('should throw error for missing outputDir', () => {
    expect(() => {
      hashAssets({
        extensions: ['.js']
      });
    }).toThrow('outputDir parameter is required for hashAssets');

    expect(() => {
      updateHashedLinks({
        hashManifest: { 'test.js': 'test.hashed.js' }
      });
    }).toThrow('outputDir parameter is required for updateHashedLinks');
  });
});
