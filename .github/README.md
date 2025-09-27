# GitHub Actions

This repository uses GitHub Actions for automated testing and publishing.

## Workflows

### Test Workflow (`.github/workflows/test.yml`)
- **Triggers:** Push to `main` branch, Pull requests to `main`
- **Node.js versions:** 18, 20, 21
- **Actions:**
  - Install dependencies
  - Run tests
  - Generate coverage report (Node.js 18 only)

### Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers:** Push of new tag (e.g., `v1.0.0`)
- **Actions:**
  - Install dependencies
  - Run tests
  - Publish to npm
  - Create GitHub release

## Setup

### For Publishing
1. Create NPM token at https://www.npmjs.com/settings/tokens
2. Add `NPM_TOKEN` secret to repository settings
3. Create and push a tag: `git tag v1.0.0 && git push origin v1.0.0`

### For Testing
- Tests run automatically on every push to `main`
- No additional setup required
