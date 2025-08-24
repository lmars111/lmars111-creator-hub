# lmars111-creator-hub

A modern creator platform built with Next.js and TypeScript, featuring analytics, secure payments, and comprehensive observability.

## Features

- **Creator Profiles**: Connect with creators and access exclusive content
- **Secure Payments**: Stripe integration for safe transactions
- **Analytics**: PostHog integration for user insights and business metrics
- **Observability**: Sentry error tracking and monitoring
- **Legal Compliance**: Comprehensive legal pages and policies

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lmars111/lmars111-creator-hub.git
   cd lmars111-creator-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required for Production

- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog analytics key
- `SENTRY_DSN`: Sentry error tracking DSN

### Optional

- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host (defaults to app.posthog.com)

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

## Project Structure

```
├── pages/                 # Next.js pages and API routes
│   ├── api/              # API endpoints
│   │   ├── creator/      # Creator-related APIs
│   │   ├── chat/         # Chat functionality
│   │   ├── content/      # Content management
│   │   └── webhooks/     # External webhooks
│   ├── terms.tsx         # Legal pages
│   ├── privacy.tsx
│   ├── refunds.tsx
│   └── content-policy.tsx
├── components/           # Reusable React components
├── lib/                 # Utility libraries
│   ├── analytics.ts     # PostHog integration
│   └── sentry.ts        # Error tracking
├── docs/                # Documentation
│   ├── analytics.md
│   ├── observability.md
│   ├── legal.md
│   └── branch-protection.md
└── .github/workflows/   # CI/CD workflows
```

## Contributing / PRs

We welcome contributions to improve the Creator Hub platform! Please follow these guidelines when submitting pull requests.

### Before You Start

1. **Check existing issues**: Look for existing issues or feature requests
2. **Discuss major changes**: For significant features, please open an issue first to discuss the approach
3. **Fork the repository**: Create your own fork to work on changes

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow TypeScript best practices
   - Add appropriate error handling
   - Update documentation if needed
   - Follow existing code style and patterns

3. **Test your changes**:
   ```bash
   npm run build    # Ensure build passes
   npm run lint     # Fix any linting issues
   npm run typecheck # Resolve TypeScript errors
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for test additions

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a pull request through GitHub.

### Pull Request Requirements

Your PR will be automatically checked by our CI system, which runs:

- **Build verification**: `npm run build`
- **Type checking**: `npm run typecheck` (if available)
- **Linting**: `npm run lint`
- **Tests**: `npm test` (if available)

**Requirements for merge:**
- [ ] All CI checks must pass
- [ ] Code review approval from maintainer
- [ ] No merge conflicts
- [ ] Documentation updated (if applicable)
- [ ] Breaking changes clearly documented

### Code Style Guidelines

- **TypeScript**: Use strict TypeScript types
- **Error Handling**: Always handle errors gracefully
- **Analytics**: Add appropriate tracking for new features
- **Observability**: Include error reporting for new API endpoints
- **Documentation**: Update docs for new features or changes

### Testing

- Write tests for new functionality when possible
- Ensure existing functionality isn't broken
- Test error scenarios and edge cases
- Verify analytics and error tracking work correctly

### Documentation

Update relevant documentation:
- `README.md` for new features or setup changes
- API documentation for new endpoints
- Environment variable documentation
- Feature-specific docs in `/docs` folder

### Legal Considerations

When contributing:
- Ensure no copyrighted material is included
- Respect user privacy in any new features
- Follow platform content policies
- Consider legal implications of new functionality

### Getting Help

- **Questions**: Open a GitHub issue with the `question` label
- **Bugs**: Open a GitHub issue with the `bug` label
- **Feature Requests**: Open a GitHub issue with the `enhancement` label
- **Security Issues**: Email security@creatorhub.com directly

### Review Process

1. **Automated checks**: CI runs automatically on PR creation
2. **Code review**: Maintainer reviews code and provides feedback
3. **Iteration**: Address feedback and update PR as needed
4. **Approval**: PR approved when all requirements met
5. **Merge**: Maintainer merges approved PR

Thank you for contributing to Creator Hub! 🚀