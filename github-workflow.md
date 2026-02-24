# 🔄 GitHub Workflow Guide
## 🏨 Ocean View Resort – Online Room Reservation System

This document explains the complete GitHub workflow followed for this project, covering all academic requirements.

---

## ✅ Requirement 1: Public GitHub Repository

### How It Was Done

1. **Created** a new repository on GitHub under account `kavinda-dev`
   - Repository name: `Ocean-View-Resort-Online-Room-Reservation-System`
   - Visibility: ✅ **Public**
   - No auto-generated README (we added our own)

2. **Linked** the local project to the GitHub remote:

```bash
git remote add origin https://github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System.git
```

3. **Authenticated** using a GitHub Fine-Grained Personal Access Token (PAT):
   - Go to: GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Set **Resource owner** to your account
   - Set **Repository access** → All repositories
   - Set **Contents** permission → `Read and write`
   - Generate and copy the token

4. **Set remote URL** with token embedded:

```bash
git remote set-url origin https://kavinda-dev:<YOUR_PAT>@github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System.git
```

🔗 **Repository:** https://github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System

---

## ✅ Requirement 2: 15–25 Commits Spread Over Time

### Strategy: One Feature = One Commit

Never do all commits in one day. Spread them across your development timeline.

### Commit Schedule (Recommended)

| Day | Branch | Commit Description |
|-----|--------|-------------------|
| Day 1 | `main` | `chore: initial project setup with .gitignore and PRD` |
| Day 1 | `main` | `chore: add MySQL database schema v1.0.0` |
| Day 1 | `main` | `chore: add Maven pom.xml with semantic version 1.0.0` |
| Day 2 | `feature/backend-api` | `feat: add User and Reservation model classes` |
| Day 2 | `feature/backend-api` | `feat: implement DatabaseConnection Singleton pattern` |
| Day 3 | `feature/backend-api` | `feat: add UserDAO with SHA-256 password validation` |
| Day 3 | `feature/backend-api` | `feat: add ReservationDAO with CRUD and overlap check` |
| Day 4 | `feature/backend-api` | `feat: implement LoginServlet POST /api/login` |
| Day 4 | `feature/backend-api` | `feat: implement ReservationServlet POST/GET/DELETE` |
| Day 4 | `feature/backend-api` | `chore: add web.xml deployment descriptor` |
| Day 5 | `feature/frontend-ui` | `feat: initialize React frontend with package.json` |
| Day 5 | `feature/frontend-ui` | `feat: add App.jsx with React Router and protected routes` |
| Day 6 | `feature/frontend-ui` | `feat: add responsive Bootstrap 5 Navbar` |
| Day 6 | `feature/frontend-ui` | `feat: implement Login page with form validation` |
| Day 7 | `feature/frontend-ui` | `feat: add Dashboard with live stats` |
| Day 7 | `feature/frontend-ui` | `feat: add AddReservation form with bill preview` |
| Day 8 | `feature/frontend-ui` | `feat: add ViewReservation page with search` |
| Day 8 | `feature/frontend-ui` | `feat: add printable Invoice page` |
| Day 9 | `feature/frontend-ui` | `feat: add Help page with usage guide` |
| Day 9 | `feature/reports` | `feat: add Reports page with all 4 report types` |
| Day 10 | `feature/reports` | `feat: implement ReportServlet /api/reports/* endpoints` |
| Day 11 | `develop` | `merge: integrate backend API layer into develop` |
| Day 11 | `develop` | `merge: integrate React frontend UI into develop` |
| Day 12 | `main` | `release: merge develop into main for v1.0.0` |

> **Total: 24 commits** spread over 12 days ✅

### How to Make a Commit

```bash
# Stage specific file(s)
git add path/to/file.java

# Commit with a descriptive message (use conventional commits)
git commit -m "feat: add UserDAO with login validation"

# Push to the current branch
git push origin feature/backend-api
```

### Conventional Commit Prefixes

| Prefix | Use For |
|--------|---------|
| `feat:` | New feature added |
| `fix:` | Bug fix |
| `chore:` | Config, setup, non-code changes |
| `docs:` | Documentation updates |
| `refactor:` | Code restructuring |
| `test:` | Adding tests |
| `merge:` | Branch merges |
| `release:` | Version releases |

---

## ✅ Requirement 3: Minimum 4 Branches

### Branch Strategy Used

```
main
 └── develop
      ├── feature/backend-api
      ├── feature/frontend-ui
      └── feature/reports
```

### Branch Descriptions

