import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── User ──────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // Clear previous demo user content so the seed is re-runnable.
  // Items must be cleared before ItemTypes due to RESTRICT on Item_typeId_fkey.
  await prisma.itemCollection.deleteMany({ where: { item: { userId: user.id } } });
  await prisma.itemTag.deleteMany({ where: { item: { userId: user.id } } });
  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.tag.deleteMany({ where: { userId: user.id } });

  // ── System item types ─────────────────────────────────────────────────────
  await prisma.itemType.deleteMany({ where: { isSystem: true } });

  const [snippet, prompt, command, , , , link] = await Promise.all([
    prisma.itemType.create({ data: { name: "snippet", icon: "Code",       color: "#3b82f6", isSystem: true } }),
    prisma.itemType.create({ data: { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6", isSystem: true } }),
    prisma.itemType.create({ data: { name: "command", icon: "Terminal",   color: "#f97316", isSystem: true } }),
    prisma.itemType.create({ data: { name: "note",    icon: "StickyNote", color: "#fde047", isSystem: true } }),
    prisma.itemType.create({ data: { name: "file",    icon: "File",       color: "#6b7280", isSystem: true } }),
    prisma.itemType.create({ data: { name: "image",   icon: "Image",      color: "#ec4899", isSystem: true } }),
    prisma.itemType.create({ data: { name: "link",    icon: "Link",       color: "#10b981", isSystem: true } }),
  ]);

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tags = await Promise.all(
    ["react", "typescript", "hooks", "ai", "devops", "docker", "git", "css"].map((name) =>
      prisma.tag.create({ data: { name, userId: user.id } })
    )
  );
  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]));

  async function addToCollection(itemId: string, collectionId: string) {
    await prisma.itemCollection.create({ data: { itemId, collectionId } });
  }

  // ── React Patterns ────────────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.create({
    data: { name: "React Patterns", description: "Reusable React patterns and hooks", userId: user.id },
  });

  const useDebounce = await prisma.item.create({
    data: {
      title: "useDebounce hook",
      contentType: "text",
      language: "typescript",
      userId: user.id,
      typeId: snippet.id,
      content: `import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;`,
    },
  });
  await addToCollection(useDebounce.id, reactPatterns.id);
  await prisma.itemTag.createMany({
    data: [
      { itemId: useDebounce.id, tagId: tagMap.react.id },
      { itemId: useDebounce.id, tagId: tagMap.hooks.id },
      { itemId: useDebounce.id, tagId: tagMap.typescript.id },
    ],
  });

  const contextReducer = await prisma.item.create({
    data: {
      title: "Context + useReducer pattern",
      contentType: "text",
      language: "typescript",
      userId: user.id,
      typeId: snippet.id,
      content: `import { createContext, useContext, useReducer, Dispatch, Reducer, ReactNode } from "react";

function createContextReducer<S, A>(reducer: Reducer<S, A>, initialState: S) {
  const Context = createContext<[S, Dispatch<A>] | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    return (
      <Context.Provider value={useReducer(reducer, initialState)}>
        {children}
      </Context.Provider>
    );
  }

  function useCtx() {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Must be used within Provider");
    return ctx;
  }

  return { Provider, useCtx };
}

export default createContextReducer;`,
    },
  });
  await addToCollection(contextReducer.id, reactPatterns.id);
  await prisma.itemTag.createMany({
    data: [
      { itemId: contextReducer.id, tagId: tagMap.react.id },
      { itemId: contextReducer.id, tagId: tagMap.typescript.id },
    ],
  });

  const fetchUtil = await prisma.item.create({
    data: {
      title: "Generic typed fetch utility",
      contentType: "text",
      language: "typescript",
      userId: user.id,
      typeId: snippet.id,
      content: `async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }

  return res.json() as Promise<T>;
}

export default fetchJson;`,
    },
  });
  await addToCollection(fetchUtil.id, reactPatterns.id);
  await prisma.itemTag.createMany({
    data: [
      { itemId: fetchUtil.id, tagId: tagMap.react.id },
      { itemId: fetchUtil.id, tagId: tagMap.typescript.id },
    ],
  });

  // ── AI Workflows ──────────────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.create({
    data: { name: "AI Workflows", description: "AI prompts and workflow automations", userId: user.id },
  });

  const codeReviewPrompt = await prisma.item.create({
    data: {
      title: "Code review prompt",
      contentType: "text",
      userId: user.id,
      typeId: prompt.id,
      content: `You are an expert code reviewer. Review the following code and provide feedback on:

1. **Correctness** — Are there any bugs or logic errors?
2. **Security** — Any vulnerabilities (XSS, SQL injection, auth bypass)?
3. **Performance** — Unnecessary re-renders, N+1 queries, slow operations?
4. **Readability** — Is the code clear and self-documenting?
5. **Best practices** — Does it follow conventions for the language/framework?

Be specific with file:line references. Categorize findings as Critical, Important, or Minor.

\`\`\`
[paste code here]
\`\`\``,
    },
  });
  await addToCollection(codeReviewPrompt.id, aiWorkflows.id);
  await prisma.itemTag.create({ data: { itemId: codeReviewPrompt.id, tagId: tagMap.ai.id } });

  const docsPrompt = await prisma.item.create({
    data: {
      title: "Documentation generation",
      contentType: "text",
      userId: user.id,
      typeId: prompt.id,
      content: `Generate comprehensive documentation for the following code. Include:

- **Purpose** — What this does and why it exists
- **Parameters** — Each parameter with type and description
- **Return value** — What is returned and when
- **Throws** — Any errors that can be thrown
- **Example** — A realistic usage example

Output as JSDoc/TSDoc comments ready to place directly above the function.

\`\`\`
[paste code here]
\`\`\``,
    },
  });
  await addToCollection(docsPrompt.id, aiWorkflows.id);
  await prisma.itemTag.create({ data: { itemId: docsPrompt.id, tagId: tagMap.ai.id } });

  const refactorPrompt = await prisma.item.create({
    data: {
      title: "Refactoring assistant",
      contentType: "text",
      userId: user.id,
      typeId: prompt.id,
      content: `Refactor the following code to improve quality without changing behavior. Focus on:

- Reducing duplication (DRY)
- Removing unnecessary complexity (YAGNI)
- Improving naming and readability
- Extracting reusable functions or components
- Applying relevant design patterns

Show the refactored version and briefly explain each change made.

\`\`\`
[paste code here]
\`\`\``,
    },
  });
  await addToCollection(refactorPrompt.id, aiWorkflows.id);
  await prisma.itemTag.create({ data: { itemId: refactorPrompt.id, tagId: tagMap.ai.id } });

  // ── DevOps ────────────────────────────────────────────────────────────────
  const devops = await prisma.collection.create({
    data: { name: "DevOps", description: "Infrastructure and deployment resources", userId: user.id },
  });

  const dockerCompose = await prisma.item.create({
    data: {
      title: "Docker Compose — Next.js + PostgreSQL",
      contentType: "text",
      language: "yaml",
      userId: user.id,
      typeId: snippet.id,
      content: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`,
    },
  });
  await addToCollection(dockerCompose.id, devops.id);
  await prisma.itemTag.createMany({
    data: [
      { itemId: dockerCompose.id, tagId: tagMap.docker.id },
      { itemId: dockerCompose.id, tagId: tagMap.devops.id },
    ],
  });

  const vercelDeploy = await prisma.item.create({
    data: {
      title: "Deploy to Vercel",
      contentType: "text",
      userId: user.id,
      typeId: command.id,
      content: `# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set an environment variable
vercel env add DATABASE_URL production`,
    },
  });
  await addToCollection(vercelDeploy.id, devops.id);
  await prisma.itemTag.create({ data: { itemId: vercelDeploy.id, tagId: tagMap.devops.id } });

  const vercelDocsLink = await prisma.item.create({
    data: {
      title: "Vercel Documentation",
      contentType: "url",
      url: "https://vercel.com/docs",
      userId: user.id,
      typeId: link.id,
    },
  });
  await addToCollection(vercelDocsLink.id, devops.id);

  const githubActionsLink = await prisma.item.create({
    data: {
      title: "GitHub Actions Documentation",
      contentType: "url",
      url: "https://docs.github.com/en/actions",
      userId: user.id,
      typeId: link.id,
    },
  });
  await addToCollection(githubActionsLink.id, devops.id);
  await prisma.itemTag.create({ data: { itemId: githubActionsLink.id, tagId: tagMap.devops.id } });

  // ── Terminal Commands ─────────────────────────────────────────────────────
  const terminalCommands = await prisma.collection.create({
    data: { name: "Terminal Commands", description: "Useful shell commands for everyday development", userId: user.id },
  });

  const gitStash = await prisma.item.create({
    data: {
      title: "Git stash operations",
      contentType: "text",
      userId: user.id,
      typeId: command.id,
      content: `# Save changes including untracked files
git stash push -u -m "description"

# List all stashes
git stash list

# Apply most recent stash and remove it
git stash pop

# Apply specific stash without removing it
git stash apply stash@{2}

# Drop a specific stash
git stash drop stash@{0}`,
    },
  });
  await addToCollection(gitStash.id, terminalCommands.id);
  await prisma.itemTag.create({ data: { itemId: gitStash.id, tagId: tagMap.git.id } });

  const dockerCleanup = await prisma.item.create({
    data: {
      title: "Docker cleanup commands",
      contentType: "text",
      userId: user.id,
      typeId: command.id,
      content: `# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Full system cleanup
docker system prune -a --volumes -f

# Stop all running containers
docker stop $(docker ps -q)`,
    },
  });
  await addToCollection(dockerCleanup.id, terminalCommands.id);
  await prisma.itemTag.create({ data: { itemId: dockerCleanup.id, tagId: tagMap.docker.id } });

  const killPort = await prisma.item.create({
    data: {
      title: "Kill process on port",
      contentType: "text",
      userId: user.id,
      typeId: command.id,
      content: `# macOS / Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Cross-platform via npx
npx kill-port 3000`,
    },
  });
  await addToCollection(killPort.id, terminalCommands.id);

  const cacheClean = await prisma.item.create({
    data: {
      title: "Package manager cache clean",
      contentType: "text",
      userId: user.id,
      typeId: command.id,
      content: `# npm
npm cache clean --force

# pnpm
pnpm store prune

# Bun
bun pm cache rm

# Clear Next.js build cache
rm -rf .next

# Nuke node_modules and reinstall
rm -rf node_modules && npm install`,
    },
  });
  await addToCollection(cacheClean.id, terminalCommands.id);

  // ── Design Resources ──────────────────────────────────────────────────────
  const designResources = await prisma.collection.create({
    data: { name: "Design Resources", description: "UI/UX resources and references", userId: user.id },
  });

  const designLinks = [
    { title: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs" },
    { title: "shadcn/ui Components",       url: "https://ui.shadcn.com" },
    { title: "Radix UI Primitives",        url: "https://www.radix-ui.com" },
    { title: "Lucide Icons",               url: "https://lucide.dev/icons" },
  ];

  for (const { title, url } of designLinks) {
    const item = await prisma.item.create({
      data: { title, contentType: "url", url, userId: user.id, typeId: link.id },
    });
    await addToCollection(item.id, designResources.id);
    await prisma.itemTag.create({ data: { itemId: item.id, tagId: tagMap.css.id } });
  }

  console.log("Seeded: 1 user, 7 item types, 5 collections, items and tags");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
