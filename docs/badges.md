# GitHub Actions Status Badges

Add these badges to your main README.md file to show the status of your CI/CD pipelines:

## Badge Templates

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual GitHub username and repository name.

### Lint and Format Status

```markdown
[![Lint and Format](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/lint-and-format.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/lint-and-format.yml)
```

### Test Status

```markdown
[![Tests](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/tests.yml)
```

### Docker Build Status

```markdown
[![Docker Build](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/docker-build-and-push.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/docker-build-and-push.yml)
```

### Codecov Coverage

```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPOSITORY/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPOSITORY)
```

## Complete Example

```markdown
# Acquisitions API

[![Lint and Format](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/lint-and-format.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/lint-and-format.yml)
[![Tests](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/tests.yml)
[![Docker Build](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/docker-build-and-push.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/docker-build-and-push.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPOSITORY/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPOSITORY)

A modern Node.js API for acquisitions management.

## Features

- ✅ Automated CI/CD with GitHub Actions
- ✅ Comprehensive test coverage
- ✅ Docker multi-platform builds
- ✅ Security scanning
- ✅ Code quality checks

[Rest of your README content...]
```
