# Contributing to Task Manager Pro

First off, thank you for considering contributing to Task Manager Pro! 🎉

It's people like you that make Task Manager Pro such a great tool. We welcome contributions from everyone, whether you're fixing a typo, adding a feature, or improving documentation.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Browser and version** (e.g., Chrome 120)
- **Operating system** (e.g., Windows 11, macOS 14)
- **Console errors** if any

**Example:**

```markdown
**Title:** Calendar view doesn't display tasks on correct dates

**Description:**
Tasks are appearing one day earlier in calendar view.

**Steps to Reproduce:**
1. Create a task with due date Dec 15, 2025
2. Switch to calendar view
3. Task appears on Dec 14 instead

**Expected:** Task should appear on Dec 15
**Actual:** Task appears on Dec 14

**Browser:** Chrome 120
**OS:** Windows 11
```

### Suggesting Features

We love feature suggestions! Before suggesting, check if it's already proposed.

**When suggesting a feature, include:**

- **Clear title and description**
- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches?
- **Mockups or examples** - Visual aids help!
- **Priority** - Nice-to-have or critical?

**Example:**

```markdown
**Title:** Add recurring tasks feature

**Use Case:**
Users need to create tasks that repeat daily, weekly, or monthly
(e.g., "Daily standup meeting", "Monthly report")

**Proposed Solution:**
Add a "Repeat" dropdown in task form with options:
- None (default)
- Daily
- Weekly
- Monthly
- Custom

**Priority:** High - Frequently requested
```

### Improving Documentation

Documentation improvements are always welcome!

- Fix typos or unclear explanations
- Add examples or use cases
- Improve formatting or structure
- Translate to other languages
- Add screenshots or diagrams

### Contributing Code

We welcome code contributions! See [Development Workflow](#development-workflow) below.

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, Atom, etc.)
- Basic knowledge of HTML, CSS, JavaScript
- Git for version control

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/task-manager-pro.git
   cd task-manager-pro
   ```

3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-new-feature
   ```

4. **Open in browser**:
   ```bash
   # Simply open task-manager.html in your browser
   open task-manager.html
   ```

5. **Make your changes** and test thoroughly

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add some feature"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

8. **Create a Pull Request** on GitHub

## 🔄 Development Workflow

### Project Structure

```
task-manager-pro/
├── task-manager.html              # Main HTML structure
├── task-manager.css               # All styles
├── task-manager-enhanced.js       # Application logic
├── README.md                      # GitHub README
├── CONTRIBUTING.md                # This file
├── CHANGELOG.md                   # Version history
└── docs/                          # Documentation
    ├── INDEX.md
    ├── QUICK-START.md
    └── ...
```

### Making Changes

1. **Keep it vanilla** - No dependencies, pure JavaScript
2. **Test in multiple browsers** - Chrome, Firefox, Safari, Edge
3. **Maintain existing style** - Follow code patterns
4. **Add comments** - Explain complex logic
5. **Update documentation** - If adding features
6. **Test thoroughly** - All views and interactions

### Testing Checklist

Before submitting a PR, verify:

- [ ] All 4 views work correctly (List, Kanban, Calendar, Timeline)
- [ ] Drag-and-drop functions properly
- [ ] Tasks save to LocalStorage
- [ ] Filters and sorting work
- [ ] AI assistant responds correctly
- [ ] Responsive on mobile/tablet
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed

## 🎨 Style Guidelines

### JavaScript Style

```javascript
// Use ES6+ features
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    // Use arrow functions for callbacks
    handleClick = (e) => {
        // Do something
    }

    // Use template literals
    createCard(task) {
        return `
            <div class="task-card">
                <h3>${task.title}</h3>
            </div>
        `;
    }

    // Use descriptive names
    getFilteredTasks() {
        return this.tasks.filter(t => !t.completed);
    }
}

// Use const/let, not var
const API_URL = 'https://api.example.com';
let currentView = 'list';

// Add comments for complex logic
// Calculate days until due date, accounting for timezone
const daysUntilDue = Math.floor(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
);
```

### CSS Style

