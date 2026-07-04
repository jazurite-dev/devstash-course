// Mock data source for the dashboard UI. Replace with real DB queries once Prisma/Neon is wired up.

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  slug: string; // used in /items/[slug]
  icon: string; // Lucide icon name
  color: string; // hex
  isSystem: boolean;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string; // hex, used for card border
  isFavorite: boolean;
  itemCount: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  typeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string; // ISO date
}

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: null,  
  isPro: false,
};

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "Snippets", slug: "snippets", icon: "Code", color: "#3b82f6", isSystem: true, itemCount: 24 },
  { id: "type-prompt", name: "Prompts", slug: "prompts", icon: "Sparkles", color: "#8b5cf6", isSystem: true, itemCount: 18 },
  { id: "type-command", name: "Commands", slug: "commands", icon: "Terminal", color: "#f97316", isSystem: true, itemCount: 15 },
  { id: "type-note", name: "Notes", slug: "notes", icon: "StickyNote", color: "#fde047", isSystem: true, itemCount: 12 },
  { id: "type-file", name: "Files", slug: "files", icon: "File", color: "#6b7280", isSystem: true, itemCount: 5 },
  { id: "type-image", name: "Images", slug: "images", icon: "Image", color: "#ec4899", isSystem: true, itemCount: 3 },
  { id: "type-link", name: "Links", slug: "links", icon: "Link", color: "#10b981", isSystem: true, itemCount: 8 },
];

export const collections: Collection[] = [
  { id: "col-react-patterns", name: "React Patterns", description: "Common React patterns and hooks", color: "#3b82f6", isFavorite: true, itemCount: 12 },
  { id: "col-python-snippets", name: "Python Snippets", description: "Useful Python code snippets", color: "#3b82f6", isFavorite: false, itemCount: 8 },
  { id: "col-context-files", name: "Context Files", description: "AI context files for projects", color: "#6b7280", isFavorite: true, itemCount: 5 },
  { id: "col-interview-prep", name: "Interview Prep", description: "Technical interview preparation", color: "#fde047", isFavorite: false, itemCount: 24 },
  { id: "col-git-commands", name: "Git Commands", description: "Frequently used git commands", color: "#f97316", isFavorite: true, itemCount: 15 },
  { id: "col-ai-prompts", name: "AI Prompts", description: "Curated AI prompts for coding", color: "#8b5cf6", isFavorite: false, itemCount: 18 },
];

export const items: Item[] = [
  {
    id: "item-use-auth-hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "type-snippet",
    collectionIds: ["col-react-patterns"],
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-01-15",
  },
  {
    id: "item-api-error-handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "type-snippet",
    collectionIds: ["col-react-patterns", "col-interview-prep"],
    tags: ["fetch", "error-handling", "retry"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-01-12",
  },
  {
    id: "item-git-rebase-cheatsheet",
    title: "Git Rebase Cheatsheet",
    description: "Common interactive rebase commands and flags",
    typeId: "type-command",
    collectionIds: ["col-git-commands"],
    tags: ["git", "rebase"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-10",
  },
  {
    id: "item-python-decorator-timer",
    title: "Timing Decorator",
    description: "Decorator that logs function execution time",
    typeId: "type-snippet",
    collectionIds: ["col-python-snippets"],
    tags: ["python", "decorators"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-08",
  },
  {
    id: "item-explain-code-prompt",
    title: "Explain This Code",
    description: "Prompt template for getting a plain-English code explanation",
    typeId: "type-prompt",
    collectionIds: ["col-ai-prompts"],
    tags: ["ai", "explanation"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-06",
  },
  {
    id: "item-project-context-template",
    title: "Project Context Template",
    description: "Boilerplate context file for onboarding an AI assistant to a repo",
    typeId: "type-note",
    collectionIds: ["col-context-files"],
    tags: ["ai", "context", "onboarding"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-04",
  },
  {
    id: "item-system-design-questions",
    title: "System Design Questions",
    description: "List of common system design interview questions",
    typeId: "type-note",
    collectionIds: ["col-interview-prep"],
    tags: ["interview", "system-design"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-02",
  },
  {
    id: "item-react-docs-link",
    title: "React Docs - Hooks Reference",
    description: "Official React documentation for built-in hooks",
    typeId: "type-link",
    collectionIds: ["col-react-patterns"],
    tags: ["react", "docs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2025-12-30",
  },
];