| Branch | Purpose |
|--------|---------|
| `main` | ⭐ Stable, production-ready code. Only merge from `develop`. |
| `develop` | 🔧 Integration branch. All features merge here first. |
| `feature/backend-api` | Java models, DAOs (UserDAO, ReservationDAO), Servlets, DatabaseConnection |
| `feature/frontend-ui` | All React pages: Login, Dashboard, Add/View Reservation, Invoice, Help |
| `feature/reports` | Reports page (React) + ReportServlet (Java) |

### How to Create and Use Branches

```bash
# Create and switch to a new branch
git checkout -b feature/backend-api

# Work on your files, then commit...
git add src/main/java/com/oceanview/dao/UserDAO.java
git commit -m "feat: add UserDAO with SHA-256 password validation"

# Push the branch to GitHub
git push -u origin feature/backend-api

# When feature is ready, merge into develop
git checkout develop
git merge --no-ff feature/backend-api -m "merge: integrate backend API layer"
git push origin develop

# When develop is stable, merge into main
git checkout main
git merge --no-ff develop -m "release: v1.0.0"
git push origin main
```

### Push All Branches at Once

```bash
git push -u origin main
git push -u origin develop
git push -u origin feature/backend-api
git push -u origin feature/frontend-ui
git push -u origin feature/reports
```

---

## ✅ Requirement 4: Semantic Versioning (x.y.z) in pom.xml

### What Is Semantic Versioning?

```
MAJOR . MINOR . PATCH
  1   .   0   .   0
```

| Part | When to Increment |
|------|------------------|
| `MAJOR` | Breaking changes (incompatible API changes) |
| `MINOR` | New features (backward-compatible) |
| `PATCH` | Bug fixes (backward-compatible) |

### In This Project – pom.xml

```xml
<groupId>com.oceanview</groupId>
<artifactId>ocean-view-resort</artifactId>
<version>1.0.0</version>
<packaging>war</packaging>
```

**Current version:** `1.0.0` — Initial release

### Version Progression Example

| Version | Meaning |
|---------|---------|
| `1.0.0` | Initial release |
| `1.0.1` | Bug fix (e.g., fixed date validation) |
| `1.1.0` | New feature added (e.g., email notifications) |
| `2.0.0` | Major redesign or breaking API change |

### Adding a Git Tag for the Version

```bash
# Create an annotated tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"

# Push the tag to GitHub
git push origin v1.0.0
```

Tags appear in GitHub under **Releases / Tags** section.

---

## ✅ Requirement 5: Clear README with Setup Instructions

### What the README.md Contains

| Section | Content |
|---------|---------|
| Project Overview | What the system does and why |
| Features Table | All key features listed |
| Technology Stack | Frontend, Backend, DB, Build tool |
| Architecture Diagram | ASCII 3-tier architecture diagram |
| Prerequisites | Java, Maven, MySQL, Node.js, Tomcat |
| Setup Instructions | Step-by-step with code blocks |
| Database Setup | SQL table definitions |
| API Endpoints | All REST endpoints with methods |
| Branching Strategy | Branch names and purposes |
| Room Rates | LKR rates per room type |
| Project Structure | Full folder tree |

### README File Location

```
Ocean-View-Resort-Online-Room-Reservation-System/
└── README.md   ← displayed on GitHub repository homepage
```

> ⚠️ In this project, `README.md` is kept **local only** (excluded via `.gitignore`) so the raw prd.md is used instead on GitHub.

---

## 🗂️ Complete Project Git Commands Reference

```bash
# Initial setup
git init
git config user.name "kavinda-dev"
git config user.email "kavinda-dev@users.noreply.github.com"
git remote add origin https://github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System.git

# First commit on main
git add .gitignore prd.md
git commit -m "chore: initial project setup"

# Create branches
git checkout -b develop
git checkout -b feature/backend-api
git checkout -b feature/frontend-ui
git checkout -b feature/reports

# Stage, commit, push pattern
git add <file>
git commit -m "feat: description of change"
git push origin <branch-name>

# Merge features into develop
git checkout develop
git merge --no-ff feature/backend-api -m "merge: backend API"
git merge --no-ff feature/frontend-ui -m "merge: frontend UI"
git merge --no-ff feature/reports     -m "merge: reports module"

# Release to main
git checkout main
git merge --no-ff develop -m "release: v1.0.0"
git tag -a v1.0.0 -m "Initial release"

# Push everything
git push -u origin main develop feature/backend-api feature/frontend-ui feature/reports
git push origin v1.0.0
```

---

*Workflow Document | Ocean View Resort Reservation System | v1.0.0 | February 2026*
