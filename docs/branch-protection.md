# Branch Protection Requirements

This document outlines the recommended branch protection settings for the Creator Hub repository to ensure code quality and security.

## Overview

Branch protection rules help maintain code quality by requiring certain checks to pass before code can be merged into protected branches. These settings should be configured by the repository owner in GitHub Settings.

## Required Settings

### Main Branch Protection

The `main` branch should be protected with the following settings:

#### Status Checks

**Require status checks to pass before merging**
- [x] Enable
- [x] Require branches to be up to date before merging

**Required status checks:**
- `ci / ci (18.x)` - CI workflow with Node.js 18.x
- `ci / ci (20.x)` - CI workflow with Node.js 20.x

#### Pull Request Requirements

**Require pull request reviews before merging**
- [x] Enable
- [x] Require review from code owners (if CODEOWNERS file exists)
- [x] Dismiss stale reviews when new commits are pushed
- [x] Require review approval for contributors with write access

**Required number of reviewers:** 1 (minimum)

#### Additional Restrictions

**Restrict who can push to matching branches**
- [x] Enable
- Include administrators: [x] (recommended for consistency)

**Additional settings:**
- [x] Require signed commits (optional but recommended)
- [x] Require linear history (optional, prevents merge commits)
- [x] Allow force pushes: [ ] (disabled)
- [x] Allow deletions: [ ] (disabled)

## How to Configure

### Repository Owner Steps

1. **Navigate to Repository Settings**
   - Go to `https://github.com/lmars111/lmars111-creator-hub/settings`
   - Click on "Branches" in the left sidebar

2. **Add Branch Protection Rule**
   - Click "Add rule"
   - Branch name pattern: `main`

3. **Configure Status Checks**
   - Check "Require status checks to pass before merging"
   - Check "Require branches to be up to date before merging"
   - Search and add required checks:
     - `ci / ci (18.x)`
     - `ci / ci (20.x)`

4. **Configure Pull Request Requirements**
   - Check "Require pull request reviews before merging"
   - Set "Required number of reviewers" to 1
   - Check "Dismiss stale reviews when new commits are pushed"

5. **Additional Settings**
   - Check "Restrict pushes that create files larger than 100 MB"
   - Optional: Check "Require signed commits"
   - Optional: Check "Require linear history"

6. **Save Settings**
   - Click "Create" to save the branch protection rule

## CI Workflow Integration

The CI workflow (`.github/workflows/ci.yml`) runs automatically on pull requests and provides the required status checks:

### Automated Checks

1. **Build Verification**
   - Runs `npm ci` to install dependencies
   - Runs `npm run build` to verify successful build

2. **Type Checking**
   - Runs `npm run typecheck` if available
   - Validates TypeScript types across the codebase

3. **Code Quality**
   - Runs `npm run lint` to check code style
   - Ensures consistent code formatting

4. **Testing**
   - Runs `npm test` if test scripts are available
   - Validates functionality with automated tests

### Matrix Strategy

The CI runs on multiple Node.js versions:
- Node.js 18.x (LTS)
- Node.js 20.x (Current)

This ensures compatibility across supported Node.js versions.

## Developer Workflow

With branch protection enabled, developers must:

1. **Create Feature Branches**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Test Locally**
   ```bash
   npm run build
   npm run lint
   npm run typecheck
   ```

3. **Push and Create Pull Request**
   ```bash
   git push origin feature/new-feature
   ```

4. **Wait for CI Checks**
   - All CI checks must pass (green checkmarks)
   - Fix any failing checks before requesting review

5. **Request Review**
   - Assign reviewer or request review from team
   - Address any feedback from code review

6. **Merge After Approval**
   - All checks pass ✅
   - Required reviews approved ✅
   - Ready to merge 🚀

## Bypass Scenarios

### Emergency Hotfixes

In critical situations, repository administrators can:
- Temporarily disable branch protection
- Apply hotfix directly to main
- Re-enable protection immediately after

**Important:** Document all bypasses and follow up with proper PR process.

### Failed CI Checks

If CI fails due to external issues:
- Investigate the root cause
- Fix underlying issues
- Re-run checks or push new commits
- Never bypass CI for convenience

## Monitoring and Alerts

### GitHub Notifications

Enable notifications for:
- Failed status checks
- New pull requests requiring review
- Force push attempts (should be blocked)

### Repository Insights

Monitor repository health:
- Check "Insights" > "Pulse" for activity
- Review "Network" graph for branch patterns
- Monitor "Security" tab for vulnerabilities

## Security Considerations

### Code Review Quality

Reviewers should verify:
- Code follows established patterns
- No sensitive information is committed
- Error handling is appropriate
- Documentation is updated

### Dependency Security

- Monitor for security vulnerabilities
- Review dependency updates carefully
- Use `npm audit` to check for known issues

### Access Control

- Limit repository access to necessary team members
- Use teams for group permissions
- Regularly audit collaborator access

## Troubleshooting

### Common Issues

1. **CI Checks Not Running**
   - Verify workflow file is in `.github/workflows/`
   - Check workflow syntax in GitHub Actions tab
   - Ensure branch name matches trigger conditions

2. **Required Checks Missing**
   - CI must run at least once to appear in settings
   - Create a test PR to trigger initial CI run
   - Add checks to branch protection after they appear

3. **Unable to Merge**
   - Verify all required checks are passing
   - Ensure branch is up to date with main
   - Check that required reviews are approved

### Status Check Names

The exact status check names depend on the workflow configuration:
- Format: `{workflow-name} / {job-name} ({matrix-value})`
- Example: `CI / ci (18.x)`

If check names change, update branch protection settings accordingly.

## Future Enhancements

### Additional Checks

Consider adding:
- Security scanning (CodeQL, Snyk)
- Performance testing
- End-to-end testing
- Accessibility testing

### Advanced Protection

Enhanced settings:
- Required code owner reviews
- Signed commit enforcement
- IP restrictions for sensitive repositories
- Deploy keys for production access

## Maintenance

### Regular Reviews

Monthly tasks:
- Review branch protection effectiveness
- Update required checks as CI evolves
- Audit repository access and permissions
- Check for security vulnerabilities

### Updates

When updating CI workflows:
1. Test changes in feature branch
2. Update branch protection if check names change
3. Document changes in this file
4. Communicate changes to team

## Support

For branch protection issues:
- **GitHub Documentation**: [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- **Repository Owner**: Configure settings in GitHub
- **Team Questions**: Open issue with `question` label

Remember: These settings protect code quality and should not be bypassed except in genuine emergencies! 🛡️