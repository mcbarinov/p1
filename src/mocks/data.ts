import type { Forum, Post, User, Comment } from "@/types"

// Generate stable UUIDs for testing
const generateId = (seed: string) => {
  // Create a pseudo-UUID based on seed for consistent data
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const uuid = `${hash.toString(16).padStart(8, "0")}-${hash.toString(16).padStart(4, "0")}-4${hash.toString(16).padStart(3, "0")}-${((hash & 0x3f) | 0x80).toString(16).padStart(4, "0")}-${hash.toString(16).padStart(12, "0")}`
  return uuid
}

// Mock user database
export const mockUsers: (User & { password: string })[] = [
  { id: generateId("admin"), username: "admin", password: "admin", role: "admin" },
  { id: generateId("user1"), username: "user1", password: "user1", role: "user" },
  { id: generateId("alice"), username: "alice", password: "alice", role: "user" },
  { id: generateId("bob"), username: "bob", password: "bob", role: "user" },
]

// Mock forums database
export const mockForums: Forum[] = [
  // Technology forums
  {
    id: generateId("tech-web"),
    slug: "web-development",
    title: "Web Development",
    description: "Discuss modern web technologies, frameworks, and best practices",
    category: "Technology",
  },
  {
    id: generateId("tech-ai"),
    slug: "artificial-intelligence",
    title: "Artificial Intelligence & ML",
    description: "Machine learning, neural networks, and AI applications",
    category: "Technology",
  },
  {
    id: generateId("tech-mobile"),
    slug: "mobile-development",
    title: "Mobile Development",
    description: "iOS, Android, and cross-platform mobile app development",
    category: "Technology",
  },

  // Science forums
  {
    id: generateId("sci-physics"),
    slug: "physics",
    title: "Physics & Astronomy",
    description: "From quantum mechanics to cosmology",
    category: "Science",
  },
  {
    id: generateId("sci-bio"),
    slug: "biology",
    title: "Biology & Life Sciences",
    description: "Genetics, ecology, evolution, and more",
    category: "Science",
  },
  {
    id: generateId("sci-chem"),
    slug: "chemistry",
    title: "Chemistry",
    description: "Organic, inorganic, and physical chemistry discussions",
    category: "Science",
  },

  // Art forums
  {
    id: generateId("art-digital"),
    slug: "digital-art",
    title: "Digital Art & Design",
    description: "Digital illustration, 3D modeling, and graphic design",
    category: "Art",
  },
  {
    id: generateId("art-trad"),
    slug: "traditional-art",
    title: "Traditional Art",
    description: "Painting, drawing, sculpture, and classical techniques",
    category: "Art",
  },
  {
    id: generateId("art-photo"),
    slug: "photography",
    title: "Photography",
    description: "Camera techniques, composition, and photo editing",
    category: "Art",
  },
]

