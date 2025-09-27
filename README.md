# build-hasher

Node.js library for hashing static assets and updating file references.

[![npm version](https://img.shields.io/npm/v/build-hasher.svg)](https://www.npmjs.com/package/build-hasher)
[![Node.js version](https://img.shields.io/node/v/build-hasher.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ES Modules & CommonJS support
- TypeScript definitions included
- Build tool integration
- Flexible configuration

## Installation

```bash
npm install -D build-hasher
```

> **Note:** This package is designed for build tools and should be installed as a dev dependency since it's used during the build process, not at runtime.

## Usage

```javascript
import { hashAssets, updateHashedLinks } from 'build-hasher';

// Hash assets
const manifest = hashAssets({
  outputDir: './dist',
  extensions: ['.js', '.css', '.png'],
  ignoredFiles: ['vendor.js']
});

// Update file references
updateHashedLinks({
  hashManifest: manifest,
  outputDir: './dist',
  extensions: ['.html']
});
```

## API Reference

### `hashAssets(options)`

Hashes files and returns a manifest of mappings.

**Parameters:**
- `outputDir` (string) - Directory to search for files
- `extensions` (string[]) - File extensions to hash
- `ignoredFiles` (string[], optional) - Files to ignore

**Returns:** `Record<string, string>` - Original to hashed filename mappings

#### Example

```javascript
const manifest = hashAssets({
  outputDir: './dist',
  extensions: ['.js', '.css', '.png', '.jpg'],
  ignoredFiles: ['vendor.js', 'legacy.css']
});

console.log(manifest);
// Output:
// {
//   'app.js': 'app.a1b2c3d4.js',
//   'styles.css': 'styles.e5f6g7h8.css',
//   'logo.png': 'logo.i9j0k1l2.png'
// }
```

### `updateHashedLinks(options)`

Updates file references to use hashed filenames.

**Parameters:**
- `hashManifest` (Record<string, string>) - Manifest from `hashAssets()`
- `outputDir` (string) - Directory containing files to update
- `extensions` (string[], optional) - File extensions to search (default: `['.html']`)
- `files` (string[], optional) - Additional files to update
- `replaceRule` (Record<string, [string, string]>, optional) - Custom replace rules

#### Example

```javascript
updateHashedLinks({
  hashManifest: manifest,
  outputDir: './dist',
  extensions: ['.html', '.php'],
  files: ['custom-template.tpl'],
  replaceRule: {
    '.html': ['src="', 'src="'],
    '.php': ['<?php echo "', '<?php echo "']
  }
});
```

## Examples

### Basic Usage

```javascript
import { hashAssets, updateHashedLinks } from 'build-hasher';

const manifest = hashAssets({
  outputDir: './dist',
  extensions: ['.js', '.css', '.png'],
  ignoredFiles: ['vendor.js']
});

updateHashedLinks({
  hashManifest: manifest,
  outputDir: './dist',
  extensions: ['.html']
});
```

### Custom Configuration

```javascript
const manifest = hashAssets({
  outputDir: './build',
  extensions: ['.js', '.css', '.woff2'],
  ignoredFiles: ['vendor/jquery.js', 'test-*.js']
});

updateHashedLinks({
  hashManifest: manifest,
  outputDir: './build',
  extensions: ['.html', '.php'],
  replaceRule: {
    '.html': ['src="', 'src="'],
    '.php': ['<?php echo "', '<?php echo "']
  }
});
```

### Build Tool Integration

```javascript
// webpack.config.js
import { hashAssets, updateHashedLinks } from 'build-hasher';

class AssetHasherPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('AssetHasherPlugin', (compilation) => {
      const manifest = hashAssets({
        outputDir: compilation.options.output.path,
        extensions: ['.js', '.css']
      });

      updateHashedLinks({
        hashManifest: manifest,
        outputDir: compilation.options.output.path,
        extensions: ['.html']
      });
    });
  }
}
```

### Build Scripts

```json
{
  "scripts": {
    "build": "webpack && node scripts/hash-assets.js",
    "hash-assets": "node scripts/hash-assets.js"
  }
}
```

```javascript
// scripts/hash-assets.js
import { hashAssets, updateHashedLinks } from 'build-hasher';

const manifest = hashAssets({
  outputDir: './dist',
  extensions: ['.js', '.css', '.png']
});

updateHashedLinks({
  hashManifest: manifest,
  outputDir: './dist',
  extensions: ['.html']
});
```

### TypeScript

```typescript
import { hashAssets, updateHashedLinks, type HashAssetsOptions } from 'build-hasher';

const options: HashAssetsOptions = {
  outputDir: './dist',
  extensions: ['.js', '.css'],
  ignoredFiles: ['vendor.js']
};

const manifest = hashAssets(options);
updateHashedLinks({ hashManifest: manifest, outputDir: './dist' });
```

### CommonJS

```javascript
const { hashAssets, updateHashedLinks } = require('build-hasher');

const manifest = hashAssets({
  outputDir: './dist',
  extensions: ['.js', '.css']
});

updateHashedLinks({
  hashManifest: manifest,
  outputDir: './dist'
});
```

## Requirements

Node.js >= 18.0.0

## License

MIT © [ivnvMkhl](https://github.com/ivnvMkhl)
