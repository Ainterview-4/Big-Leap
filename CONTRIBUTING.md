🔱 1. Repository Structure (Monorepo)
frontend/    → React + Material UI
backend/     → Node.js (TS) + Express + Redis + PostgreSQL
ai/          → Python (Scraping, LoRA, RAG)
database/    → SQL + Chroma + Redis setup
data/        → Raw & processed datasets
infra/       → AWS (future)
.github/     → CI workflows

🧩 2. Branch Strategy (STRICT)
Permanent branches:
main → production
dev  → development base

Temporary branches:

Every task MUST be done in a feature branch:

feature/<task-name>


Examples:

feature/backend-auth
feature/frontend-navbar
feature/ai-scraper-glassdoor
feature/database-user-schema


❌ Never push to main
❌ Never push to dev
✔ Always push to feature branches

🧪 3. Commit Rules (VERY IMPORTANT)

Good commits = good code reviews.

✔ Commit after meaningful work:

Completed a function

Added a route

Finished a component

Created a scraping method

Updated UI state

Added SQL schema

Added documentation

❌ Do NOT commit:

Temporary console.log tests

Broken or non-running code

Files that don’t belong to your module

Node modules, venv, dist, build folders

Random changes (CSS spaces, accidental formatting)

✔ Commit message format:
feat: add user login route
fix: resolve scraper unicode bug
refactor: clean ai pipeline structure
docs: add roadmap documentation
chore: update dependencies

📤 4. Push Rules (MANDATORY)

This is where students usually fail.
So here are strict, clear rules for pushing code:

✔ Push only when:

Your code compiles without errors

Your code runs locally

Your code does not break existing functionality

Your changes are small and review-friendly

✔ Push frequency:

Small pushes, every 1–3 hours of work
This keeps PRs small and easy to review.

❌ Do NOT push:

Huge 500-line dumps

Work-in-progress experiments

Unfinished files

Unrelated changes mixed together

Merge conflicts

🔀 5. Pull Request Workflow (STRICT)
✔ After pushing your feature branch:

Open a PR into dev:

feature/<task-name> → dev

PR Requirements:

At least 1 approval

CI must pass

Code must be clean and readable

No commented-out code

No console.logs (backend)

Frontend builds successfully

Backend server runs without errors

AI scripts run without import errors

✔ When to request PR review:

Your task is complete

Your PR is under 300–500 lines

No unfinished code inside

❌ NEVER:

Merge your own PR without review

Push to dev

Merge a failing PR

⏳ 6. Workflow Summary (Copy this to team chat)
🟢 DO:

Create feature branch

Write code

Commit small chunks

Push updates

Create PR

Request review

Fix review changes

Merge after approval

🔴 DO NOT:

Push to dev or main

Commit broken code

Create giant PRs

Merge with failing CI

🎯 7. Responsibility Breakdown
Member	Module	Responsibility
Dev A	Backend	Express API, JWT, Redis, PostgreSQL
Dev B	Frontend	UI, Material UI components, routing
Dev C	AI	Scraping, LoRA, RAG, vector ingestion
Dev D	Database	PostgreSQL schemas, injections, migrations
📣 8. Need Help?

Create a GitHub Issue.


🟦 1. PR Naming Rules

Every Pull Request title must follow this pattern:

[Feature] <short description>
[Fix] <short description>
[Refactor] <short description>
[Docs] <short description>


Examples:

[Feature] Add user login API
[Fix] Resolve frontend routing issue
[Feature] Implement Glassdoor scraper
[Refactor] Clean interview service


❌ Bad PR titles:

update
changes
fixed some things
new code

🟦 2. PR Branch Rules

All PRs must follow:

👉 Source branch:

feature/<task-name>


👉 Target branch:

dev


❌ NEVER open a PR into main.

🟦 3. PR Size Rule (VERY IMPORTANT)

Small PRs = good teams.
Large PRs = failure, procrastination, chaos.

✔ Allowed PR size:

50–300 lines total

Easy to review in 5–10 minutes

❌ Forbidden PR size:

More than 500 lines

Multiple features in one PR

Unrelated files mixed

If someone opens a huge PR:

You (Scrum Master) comment:

“Please split this PR into smaller PRs.
PRs must stay under 300–500 lines.”

🟦 4. Required Before Creating a PR
You must check:

✔ Code runs locally
✔ Code compiles
✔ Backend starts with no errors
✔ Frontend builds
✔ AI scripts import correctly
✔ No console.log spam
✔ No commented-out blocks
✔ No unused variables
✔ Prettier / Black formatting applied
✔ No secrets committed (.env, keys, tokens)

🟦 5. PR Review Rules

These are strict:

✔ Every PR must be approved by 1 reviewer

If no one reviews, code cannot be merged.

✔ Scrum Master reviews critical PRs:

backend architecture

database schemas

AI training pipelines

frontend routing and structure

✔ Reviewers must check:

readable code

correct folder usage

proper naming conventions

security issues

removed logs

correct error handling

🟦 6. After PR Review — Fix the Comments

Reviewer writes comments →
Developer MUST fix them →
Push changes (same feature branch) →
Reviewer approves →
Merge.

If a teammate ignores review comments, you simply say:

“Please address all review comments before merging.”

🟦 7. Merge Rules
✔ Allowed merge method:

Squash and Merge
(keeps history clean)

❌ Forbidden merge methods:

Merge Commit

Rebase and Merge

Manual merge into dev

Direct push to dev or main

🟦 8. When to Delete Branches

After a PR is merged:

✔ Delete the feature branch
❌ NEVER reuse old branches
❌ NEVER build new features in old PR branches

🟦 9. Daily PR Workflow (Your Team Must Follow)

Copy this to your team’s WhatsApp/Discord:

DAILY WORKFLOW

1️⃣ Pull dev

git checkout dev
git pull


2️⃣ Create feature branch

git checkout -b feature/<task>


3️⃣ Write code
4️⃣ Commit small chunks
5️⃣ Push

git push origin feature/<task>


6️⃣ Create PR → dev
7️⃣ Request review
8️⃣ Fix comments
9️⃣ Merge (after approval)
🔟 Delete branch

🟢 STEP 7 COMPLETE

Now your team:

can’t merge directly

can’t push code recklessly

must follow branching rules

must create PRs correctly

must follow code review

must split tasks

must respect your leadership

Perfect.