```css
/* Use CSS variables for colors */
:root {
    --primary-color: #2383e2;
    --text-primary: #37352f;
}

/* Use BEM-like naming */
.task-card {
    /* Block */
}

.task-card__title {
    /* Element */
}

.task-card--completed {
    /* Modifier */
}

/* Group related properties */
.button {
    /* Positioning */
    position: relative;
    
    /* Box model */
    display: flex;
    padding: 10px 20px;
    
    /* Visual */
    background: var(--primary-color);
    border-radius: 6px;
    
    /* Typography */
    font-size: 0.875rem;
    font-weight: 500;
    
    /* Animation */
    transition: all 0.15s ease;
}

/* Use meaningful comments */
/* Kanban board layout - 3 equal columns with gaps */
.kanban-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
```

### HTML Style

```html
<!-- Use semantic HTML -->
<header class="header">
    <h1>Task Manager Pro</h1>
</header>

<main class="main-content">
    <section class="tasks-section">
        <article class="task-card">
            <!-- Task content -->
        </article>
    </section>
</main>

<!-- Use data attributes for JS hooks -->
<button data-action="delete" data-id="123">
    Delete
</button>

<!-- Add ARIA labels for accessibility -->
<button aria-label="Close modal" class="close-btn">
    &times;
</button>
```

### Code Formatting

- **Indentation**: 4 spaces (no tabs)
- **Line length**: Max 100 characters
- **Quotes**: Single quotes for JS, double for HTML
- **Semicolons**: Always use them in JavaScript
- **Trailing commas**: Use in multi-line objects/arrays

## 📝 Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commit messages
feat(kanban): add drag-and-drop functionality
fix(calendar): correct date display for tasks
docs(readme): add installation instructions
style(css): improve button hover states
refactor(js): simplify task filtering logic

# Bad commit messages
update stuff
fixed bug
changes
WIP
```

### Detailed Example

```
feat(ai): add natural language task creation

Users can now create tasks by typing natural language
in the AI chat, e.g., "Remind me to call John tomorrow"

The AI will parse the input and extract:
- Task title
- Due date
- Priority (if mentioned)

Closes #42
```

## 🔀 Pull Request Process

### Before Submitting

1. **Update documentation** if you've added features
2. **Update CHANGELOG.md** with your changes
3. **Test thoroughly** across browsers
4. **Run through testing checklist**
5. **Ensure no console errors**
6. **Check responsive design**

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile
- [ ] All views work correctly
- [ ] No console errors

## Screenshots
(If applicable)

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** - Must pass (if configured)
2. **Code review** - At least one maintainer approval
3. **Testing** - Maintainers will test your changes
4. **Feedback** - Address any requested changes
5. **Merge** - Once approved, we'll merge your PR

### After Merge

- Your contribution will be credited in CHANGELOG.md
- You'll be added to contributors list
- Changes will be included in next release

## 🌟 Recognition

Contributors are recognized in:

- **README.md** - Contributors section
- **CHANGELOG.md** - Version history
- **GitHub** - Automatic contributor badge

## 💬 Community

### Getting Help

- **Documentation**: Check [INDEX.md](INDEX.md) first
- **Issues**: Search existing issues
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: Contact maintainers directly

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions
- **Email**: Direct contact with maintainers

## 🎯 Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

Examples:
- Documentation improvements
- UI tweaks
- Small bug fixes
- Adding examples
- Improving error messages

## 📚 Resources

### Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JS reference
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [CSS Tricks](https://css-tricks.com/) - CSS tips and tricks

### Project Resources

- [Documentation](INDEX.md)
- [Quick Start Guide](QUICK-START.md)
- [Feature Comparison](FEATURES-COMPARISON.md)
- [Implementation Summary](IMPLEMENTATION-SUMMARY.md)

## ❓ Questions?

Don't hesitate to ask! We're here to help:

- Open an issue with your question
- Start a discussion on GitHub
- Contact maintainers directly

## 🙏 Thank You!

Thank you for contributing to Task Manager Pro! Every contribution, no matter how small, makes a difference.

---

**Happy Coding!** 🚀

*Last Updated: 2025-09-30*
