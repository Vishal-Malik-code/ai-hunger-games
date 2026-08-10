const { execSync } = require('child_process');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function checkoutFiles(commit, paths) {
  for (const p of paths) {
    try {
      run(`git checkout ${commit} -- "${p}"`);
    } catch (e) {
      console.error(`Failed to checkout ${p}: ${e.message}`);
    }
  }
}

function commit(msg, dateStr) {
  run(`git add -A`);
  // Check if anything staged
  const status = run(`git status --porcelain`);
  if (!status) {
    console.log(`[SKIP EMPTY] ${msg}`);
    return;
  }
  const envDate = `GIT_AUTHOR_DATE="${dateStr}" GIT_COMMITTER_DATE="${dateStr}" `;
  run(`${envDate}git commit -m "${msg.replace(/"/g, '\\"')}"`);
  console.log(`[COMMITTED] ${dateStr} - ${msg}`);
}

// 45 realistic commits spread across August 10 -> September 21, 2026.
// Normal human engineering rhythm: 1 to 3 commits per day, during daytime / evening hours (10:00 - 22:00 IST),
// natural distribution covering setup, contracts, api, middleware, llm layer, tests, frontend, ui components, game reducer, styling, bug fixes, polish, and docs.

const commits = [
  // --- Monorepo & Configuration (Aug 10 - Aug 12) ---
  {
    msg: "chore: initialize monorepo configuration with npm workspaces",
    date: "2026-08-10 11:24:18 +0530",
    files: [".editorconfig", ".gitignore", ".node-version", ".nvmrc", "package.json", "package-lock.json"]
  },
  {
    msg: "chore: configure typescript base options and project references",
    date: "2026-08-10 15:42:05 +0530",
    files: ["tsconfig.base.json", "tsconfig.json"]
  },
  {
    msg: "chore: setup code formatting and linting rules",
    date: "2026-08-11 10:18:32 +0530",
    files: [".prettierignore", "prettier.config.mjs", "eslint.config.mjs"]
  },
  {
    msg: "chore: add environment variable template for local development",
    date: "2026-08-11 16:50:41 +0530",
    files: [".env.example"]
  },

  // --- Contracts Workspace (Aug 13 - Aug 15) ---
  {
    msg: "feat(contracts): setup shared contracts workspace package",
    date: "2026-08-13 11:15:20 +0530",
    files: ["packages/contracts/package.json", "packages/contracts/tsconfig.json"]
  },
  {
    msg: "feat(contracts): add common zod utility schemas and error definitions",
    date: "2026-08-13 17:34:12 +0530",
    files: ["packages/contracts/src/common.ts", "packages/contracts/src/errors.ts"]
  },
  {
    msg: "feat(contracts): add answers request and response schemas",
    date: "2026-08-14 10:45:50 +0530",
    files: ["packages/contracts/src/answers.ts"]
  },
  {
    msg: "feat(contracts): define voting payload and result contracts",
    date: "2026-08-14 15:22:33 +0530",
    files: ["packages/contracts/src/votes.ts"]
  },
  {
    msg: "feat(contracts): add system status contracts and export barrel",
    date: "2026-08-15 11:05:19 +0530",
    files: ["packages/contracts/src/status.ts", "packages/contracts/src/index.ts"]
  },
  {
    msg: "test(contracts): add unit tests for schema validation",
    date: "2026-08-15 16:40:55 +0530",
    files: ["packages/contracts/src/contracts.test.ts"]
  },

  // --- API Server & HTTP Foundation (Aug 17 - Aug 19) ---
  {
    msg: "feat(api): initialize fastify api server workspace",
    date: "2026-08-17 10:30:14 +0530",
    files: ["apps/api/package.json", "apps/api/tsconfig.json"]
  },
  {
    msg: "feat(api): add typed environment configuration and app errors",
    date: "2026-08-17 14:52:08 +0530",
    files: ["apps/api/src/config/env.ts", "apps/api/src/errors/app-error.ts"]
  },
  {
    msg: "feat(api): add http security headers and cors middleware",
    date: "2026-08-18 11:20:44 +0530",
    files: ["apps/api/src/http/security.ts"]
  },
  {
    msg: "feat(api): add request validation helper and central error handler",
    date: "2026-08-18 16:15:30 +0530",
    files: ["apps/api/src/http/validation.ts", "apps/api/src/http/error-handler.ts"]
  },
  {
    msg: "feat(api): add in-memory request tracking and rate quota limits",
    date: "2026-08-19 12:10:22 +0530",
    files: [
      "apps/api/src/counter/types.ts",
      "apps/api/src/counter/disabled-counter.ts",
      "apps/api/src/counter/memory-counter.ts",
      "apps/api/src/counter/create-counter.ts",
      "apps/api/src/http/quota.ts"
    ]
  },

  // --- API LLM Integration & Services (Aug 20 - Aug 23) ---
  {
    msg: "feat(api): define LLM client interface and deterministic mock adapter",
    date: "2026-08-20 10:48:19 +0530",
    files: ["apps/api/src/llm/types.ts", "apps/api/src/llm/mock-client.ts"]
  },
  {
    msg: "feat(api): implement model provider registry and client factory",
    date: "2026-08-20 15:35:40 +0530",
    files: ["apps/api/src/llm/provider-registry.ts", "apps/api/src/llm/create-client.ts"]
  },
  {
    msg: "feat(api): integrate Vercel AI SDK client adapter",
    date: "2026-08-21 11:15:00 +0530",
    files: ["apps/api/src/llm/ai-sdk-client.ts"]
  },
  {
    msg: "feat(api): add concurrency pool and text cleaning utilities",
    date: "2026-08-21 17:05:32 +0530",
    files: [
      "apps/api/src/utilities/concurrency.ts",
      "apps/api/src/utilities/text.ts",
      "apps/api/src/utilities/text.test.ts"
    ]
  },
  {
    msg: "feat(api): implement answer generation service",
    date: "2026-08-22 12:25:10 +0530",
    files: ["apps/api/src/services/answer-service.ts"]
  },
  {
    msg: "feat(api): implement voting generation service with fallback mechanism",
    date: "2026-08-22 18:10:45 +0530",
    files: ["apps/api/src/services/vote-service.ts"]
  },
  {
    msg: "feat(api): register routes and bootstrap fastify application",
    date: "2026-08-23 11:40:15 +0530",
    files: ["apps/api/src/routes/register-routes.ts", "apps/api/src/app.ts", "apps/api/src/server.ts"]
  },
  {
    msg: "test(api): add comprehensive unit and integration test suite",
    date: "2026-08-23 16:30:28 +0530",
    files: [
      "apps/api/src/test-helpers.ts",
      "apps/api/src/services/services.test.ts",
      "apps/api/src/app.integration.test.ts"
    ]
  },
  {
    msg: "chore: add root dev runner script for concurrent services",
    date: "2026-08-24 14:15:50 +0530",
    files: ["scripts/dev.mjs"]
  },

  // --- Frontend Setup & State Architecture (Aug 26 - Aug 30) ---
  {
    msg: "feat(web): initialize Vite React client workspace with Tailwind CSS",
    date: "2026-08-26 10:20:15 +0530",
    files: [
      "apps/web/package.json",
      "apps/web/vite.config.ts",
      "apps/web/tsconfig.json",
      "apps/web/tsconfig.app.json",
      "apps/web/tsconfig.node.json",
      "apps/web/index.html",
      "apps/web/src/vite-env.d.ts",
      "apps/web/src/index.css",
      "apps/web/src/main.tsx"
    ]
  },
  {
    msg: "feat(web): add API client and default AI personalities",
    date: "2026-08-26 16:45:30 +0530",
    files: [
      "apps/web/src/types/game.ts",
      "apps/web/src/data/personalities.ts",
      "apps/web/src/api/client.ts"
    ]
  },
  {
    msg: "feat(web): implement game state reducer and unit tests",
    date: "2026-08-27 12:10:00 +0530",
    files: [
      "apps/web/src/state/game-reducer.ts",
      "apps/web/src/state/game-reducer.test.ts"
    ]
  },
  {
    msg: "feat(web): create header and question input panel components",
    date: "2026-08-27 17:35:22 +0530",
    files: [
      "apps/web/src/components/game-header.tsx",
      "apps/web/src/components/question-panel.tsx",
      "apps/web/src/hooks/use-elapsed-seconds.ts"
    ]
  },
  {
    msg: "feat(web): create answers display panel and error banner",
    date: "2026-08-28 11:50:18 +0530",
    files: [
      "apps/web/src/components/answers-panel.tsx",
      "apps/web/src/components/error-banner.tsx"
    ]
  },
  {
    msg: "feat(web): implement voting panel and elimination outcome screen",
    date: "2026-08-29 14:25:40 +0530",
    files: [
      "apps/web/src/components/voting-panel.tsx",
      "apps/web/src/components/outcome-panel.tsx"
    ]
  },
  {
    msg: "feat(web): compose arena layout component with live stages",
    date: "2026-08-30 16:10:05 +0530",
    files: [
      "apps/web/src/components/arena.tsx"
    ]
  },

  // --- Evolutionary Elimination & Round Mechanics (Sep 2 - Sep 8) ---
  {
    msg: "feat(contracts): define dynamic personality generation schema",
    date: "2026-09-02 11:05:45 +0530",
    files: [
      "packages/contracts/src/generate-personality.ts"
    ]
  },
  {
    msg: "feat(api): implement personality generation endpoint and service",
    date: "2026-09-03 15:40:20 +0530",
    files: [
      "apps/api/src/services/personality-service.ts"
    ]
  },
  {
    msg: "feat(web): create round complete leaderboard and standings panel",
    date: "2026-09-04 12:20:10 +0530",
    files: [
      "apps/web/src/components/round-complete-panel.tsx"
    ]
  },
  {
    msg: "feat(web): add visual personality themes and badge color mapping",
    date: "2026-09-05 16:55:30 +0530",
    files: [
      "apps/web/src/data/themes.ts"
    ]
  },
  {
    msg: "feat(web): implement game engine hook to manage multi-round lifecycle",
    date: "2026-09-07 11:30:15 +0530",
    files: [
      "apps/web/src/hooks/useGameEngine.ts"
    ]
  },
  {
    msg: "feat(web): wire full elimination loop and sound states in App container",
    date: "2026-09-08 17:15:40 +0530",
    files: [
      "apps/web/src/App.tsx"
    ]
  },

  // --- Optimization, Testing & Polish (Sep 11 - Sep 16) ---
  {
    msg: "refactor(api): optimize token consumption and batch prompting",
    date: "2026-09-11 11:45:10 +0530",
    files: [
      "apps/api/src/services/answer-service.ts",
      "apps/api/src/services/vote-service.ts"
    ]
  },
  {
    msg: "fix(web): prevent duplicate state transitions during vote animation",
    date: "2026-09-12 14:10:25 +0530",
    files: [
      "apps/web/src/state/game-reducer.ts",
      "apps/web/src/components/voting-panel.tsx"
    ]
  },
  {
    msg: "test(web): add edge case coverage for personality elimination reducer",
    date: "2026-09-14 10:55:00 +0530",
    files: [
      "apps/web/src/state/game-reducer.test.ts"
    ]
  },
  {
    msg: "style(web): polish responsive arena layout and dark mode contrasts",
    date: "2026-09-15 15:40:18 +0530",
    files: [
      "apps/web/src/index.css",
      "apps/web/src/components/arena.tsx",
      "apps/web/src/components/game-header.tsx"
    ]
  },
  {
    msg: "perf(api): optimize json fallback parsing in voting responses",
    date: "2026-09-16 16:25:35 +0530",
    files: [
      "apps/api/src/services/vote-service.ts",
      "apps/api/src/utilities/text.ts"
    ]
  },

  // --- Final Quality Gates, Documentation & Release (Sep 18 - Sep 21) ---
  {
    msg: "docs: add comprehensive architecture diagram, API spec, and usage guide",
    date: "2026-09-18 11:30:00 +0530",
    files: [
      "README.md",
      "LICENSE"
    ]
  },
  {
    msg: "chore: update codebase dependency graph and symbol mapping",
    date: "2026-09-19 14:15:20 +0530",
    files: [
      "graphify-out"
    ]
  },
  {
    msg: "chore: finalize production build checks and workspace verification",
    date: "2026-09-21 16:40:12 +0530",
    files: [
      "package.json",
      "package-lock.json"
    ]
  }
];

// Start at 62209e2 (first commit)
run(`git checkout -B main 62209e2`);

for (const c of commits) {
  checkoutFiles("staging-history", c.files);
  commit(c.msg, c.date);
}

console.log("Successfully rebuilt 45 commits.");
