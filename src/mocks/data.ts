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
export const mockPosts: Post[] = [
  // Web Development posts
  {
    id: generateId("post-1"),
    forumId: generateId("tech-web"),
    number: 1,
    title: "React 19: What's New and Exciting",
    content:
      "React 19 brings significant improvements to performance and developer experience. The new compiler optimizations reduce bundle sizes by up to 30%, while the enhanced Suspense boundaries make data fetching more intuitive. Server components are now production-ready, offering seamless integration between client and server code.",
    tags: ["react", "javascript", "frontend", "web"],
    authorId: generateId("alice"),
    createdAt: daysAgo(1),
    updatedAt: null,
  },
  {
    id: generateId("post-2"),
    forumId: generateId("tech-web"),
    number: 2,
    title: "Tailwind CSS v4: A Game Changer",
    content:
      "Tailwind CSS v4 introduces a revolutionary new engine that's 10x faster than v3. The new oxide engine is written in Rust and brings lightning-fast builds. Native CSS cascade layers support means better integration with existing stylesheets. The new variant system is more flexible and powerful than ever.",
    tags: ["css", "tailwind", "design", "frontend"],
    authorId: generateId("user1"),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    id: generateId("post-3"),
    forumId: generateId("tech-web"),
    number: 3,
    title: "Building Type-Safe APIs with TypeScript and Zod",
    content:
      "Learn how to create fully type-safe APIs using TypeScript and Zod. This approach ensures runtime validation matches compile-time types, eliminating the gap between what TypeScript thinks your data looks like and what it actually is. We'll cover schema definition, validation, and automatic type inference.",
    tags: ["typescript", "api", "validation", "backend"],
    authorId: generateId("bob"),
    createdAt: daysAgo(5),
    updatedAt: null,
  },

  // AI & ML posts
  {
    id: generateId("post-4"),
    forumId: generateId("tech-ai"),
    number: 1,
    title: "Understanding Transformer Architecture",
    content:
      "Transformers have revolutionized NLP and computer vision. This post breaks down the attention mechanism, positional encoding, and the encoder-decoder structure. We'll implement a simple transformer from scratch to understand how self-attention enables models to capture long-range dependencies in sequences.",
    tags: ["transformers", "deep-learning", "nlp", "attention"],
    authorId: generateId("alice"),
    createdAt: daysAgo(2),
    updatedAt: null,
  },
  {
    id: generateId("post-5"),
    forumId: generateId("tech-ai"),
    number: 2,
    title: "Fine-tuning LLMs for Domain-Specific Tasks",
    content:
      "A practical guide to fine-tuning large language models for specialized domains. We'll explore LoRA, QLoRA, and full fine-tuning approaches. Learn about dataset preparation, hyperparameter tuning, and evaluation metrics. Includes code examples using Hugging Face Transformers and PEFT libraries.",
    tags: ["llm", "fine-tuning", "nlp", "machine-learning"],
    authorId: generateId("admin"),
    createdAt: daysAgo(4),
    updatedAt: null,
  },

  // Mobile Development posts
  {
    id: generateId("post-6"),
    forumId: generateId("tech-mobile"),
    number: 1,
    title: "SwiftUI vs UIKit: When to Use Each",
    content:
      "While SwiftUI is the future of iOS development, UIKit still has its place. This post examines real-world scenarios where each framework excels. SwiftUI shines in new projects with its declarative syntax and automatic state management. UIKit remains essential for complex custom animations and legacy codebases.",
    tags: ["ios", "swift", "swiftui", "mobile"],
    authorId: generateId("bob"),
    createdAt: daysAgo(7),
    updatedAt: null,
  },
  {
    id: generateId("post-7"),
    forumId: generateId("tech-mobile"),
    number: 2,
    title: "React Native Performance Optimization Guide",
    content:
      "Comprehensive guide to optimizing React Native apps. Cover topics like reducing bridge calls, implementing native modules for performance-critical code, optimizing list rendering with FlashList, and using Hermes engine. Real-world examples show 50%+ performance improvements in production apps.",
    tags: ["react-native", "mobile", "performance", "optimization"],
    authorId: generateId("user1"),
    createdAt: daysAgo(6),
    updatedAt: null,
  },

  // Physics posts
  {
    id: generateId("post-8"),
    forumId: generateId("sci-physics"),
    number: 1,
    title: "Quantum Entanglement Explained Simply",
    content:
      "Quantum entanglement seems magical but follows strict rules. When particles become entangled, measuring one instantly affects the other regardless of distance. This isn't faster-than-light communication - no information travels. Instead, the particles share a quantum state that collapses upon measurement. Recent experiments have demonstrated entanglement across thousands of kilometers.",
    tags: ["quantum", "physics", "entanglement", "science"],
    authorId: generateId("alice"),
    createdAt: daysAgo(8),
    updatedAt: null,
  },
  {
    id: generateId("post-9"),
    forumId: generateId("sci-physics"),
    number: 2,
    title: "Dark Matter: What We Know in 2024",
    content:
      "Despite making up 85% of matter in the universe, dark matter remains elusive. Recent observations from the James Webb Space Telescope have provided new constraints on dark matter models. We'll explore WIMPs, axions, and primordial black holes as candidates. The latest experiments at CERN and underground detectors continue the search.",
    tags: ["cosmology", "dark-matter", "astronomy", "physics"],
    authorId: generateId("admin"),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(9),
  },

  // Biology posts
  {
    id: generateId("post-10"),
    forumId: generateId("sci-bio"),
    number: 1,
    title: "CRISPR Gene Editing: Latest Breakthroughs",
    content:
      "CRISPR technology continues to advance rapidly. Prime editing now allows precise insertions, deletions, and replacements without double-strand breaks. Base editors can change single nucleotides with minimal off-target effects. Clinical trials for sickle cell disease and cancer treatments show promising results. The ethical implications remain hotly debated.",
    tags: ["genetics", "crispr", "biotechnology", "medicine"],
    authorId: generateId("bob"),
    createdAt: daysAgo(11),
    updatedAt: null,
  },
  {
    id: generateId("post-11"),
    forumId: generateId("sci-bio"),
    number: 2,
    title: "The Microbiome's Role in Mental Health",
    content:
      "Growing evidence links gut bacteria to brain function through the gut-brain axis. Studies show certain bacterial strains influence neurotransmitter production, affecting mood and cognition. Probiotics and dietary interventions show promise for treating depression and anxiety. The mechanisms involve vagus nerve signaling, metabolite production, and immune modulation.",
    tags: ["microbiome", "neuroscience", "health", "biology"],
    authorId: generateId("user1"),
    createdAt: daysAgo(12),
    updatedAt: null,
  },

  // Chemistry posts
  {
    id: generateId("post-12"),
    forumId: generateId("sci-chem"),
    number: 1,
    title: "Green Chemistry: Sustainable Synthesis Methods",
    content:
      "Green chemistry principles are transforming industrial processes. Catalytic reactions replace stoichiometric ones, reducing waste. Supercritical CO2 serves as a benign solvent. Enzyme catalysis enables reactions at room temperature. These methods cut energy use and eliminate toxic reagents while maintaining or improving yields.",
    tags: ["green-chemistry", "sustainability", "catalysis", "environment"],
    authorId: generateId("alice"),
    createdAt: daysAgo(14),
    updatedAt: null,
  },

  // Digital Art posts
  {
    id: generateId("post-13"),
    forumId: generateId("art-digital"),
    number: 1,
    title: "AI Art Tools: Creativity or Controversy?",
    content:
      "AI art generators like Midjourney and DALL-E spark heated debate. Artists worry about job displacement and copyright issues. Others see AI as a powerful creative tool. The technology democratizes art creation but raises questions about authenticity and originality. How do we balance innovation with protecting artists' livelihoods?",
    tags: ["ai-art", "digital", "ethics", "creativity"],
    authorId: generateId("admin"),
    createdAt: daysAgo(15),
    updatedAt: null,
  },
  {
    id: generateId("post-14"),
    forumId: generateId("art-digital"),
    number: 2,
    title: "Blender 4.0: Professional 3D for Everyone",
    content:
      "Blender 4.0 cements its position as industry-standard software. The Principled BSDF v2 brings physically accurate materials. Geometry nodes enable procedural modeling rivaling Houdini. Real-time ray tracing in the viewport speeds up workflows. Best of all, it remains completely free and open-source.",
    tags: ["blender", "3d", "modeling", "animation"],
    authorId: generateId("bob"),
    createdAt: daysAgo(13),
    updatedAt: null,
  },

  // Traditional Art posts
  {
    id: generateId("post-15"),
    forumId: generateId("art-trad"),
    number: 1,
    title: "Oil Painting Techniques: Alla Prima vs Glazing",
    content:
      "Two fundamental oil painting approaches offer different advantages. Alla prima (wet-on-wet) creates spontaneous, energetic works in single sessions. Glazing builds luminous depth through transparent layers over weeks. Masters like Rembrandt combined both techniques. Modern artists often choose based on subject matter and desired mood.",
    tags: ["oil-painting", "techniques", "traditional", "fine-art"],
    authorId: generateId("user1"),
    createdAt: daysAgo(16),
    updatedAt: null,
  },
  {
    id: generateId("post-16"),
    forumId: generateId("art-trad"),
    number: 2,
    title: "Watercolor: Mastering the Unpredictable Medium",
    content:
      "Watercolor's transparency and fluidity make it uniquely challenging. Success requires understanding water-to-pigment ratios, paper characteristics, and timing. Techniques like wet-on-wet create soft blends while dry brush adds texture. The key is embracing happy accidents and working with the medium's spontaneous nature rather than fighting it.",
    tags: ["watercolor", "painting", "techniques", "tutorial"],
    authorId: generateId("alice"),
    createdAt: daysAgo(17),
    updatedAt: null,
  },

  // Photography posts
  {
    id: generateId("post-17"),
    forumId: generateId("art-photo"),
    number: 1,
    title: "Street Photography: Ethics and Techniques",
    content:
      "Street photography captures authentic human moments but raises privacy concerns. Legal rights vary by country - know your local laws. Techniques include zone focusing for quick shots, using reflections for creative compositions, and developing situational awareness. Most importantly, respect your subjects and consider the stories you're telling.",
    tags: ["street", "photography", "ethics", "documentary"],
    authorId: generateId("admin"),
    createdAt: daysAgo(18),
    updatedAt: null,
  },
  {
    id: generateId("post-18"),
    forumId: generateId("art-photo"),
    number: 2,
    title: "Astrophotography on a Budget",
    content:
      "Stunning night sky photos don't require expensive equipment. A basic DSLR, tripod, and wide lens can capture the Milky Way. Key settings: manual mode, 20-second exposure, f/2.8, ISO 3200. Use the 500 rule to avoid star trails. Free software like DeepSkyStacker helps combine multiple exposures for noise reduction.",
    tags: ["astrophotography", "night", "budget", "tutorial"],
    authorId: generateId("bob"),
    createdAt: daysAgo(20),
    updatedAt: daysAgo(19),
  },
]

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
