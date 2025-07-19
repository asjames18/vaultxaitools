# CI/CD Setup Documentation

## Overview

This document outlines the complete CI/CD (Continuous Integration/Continuous Deployment) setup for the VaultX AI Tools application using GitHub Actions.

## 🚀 Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**

#### Build Job
- **Node.js Setup**: Uses Node.js 18 with npm caching
- **Dependencies**: Installs dependencies with `npm ci`
- **Linting**: Runs ESLint with `npm run lint`
- **Type Checking**: Runs TypeScript type checking
- **Unit Tests**: Runs Jest tests with `npm test`
- **Accessibility Tests**: Runs accessibility audit
- **Build**: Builds the Next.js application
- **Smoke Tests**: Runs basic smoke tests

#### Accessibility Job
- **Playwright Setup**: Installs Playwright for browser testing
- **Application Build**: Builds the application
- **Application Start**: Starts the application in background
- **Accessibility Audit**: Runs automated accessibility tests

#### Security Job
- **Security Audit**: Runs `npm audit` for vulnerability scanning
- **Dependency Check**: Uses `audit-ci` for CI-friendly security checks

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch (after CI passes)

**Jobs:**

#### CI Job
- Runs all CI checks before deployment
- Ensures code quality and tests pass

#### Deploy Job
- **Build**: Builds the application with environment variables
- **Vercel Deployment**: Deploys to Vercel production environment

## 📦 Package Scripts

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing Scripts
```bash
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run type-check   # Run TypeScript type checking
```

### CI/CD Scripts
```bash
npm run accessibility-test  # Run accessibility audit
npm run smoke-test         # Run smoke tests
```

## 🧪 Testing Setup

### Jest Configuration (`jest.config.js`)
- **Next.js Integration**: Uses `next/jest` for Next.js compatibility
- **Test Environment**: Uses `jsdom` for DOM testing
- **Coverage**: Collects coverage from source files
- **Thresholds**: 70% coverage requirement
- **Module Mapping**: Maps `@/` to `src/` directory

### Jest Setup (`jest.setup.js`)
- **Testing Library**: Imports `@testing-library/jest-dom`
- **Next.js Mocks**: Mocks Next.js router and navigation
- **Supabase Mocks**: Mocks Supabase client
- **Environment Variables**: Sets up test environment variables
- **Global Mocks**: Mocks browser APIs (ResizeObserver, IntersectionObserver)

### Test Files
- **Component Tests**: `src/components/__tests__/`
- **Unit Tests**: `src/**/*.test.{js,jsx,ts,tsx}`
- **Integration Tests**: `src/**/*.spec.{js,jsx,ts,tsx}`

## 🔧 Smoke Tests

### Smoke Test Script (`scripts/smoke-test.js`)
Performs basic health checks:

1. **Build Directory**: Checks if `.next` directory exists
2. **Package.json**: Validates required scripts exist
3. **TypeScript Config**: Checks `tsconfig.json` exists
4. **Next.js Config**: Validates Next.js configuration
5. **Environment Variables**: Checks environment setup
6. **Source Files**: Validates source directory structure
7. **Dependencies**: Checks if dependencies are installed
8. **Build Process**: Tests application build process

## 🔍 Accessibility Testing

### Accessibility Test Script (`scripts/accessibility-test.js`)
Scans components for accessibility patterns:

- **ARIA Attributes**: Checks for proper ARIA usage
- **Semantic HTML**: Validates semantic structure
- **Focus Management**: Checks focus indicators
- **Form Accessibility**: Validates form labels and structure
- **Role Attributes**: Checks proper role usage
- **Keyboard Navigation**: Validates keyboard support

## 🔐 Environment Variables

### Required Secrets
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Vercel Deployment (for production)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Local Environment
Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Coverage Requirements

### Test Coverage Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
- Generated automatically in CI
- Available in GitHub Actions artifacts
- Can be viewed in pull requests

## 🚀 Deployment

### Vercel Deployment
- **Automatic**: Deploys on push to `main` branch
- **Preview**: Creates preview deployments for pull requests
- **Production**: Deploys to production after CI passes

### Deployment Process
1. **CI Checks**: All tests and checks must pass
2. **Build**: Application is built with production settings
3. **Deploy**: Deployed to Vercel production environment
4. **Verification**: Smoke tests run on deployed application

## 🔄 Workflow Triggers

### CI Workflow
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Deploy Workflow
```yaml
on:
  push:
    branches: [main]
```

## 📋 Best Practices

### Code Quality
- **Linting**: ESLint runs on every commit
- **Type Checking**: TypeScript validates types
- **Formatting**: Consistent code formatting
- **Pre-commit Hooks**: Consider adding pre-commit hooks

### Testing
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure accessibility compliance
- **Smoke Tests**: Verify basic functionality

### Security
- **Dependency Scanning**: Regular security audits
- **Vulnerability Checks**: Automated vulnerability scanning
- **Secret Management**: Secure environment variable handling

### Performance
- **Build Optimization**: Optimized production builds
- **Bundle Analysis**: Monitor bundle sizes
- **Performance Monitoring**: Track performance metrics

## 🛠️ Local Development

### Running Tests Locally
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run accessibility-test

# Run smoke tests
npm run smoke-test
```

### Pre-commit Checklist
- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Accessibility tests pass (`npm run accessibility-test`)
- [ ] Smoke tests pass (`npm run smoke-test`)

## 📈 Monitoring

### GitHub Actions
- **Workflow Status**: Monitor workflow success/failure
- **Test Results**: Review test coverage and results
- **Deployment Status**: Track deployment success
- **Performance**: Monitor build and test times

### Application Monitoring
- **Error Tracking**: Monitor application errors
- **Performance**: Track application performance
- **User Analytics**: Monitor user behavior
- **Accessibility**: Track accessibility compliance

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
- Check TypeScript errors
- Verify all dependencies are installed
- Ensure environment variables are set

#### Test Failures
- Review test output for specific failures
- Check for missing mocks or dependencies
- Verify test environment setup

#### Deployment Issues
- Check Vercel configuration
- Verify environment variables in Vercel
- Review deployment logs

#### Accessibility Issues
- Run accessibility tests locally
- Review ARIA attributes and semantic HTML
- Check keyboard navigation

### Debugging Commands
```bash
# Debug build issues
npm run build --verbose

# Debug test issues
npm test -- --verbose

# Debug accessibility issues
npm run accessibility-test

# Check environment variables
node -e "console.log(process.env)"
```

## 📚 Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)

### Tools
- [ESLint](https://eslint.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Playwright](https://playwright.dev/)
- [Vercel](https://vercel.com/)

### Best Practices
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.w3.org/WAI/ER/tools/)
- [CI/CD Best Practices](https://martinfowler.com/articles/continuousIntegration.html) 