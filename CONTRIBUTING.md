# Contributing to Health Sentinel Mobile App

Thank you for your interest in contributing to Health Sentinel! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information** including:
   - Device and OS version
   - App version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Check the roadmap** to see if the feature is already planned
2. **Use the feature request template**
3. **Explain the use case** and why it would be valuable
4. **Consider the impact** on different user types (Health Officials, ASHA Workers, Community Members)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Follow the coding standards** outlined below
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/healthsentinel-mobileapp.git
cd healthsentinel-mobileapp

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible

### React Native/Expo
- Use functional components with hooks
- Follow React best practices
- Use Expo SDK features when available

### Redux
- Use Redux Toolkit for state management
- Create typed hooks for useSelector and useDispatch
- Keep actions and reducers simple and focused

### Styling
- Use StyleSheet.create for component styles
- Follow the existing theming system
- Ensure accessibility compliance

### File Naming
- Use PascalCase for component files
- Use camelCase for utility files
- Use kebab-case for configuration files

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for utility functions
- Write integration tests for complex components
- Use React Native Testing Library
- Mock external dependencies

## 📱 Platform Considerations

### iOS
- Test on iOS Simulator
- Consider iOS-specific UI guidelines
- Handle safe area insets properly

### Android
- Test on Android Emulator
- Consider Material Design principles
- Handle Android-specific permissions

### Web
- Ensure responsive design
- Test keyboard navigation
- Consider web-specific limitations

## ♿ Accessibility

All contributions must maintain accessibility standards:
- Proper semantic markup
- Screen reader compatibility
- Keyboard navigation support
- Color contrast compliance
- Support for large text sizes

## 🌐 Internationalization

When adding new text:
- Add translations to all supported languages
- Use the translation system (`t()` function)
- Consider text expansion in different languages
- Test with RTL languages if applicable

## 🔒 Security

- Never commit sensitive information
- Use environment variables for configuration
- Follow OWASP mobile security guidelines
- Consider healthcare data privacy requirements

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the changelog** if applicable
5. **Request review** from maintainers

### PR Title Format
```
type(scope): description

Examples:
feat(auth): add biometric authentication
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - High priority issue
- `priority:medium` - Medium priority issue
- `priority:low` - Low priority issue

## 📞 Getting Help

- **Discord**: Join our community server
- **Email**: developers@healthsentinel.com
- **Issues**: Create a GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Areas for Contribution

### High Priority
- Firebase integration
- Offline sync improvements
- Performance optimizations
- Accessibility enhancements

### Medium Priority
- UI/UX improvements
- Additional language support
- Testing coverage
- Documentation improvements

### Low Priority
- Code refactoring
- Developer tooling
- CI/CD improvements

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor appreciation post

Thank you for contributing to Health Sentinel! 🙏