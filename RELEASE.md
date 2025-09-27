# Release Process

This document describes how to create a new release of build-hasher.

## Prerequisites

1. **NPM Token**: Create a token at https://www.npmjs.com/settings/tokens
2. **GitHub Secret**: Add `NPM_TOKEN` to repository secrets
3. **Git Access**: Ensure you have push access to the repository

## Release Steps

### 1. Update Version
```bash
# Update version in package.json
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes
```

### 2. Push Tag
```bash
# Push the new tag to trigger release
git push origin --tags
```

### 3. Automated Process
The GitHub Action will automatically:
- ✅ Run tests on multiple Node.js versions
- ✅ Publish to npm
- ✅ Create GitHub release
- ✅ Generate release notes

## Version Guidelines

- **Patch (0.0.X)**: Bug fixes, documentation updates
- **Minor (0.X.0)**: New features, backward compatible
- **Major (X.0.0)**: Breaking changes

## Manual Release (if needed)

```bash
# Install dependencies
npm ci

# Run tests
npm run test:run

# Publish to npm
npm publish
```

## Rollback

If a release has issues:
1. Unpublish from npm: `npm unpublish build-hasher@version`
2. Delete the GitHub release
3. Delete the git tag: `git tag -d v1.0.0 && git push origin :refs/tags/v1.0.0`