// Helper function to generate dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Mock posts database
export const mockPosts: Post[] = (() => {
  const webForumId = generateId("tech-web")
  const users = [generateId("admin"), generateId("user1"), generateId("alice"), generateId("bob")]

  const topics = [
    {
      title: "Building a REST API with Node.js",
      content:
        "Learn how to create a robust RESTful API using Node.js and Express. We'll cover routing, middleware, error handling, and best practices for structuring your API endpoints. Authentication with JWT tokens and database integration with MongoDB will also be explored.",
      tags: ["nodejs", "api", "backend", "rest"],
    },
    {
      title: "React Hooks Best Practices",
      content:
        "Master the art of using React Hooks effectively. From useState and useEffect to custom hooks, learn patterns that make your components cleaner and more maintainable. We'll explore common pitfalls and how to avoid them in production applications.",
      tags: ["react", "hooks", "frontend", "javascript"],
    },
    {
      title: "Understanding TypeScript Generics",
      content:
        "TypeScript generics provide powerful ways to create reusable components. This guide covers generic functions, interfaces, and classes. Learn how to leverage generics for type-safe code that's flexible and maintainable.",
      tags: ["typescript", "generics", "types", "javascript"],
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Each",
      content:
        "Both CSS Grid and Flexbox are powerful layout tools, but knowing when to use each is crucial. Grid excels at two-dimensional layouts while Flexbox shines in one-dimensional contexts. We'll explore real-world examples and best practices.",
      tags: ["css", "grid", "flexbox", "layout"],
    },
    {
      title: "Optimizing Web Performance",
      content:
        "Web performance directly impacts user experience and SEO. Learn techniques for optimizing load times, including lazy loading, code splitting, image optimization, and caching strategies. We'll measure performance using Core Web Vitals.",
      tags: ["performance", "optimization", "web", "metrics"],
    },
    {
      title: "Introduction to Docker for Web Developers",
      content:
        "Docker simplifies deployment and ensures consistency across environments. This introduction covers containers, images, Dockerfile basics, and Docker Compose for multi-container applications. Perfect for developers new to containerization.",
      tags: ["docker", "devops", "containers", "deployment"],
    },
    {
      title: "Testing JavaScript with Jest",
      content:
        "Comprehensive testing ensures code reliability. Jest provides a complete testing solution with built-in assertions, mocking, and coverage reports. Learn to write unit tests, integration tests, and snapshot tests for your JavaScript applications.",
      tags: ["testing", "jest", "javascript", "tdd"],
    },
    {
      title: "GraphQL Fundamentals",
      content:
        "GraphQL offers a flexible alternative to REST APIs. Learn about schemas, resolvers, queries, and mutations. We'll build a simple GraphQL server and explore how it improves data fetching efficiency in modern applications.",
      tags: ["graphql", "api", "backend", "query"],
    },
    {
      title: "Modern Authentication Strategies",
      content:
        "Security is paramount in web applications. Explore authentication methods including JWT, OAuth 2.0, and session-based auth. Learn about refresh tokens, CSRF protection, and implementing secure authentication flows.",
      tags: ["authentication", "security", "jwt", "oauth"],
    },
    {
      title: "Database Design Patterns",
      content:
        "Good database design is crucial for scalable applications. We'll cover normalization, indexing strategies, and common patterns like soft deletes and audit trails. Examples include both SQL and NoSQL approaches.",
      tags: ["database", "sql", "design", "patterns"],
    },
    {
      title: "Vue 3 Composition API",
      content:
        "Vue 3's Composition API offers a new way to organize component logic. Learn how to use reactive refs, computed properties, and lifecycle hooks in the composition style. We'll refactor components to show the benefits.",
      tags: ["vue", "composition-api", "frontend", "javascript"],
    },
    {
      title: "Webpack Configuration Deep Dive",
      content:
        "Webpack powers many modern build processes. This deep dive covers loaders, plugins, code splitting, and optimization techniques. Learn to configure Webpack for development and production environments.",
      tags: ["webpack", "bundling", "build", "javascript"],
    },
    {
      title: "Responsive Design Principles",
      content:
        "Creating websites that work on all devices is essential. Master responsive design using fluid grids, flexible images, and media queries. We'll explore mobile-first design and modern CSS features like container queries.",
      tags: ["responsive", "css", "mobile", "design"],
    },
    {
      title: "Server-Side Rendering with Next.js",
      content:
        "Next.js makes server-side rendering easy. Learn about static generation, server-side rendering, and incremental static regeneration. We'll build a performant blog that scores perfectly on Core Web Vitals.",
      tags: ["nextjs", "ssr", "react", "performance"],
    },
    {
      title: "WebSocket Real-Time Communication",
      content:
        "WebSockets enable real-time bidirectional communication. Build chat applications, live notifications, and collaborative features. We'll cover Socket.io for easier implementation and scaling considerations.",
      tags: ["websocket", "realtime", "socketio", "communication"],
    },
    {
      title: "Progressive Web Apps (PWAs)",
      content:
        "PWAs combine the best of web and mobile apps. Learn about service workers, web app manifests, and offline functionality. We'll build a PWA that works offline and can be installed like a native app.",
      tags: ["pwa", "serviceworker", "offline", "mobile"],
    },
    {
      title: "CI/CD Pipeline Setup",
      content:
        "Automate your deployment process with CI/CD. We'll set up pipelines using GitHub Actions, including automated testing, building, and deployment. Learn best practices for maintaining reliable deployment workflows.",
      tags: ["cicd", "automation", "deployment", "devops"],
    },
    {
      title: "Microservices Architecture",
      content:
        "Microservices offer scalability and flexibility. Learn about service discovery, API gateways, and inter-service communication. We'll discuss when to use microservices and common pitfalls to avoid.",
      tags: ["microservices", "architecture", "scalability", "backend"],
    },
    {
      title: "State Management with Redux Toolkit",
      content:
        "Redux Toolkit simplifies Redux usage. Learn about slices, thunks, and RTK Query for data fetching. We'll build a complex application state management solution that's maintainable and performant.",
      tags: ["redux", "state", "react", "toolkit"],
    },
    {
      title: "Web Accessibility (a11y) Guidelines",
      content:
        "Building accessible websites is both ethical and often legally required. Learn WCAG guidelines, ARIA attributes, and testing tools. We'll make a website fully accessible while maintaining great design.",
      tags: ["accessibility", "a11y", "wcag", "inclusive"],
    },
    {
      title: "Kubernetes for Developers",
      content:
        "Kubernetes orchestrates containerized applications. Learn about pods, services, deployments, and ingress. We'll deploy a web application to Kubernetes and explore scaling and rolling updates.",
      tags: ["kubernetes", "k8s", "containers", "orchestration"],
    },
    {
      title: "Svelte: The Compile-Time Framework",
      content:
        "Svelte compiles components to vanilla JavaScript. Explore reactive declarations, stores, and animations. We'll build a performant app that ships minimal JavaScript to the browser.",
      tags: ["svelte", "framework", "frontend", "compiler"],
    },
    {
      title: "API Rate Limiting Strategies",
      content:
        "Protect your API from abuse with rate limiting. Learn about token bucket, sliding window, and distributed rate limiting algorithms. Implementation examples using Redis and middleware.",
      tags: ["api", "ratelimit", "security", "backend"],
    },
    {
      title: "CSS-in-JS Solutions Compared",
      content:
        "CSS-in-JS offers component-scoped styling. Compare styled-components, Emotion, and CSS Modules. We'll explore performance implications and when each solution makes sense.",
      tags: ["css", "styled-components", "emotion", "styling"],
    },
    {
      title: "Error Handling Best Practices",
      content:
        "Robust error handling improves user experience. Learn about try-catch patterns, error boundaries in React, and centralized error logging. We'll implement comprehensive error handling strategies.",
      tags: ["errors", "exception", "debugging", "bestpractices"],
    },
    {
      title: "Web Security Fundamentals",
      content:
        "Security vulnerabilities can destroy user trust. Learn about XSS, CSRF, SQL injection, and how to prevent them. We'll implement security headers and Content Security Policy.",
      tags: ["security", "xss", "csrf", "vulnerabilities"],
    },
    {
      title: "Monorepo Management with Lerna",
      content:
        "Monorepos simplify code sharing. Learn to manage multiple packages with Lerna, including versioning, publishing, and dependency management. We'll structure a monorepo for maximum efficiency.",
      tags: ["monorepo", "lerna", "packages", "management"],
    },
    {
      title: "Browser DevTools Mastery",
      content:
        "DevTools are essential for debugging. Master the Network tab, Performance profiler, and Memory analyzer. Learn lesser-known features that speed up development and debugging.",
      tags: ["devtools", "debugging", "browser", "performance"],
    },
    {
      title: "Jamstack Architecture",
      content:
        "Jamstack offers better performance and security. Learn about static site generators, headless CMS options, and serverless functions. We'll build a Jamstack site with dynamic features.",
      tags: ["jamstack", "static", "serverless", "architecture"],
    },
    {
      title: "WebAssembly Introduction",
      content:
        "WebAssembly brings near-native performance to the web. Learn how to compile C++ and Rust to WebAssembly. We'll explore use cases where WebAssembly shines.",
      tags: ["webassembly", "wasm", "performance", "native"],
    },
  ]

  const posts: Post[] = []

  // Generate 120 posts
  for (let i = 1; i <= 120; i++) {
    const topicIndex = (i - 1) % topics.length
    const topic = topics[topicIndex]
    const variation = Math.floor((i - 1) / topics.length)

    // Add variation to title if we're cycling through topics again
    const title = variation > 0 ? `${topic.title} - Part ${String(variation + 1)}` : topic.title

    // Add variation to content
    const content =
      variation > 0
        ? `${topic.content} In this part ${String(variation + 1)}, we dive deeper into advanced concepts and real-world applications.`
        : topic.content

    posts.push({
      id: generateId(`post-${String(i)}`),
      forumId: webForumId,
      number: i,
      title: title,
      content: content,
      tags: topic.tags,
      authorId: users[i % users.length],
      createdAt: daysAgo(60 - Math.floor(i / 2)),
      updatedAt: Math.random() > 0.7 ? daysAgo(60 - Math.floor(i / 2) - 1) : null,
    })
  }

  return posts
})()

