# CI/CD Pipeline Documentation

This project implements a comprehensive CI/CD pipeline using GitHub Actions with three main workflows:

## 🔄 Workflows Overview

### 1. **Lint and Format** (`lint-and-format.yml`)

- **Triggers:** Push/PR to `main` and `staging` branches
- **Purpose:** Code quality assurance through ESLint and Prettier
- **Features:**
  - Node.js 20.x with npm caching
  - ESLint with caching and JSON output
  - Prettier formatting checks
  - Automated PR comments with fix suggestions
  - Clear error annotations

### 2. **Tests** (`tests.yml`)

- **Triggers:** Push/PR to `main` and `staging` branches
- **Purpose:** Automated testing with coverage reporting
- **Features:**
  - PostgreSQL service container for database tests
  - Jest testing with ES modules support
  - Coverage reports with 30-day artifact retention
  - GitHub step summaries with coverage metrics
  - Codecov integration
  - Test failure annotations

### 3. **Docker Build and Push** (`docker-build-and-push.yml`)

- **Triggers:** Push to `main` branch, manual workflow dispatch
- **Purpose:** Multi-platform Docker image builds
- **Features:**
  - Multi-platform builds (linux/amd64, linux/arm64)
  - Docker Hub publishing with metadata
  - Build caching with GitHub Actions
  - Security scanning with Trivy and Docker Scout
  - SBOM and provenance attestations
  - Deployment status tracking

## 🔐 Required Secrets

Configure these secrets in your GitHub repository settings:

| Secret Name       | Description             | Example                     |
| ----------------- | ----------------------- | --------------------------- |
| `DOCKER_USERNAME` | Docker Hub username     | `your-dockerhub-username`   |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_1234567890abcdef` |

### Setting up Docker Hub Secrets:

1. Go to [Docker Hub Access Tokens](https://hub.docker.com/settings/security)
2. Create a new access token with read/write permissions
3. Add the secrets to your GitHub repository:
   - Go to Settings > Secrets and variables > Actions
   - Add `DOCKER_USERNAME` with your Docker Hub username
   - Add `DOCKER_PASSWORD` with the generated access token

## 📊 Coverage and Reports

### Test Coverage

- **Minimum Threshold:** 80% (recommended)
- **Reports:** HTML, LCOV, JSON, Clover formats
- **Artifacts:** Coverage reports retained for 30 days
- **Integration:** Codecov for historical tracking

### Code Quality

- **ESLint:** Enforces code style and best practices
- **Prettier:** Ensures consistent code formatting
- **Caching:** ESLint cache persisted between runs

### Security

- **Trivy:** Container vulnerability scanning
- **Docker Scout:** Additional security analysis
- **SARIF:** Results uploaded to GitHub Security tab
- **SBOM:** Software Bill of Materials generated

## 🐳 Docker Image Tags

The Docker workflow generates multiple tags:

- `latest` - Latest stable build from main branch
- `main` - Branch-based tag
- `main-{short-sha}` - Commit-specific tag
- `prod-YYYYMMDD-HHmmss` - Production timestamp tag

## 🚀 Usage Examples

### Running Locally

```bash
# Install dependencies
npm ci

# Run linting
npm run lint
npm run lint:fix

# Run formatting
npm run format:check
npm run format

# Run tests with coverage
npm test

# Build Docker image
docker build -t acquisitions:local .
```

### Manual Workflow Trigger

You can manually trigger the Docker build workflow:

1. Go to Actions > Docker Build and Push
2. Click "Run workflow"
3. Choose the branch and options
4. Click "Run workflow"

## 🔧 Maintenance

### Updating Dependencies

- Use Dependabot or regularly update GitHub Actions versions
- Test workflow changes in feature branches
- Monitor for deprecated actions or Node.js versions

### Monitoring

- Check GitHub Actions usage quotas
- Monitor Docker Hub rate limits
- Review security scan results regularly
- Update base images for security patches

## 🎯 Best Practices

1. **Branch Protection:** Enable required status checks for all workflows
2. **Secrets Management:** Rotate Docker Hub tokens regularly
3. **Resource Optimization:** Use caching to reduce build times
4. **Security:** Review and act on security scan results
5. **Documentation:** Keep this documentation updated with changes

## 📈 Metrics and Insights

The workflows provide comprehensive insights:

- **Build Times:** Monitor via GitHub Actions insights
- **Test Coverage:** Tracked via coverage reports and Codecov
- **Security Issues:** Reported in GitHub Security tab
- **Deployment History:** Tracked via deployment statuses

For questions or issues with the CI/CD pipeline, please create an issue in this repository.
