# 🤝 Contributing to Monad Community Builds Showcase

Thank you for your interest in contributing to the Monad Community Builds Showcase! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs
- Use the GitHub issue template
- Provide detailed reproduction steps
- Include browser/OS information
- Add screenshots if applicable

### Suggesting Enhancements
- Use the feature request template
- Explain the use case clearly
- Consider the impact on existing features

### Code Contributions
- Fix bugs
- Add new features
- Improve documentation
- Optimize performance
- Add tests

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Set up environment variables (see README)
5. Start development server: `npm run dev`

### Environment Setup
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Avoid `any` type - use proper typing
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### File Structure
- Keep components small and focused
- Use descriptive file names
- Group related files together
- Follow the existing folder structure

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples
```bash
feat: add project filtering by mission
fix: resolve Twitter API rate limiting issue
docs: update README with deployment instructions
style: format code with prettier
refactor: extract reusable components
test: add unit tests for ProjectCard component
chore: update dependencies
```

## 🔄 Pull Request Process

### Before Submitting
1. Ensure your code follows the coding standards
2. Add tests for new features
3. Update documentation if needed
4. Test your changes thoroughly

### PR Guidelines
1. Use a descriptive title
2. Provide a clear description of changes
3. Reference related issues
4. Include screenshots for UI changes
5. Ensure all tests pass

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 120, Firefox 115]
- Node.js version: [e.g., 18.17.0]

## Additional Information
Screenshots, error messages, etc.
```

## 💡 Suggesting Enhancements

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered

## Additional Information
Screenshots, mockups, etc.
```

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Writing Tests
- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Keep README updated
- Update API documentation

### Contributing to Docs
- Fix typos and grammar
- Add missing information
- Improve clarity
- Add examples

## 🚀 Deployment

### Testing Before Deployment
- Run all tests
- Check for console errors
- Test on different browsers
- Verify responsive design
- Test all user flows

### Deployment Checklist
- [ ] All tests pass
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] No console errors
- [ ] Performance acceptable

## 🎉 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

## 📞 Getting Help

- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For questions and general discussion
- Discord: For real-time chat and support

## 🙏 Thank You

Thank you for contributing to the Monad Community Builds Showcase! Your contributions help make this project better for everyone in the Monad community.