// Mock comments database
export const mockComments: Comment[] = [
  // Comments for React 19 post
  {
    id: generateId("comment-1"),
    postId: generateId("post-1"),
    content:
      "The server components integration is a game-changer! We've already migrated our dashboard and seen 40% improvement in initial load time.",
    authorId: generateId("bob"),
    createdAt: daysAgo(0.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-2"),
    postId: generateId("post-1"),
    content: "How does this compare to Next.js App Router? Are they using similar approaches?",
    authorId: generateId("user1"),
    createdAt: daysAgo(0.8),
    updatedAt: null,
  },

  // Comments for Tailwind v4 post
  {
    id: generateId("comment-3"),
    postId: generateId("post-2"),
    content: "The Rust rewrite is impressive. Build times went from 3 seconds to 300ms in our monorepo!",
    authorId: generateId("alice"),
    createdAt: daysAgo(2.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-4"),
    postId: generateId("post-2"),
    content: "Cascade layers finally solve the specificity wars with third-party CSS. This alone makes the upgrade worth it.",
    authorId: generateId("admin"),
    createdAt: daysAgo(2.7),
    updatedAt: null,
  },

  // Comments for TypeScript API post
  {
    id: generateId("comment-5"),
    postId: generateId("post-3"),
    content: "Zod has completely changed how we handle API validation. The TypeScript inference is magical.",
    authorId: generateId("alice"),
    createdAt: daysAgo(4.2),
    updatedAt: null,
  },
  {
    id: generateId("comment-6"),
    postId: generateId("post-3"),
    content: "How does Zod performance compare to alternatives like Yup or Joi for large schemas?",
    authorId: generateId("user1"),
    createdAt: daysAgo(4.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-7"),
    postId: generateId("post-3"),
    content: "We use tRPC with Zod for end-to-end type safety. It's like having a typed contract between frontend and backend.",
    authorId: generateId("admin"),
    createdAt: daysAgo(4.8),
    updatedAt: null,
  },

  // Comments for Transformer Architecture post
  {
    id: generateId("comment-8"),
    postId: generateId("post-4"),
    content: "Great explanation! The visualization of attention weights really helps understand the concept.",
    authorId: generateId("bob"),
    createdAt: daysAgo(1.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-9"),
    postId: generateId("post-4"),
    content: "Could you elaborate on the difference between self-attention and cross-attention in the decoder?",
    authorId: generateId("user1"),
    createdAt: daysAgo(1.7),
    updatedAt: null,
  },

  // Comments for LLM Fine-tuning post
  {
    id: generateId("comment-10"),
    postId: generateId("post-5"),
    content: "QLoRA is incredible for fine-tuning on consumer GPUs. We fine-tuned Llama 2 7B on a single RTX 4090!",
    authorId: generateId("alice"),
    createdAt: daysAgo(3.3),
    updatedAt: null,
  },
  {
    id: generateId("comment-11"),
    postId: generateId("post-5"),
    content: "What's your recommended dataset size for domain-specific fine-tuning? We have about 10k examples.",
    authorId: generateId("bob"),
    createdAt: daysAgo(3.6),
    updatedAt: null,
  },

  // Comments for SwiftUI vs UIKit post
  {
    id: generateId("comment-12"),
    postId: generateId("post-6"),
    content:
      "SwiftUI is great until you need that one specific customization that's trivial in UIKit but requires workarounds in SwiftUI.",
    authorId: generateId("alice"),
    createdAt: daysAgo(6.4),
    updatedAt: null,
  },
  {
    id: generateId("comment-13"),
    postId: generateId("post-6"),
    content: "The SwiftUI preview feature alone saves hours of development time. No more constant rebuilding!",
    authorId: generateId("user1"),
    createdAt: daysAgo(6.7),
    updatedAt: null,
  },

  // Comments for Quantum Entanglement post
  {
    id: generateId("comment-14"),
    postId: generateId("post-8"),
    content: "The 'spooky action at a distance' finally makes sense! The shared state explanation is brilliant.",
    authorId: generateId("bob"),
    createdAt: daysAgo(7.3),
    updatedAt: null,
  },
  {
    id: generateId("comment-15"),
    postId: generateId("post-8"),
    content: "How does decoherence affect entangled states in real-world quantum computing applications?",
    authorId: generateId("user1"),
    createdAt: daysAgo(7.6),
    updatedAt: null,
  },

  // Comments for CRISPR post
  {
    id: generateId("comment-16"),
    postId: generateId("post-10"),
    content: "The precision of prime editing is remarkable. We're using it for correcting point mutations with 90%+ efficiency.",
    authorId: generateId("alice"),
    createdAt: daysAgo(10.4),
    updatedAt: null,
  },
  {
    id: generateId("comment-17"),
    postId: generateId("post-10"),
    content: "What are the main ethical concerns you see with germline editing versus somatic cell editing?",
    authorId: generateId("admin"),
    createdAt: daysAgo(10.7),
    updatedAt: null,
  },

  // Comments for AI Art post
  {
    id: generateId("comment-18"),
    postId: generateId("post-13"),
    content: "As a professional artist, I see AI as a tool like any other. It's how you use it that matters.",
    authorId: generateId("alice"),
    createdAt: daysAgo(14.3),
    updatedAt: null,
  },
  {
    id: generateId("comment-19"),
    postId: generateId("post-13"),
    content: "The copyright issues are complex. If AI trains on copyrighted work, who owns the output?",
    authorId: generateId("bob"),
    createdAt: daysAgo(14.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-20"),
    postId: generateId("post-13"),
    content: "I use AI for initial concepts, then refine manually. It's accelerated my workflow tremendously.",
    authorId: generateId("user1"),
    createdAt: daysAgo(14.8),
    updatedAt: null,
  },

  // Comments for Blender 4.0 post
  {
    id: generateId("comment-21"),
    postId: generateId("post-14"),
    content: "Geometry nodes are absolutely mind-blowing. I've replaced so many manual modeling tasks with procedural setups.",
    authorId: generateId("alice"),
    createdAt: daysAgo(12.4),
    updatedAt: null,
  },
  {
    id: generateId("comment-22"),
    postId: generateId("post-14"),
    content: "The fact that Blender is free and competes with software costing thousands is incredible.",
    authorId: generateId("admin"),
    createdAt: daysAgo(12.7),
    updatedAt: null,
  },

  // Comments for Street Photography post
  {
    id: generateId("comment-23"),
    postId: generateId("post-17"),
    content: "The ethics discussion is crucial. I always ask myself: would I be comfortable if someone took this photo of me?",
    authorId: generateId("bob"),
    createdAt: daysAgo(17.4),
    updatedAt: null,
  },
  {
    id: generateId("comment-24"),
    postId: generateId("post-17"),
    content: "Zone focusing changed my street photography game. No more missed moments while hunting for focus!",
    authorId: generateId("user1"),
    createdAt: daysAgo(17.6),
    updatedAt: null,
  },

  // Comments for Astrophotography post
  {
    id: generateId("comment-25"),
    postId: generateId("post-18"),
    content: "Can confirm! Got stunning Milky Way shots with just a Canon T3i and kit lens. Light pollution is the real enemy.",
    authorId: generateId("alice"),
    createdAt: daysAgo(19.3),
    updatedAt: null,
  },
  {
    id: generateId("comment-26"),
    postId: generateId("post-18"),
    content:
      "DeepSkyStacker is amazing for free software. The difference between single shot and 20 stacked images is night and day.",
    authorId: generateId("admin"),
    createdAt: daysAgo(19.5),
    updatedAt: null,
  },
  {
    id: generateId("comment-27"),
    postId: generateId("post-18"),
    content: "Don't forget about the moon! It's bright enough that you don't need long exposures or high ISO.",
    authorId: generateId("user1"),
    createdAt: daysAgo(19.7),
    updatedAt: null,
  },
]

// In-memory session storage
export const mockSessions = new Map<string, User>()
