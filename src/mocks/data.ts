import type { Forum, Post, User, Comment } from "@/types"

const generateId = (seed: string) => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const uuid = `${hash.toString(16).padStart(8, "0")}-${hash.toString(16).padStart(4, "0")}-4${hash.toString(16).padStart(3, "0")}-${((hash & 0x3f) | 0x80).toString(16).padStart(4, "0")}-${hash.toString(16).padStart(12, "0")}`
  return uuid
}

export const mockUsers: (User & { password: string })[] = [
  { id: generateId("admin"), username: "admin", password: "admin", role: "admin" },
  { id: generateId("user1"), username: "user1", password: "user1", role: "user" },
  { id: generateId("alice"), username: "alice", password: "alice", role: "user" },
  { id: generateId("bob"), username: "bob", password: "bob", role: "user" },
]

export const mockForums: Forum[] = [
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

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const webDevTopics = [
  {
    title: "Understanding React Hooks",
    content: "React hooks revolutionized how we write components. Let's explore useState, useEffect, and custom hooks.",
    tags: ["react", "hooks", "javascript"],
  },
  {
    title: "CSS Grid Layout Mastery",
    content: "CSS Grid provides powerful two-dimensional layout capabilities. Learn how to create complex layouts with ease.",
    tags: ["css", "grid", "layout"],
  },
  {
    title: "TypeScript Best Practices",
    content: "TypeScript adds static typing to JavaScript. Discover patterns that make your code more maintainable.",
    tags: ["typescript", "javascript", "types"],
  },
  {
    title: "Node.js Performance Tips",
    content: "Optimize your Node.js applications for better performance. From async patterns to memory management.",
    tags: ["nodejs", "performance", "backend"],
  },
  {
    title: "Vue 3 Composition API",
    content: "Vue 3 introduces the Composition API for better code organization. Learn how to refactor your components.",
    tags: ["vue", "frontend", "javascript"],
  },
  {
    title: "GraphQL vs REST",
    content: "Compare GraphQL and REST architectures. Understand when to use each approach in your projects.",
    tags: ["graphql", "rest", "api"],
  },
  {
    title: "Docker for Developers",
    content: "Containerize your applications with Docker. Learn Dockerfile basics and Docker Compose.",
    tags: ["docker", "devops", "containers"],
  },
  {
    title: "Testing with Jest",
    content: "Write reliable tests with Jest. Cover unit testing, mocking, and test-driven development.",
    tags: ["testing", "jest", "tdd"],
  },
  {
    title: "Webpack Configuration",
    content: "Master Webpack configuration for modern JavaScript applications. Loaders, plugins, and optimization.",
    tags: ["webpack", "bundling", "build"],
  },
  {
    title: "Progressive Web Apps",
    content: "Build offline-capable web applications. Service workers, manifests, and PWA best practices.",
    tags: ["pwa", "offline", "mobile"],
  },
]

const otherForumTopics = {
  "artificial-intelligence": [
    {
      title: "Introduction to Neural Networks",
      content: "Neural networks form the backbone of deep learning. Understand perceptrons, layers, and backpropagation.",
      tags: ["neural-networks", "deep-learning", "ai"],
    },
    {
      title: "Natural Language Processing",
      content: "NLP enables machines to understand human language. Explore tokenization, embeddings, and transformers.",
      tags: ["nlp", "transformers", "language"],
    },
    {
      title: "Computer Vision Basics",
      content: "Computer vision allows machines to interpret visual information. Learn about CNNs and image processing.",
      tags: ["computer-vision", "cnn", "images"],
    },
    {
      title: "Reinforcement Learning",
      content: "RL agents learn through interaction with environments. Discover Q-learning and policy gradients.",
      tags: ["reinforcement-learning", "q-learning", "agents"],
    },
    {
      title: "AI Ethics and Bias",
      content: "Ethical considerations in AI development. Address bias, fairness, and responsible AI practices.",
      tags: ["ethics", "bias", "responsible-ai"],
    },
  ],
  "mobile-development": [
    {
      title: "Swift UI Fundamentals",
      content: "Build iOS apps with SwiftUI's declarative syntax. Create responsive and beautiful interfaces.",
      tags: ["swiftui", "ios", "swift"],
    },
    {
      title: "Android Jetpack Compose",
      content: "Modern Android UI with Jetpack Compose. Declarative UI development for Android apps.",
      tags: ["android", "compose", "kotlin"],
    },
    {
      title: "React Native Performance",
      content: "Optimize React Native apps for production. Bridge optimization and native module integration.",
      tags: ["react-native", "performance", "cross-platform"],
    },
    {
      title: "Flutter State Management",
      content: "Managing state in Flutter applications. Compare Provider, Riverpod, and Bloc patterns.",
      tags: ["flutter", "state", "dart"],
    },
    {
      title: "Mobile App Security",
      content: "Secure your mobile applications. Encryption, secure storage, and API security best practices.",
      tags: ["security", "encryption", "mobile"],
    },
  ],
  physics: [
    {
      title: "Quantum Mechanics Simplified",
      content: "Demystifying quantum mechanics. Wave functions, uncertainty principle, and quantum states.",
      tags: ["quantum", "mechanics", "physics"],
    },
    {
      title: "General Relativity Explained",
      content: "Einstein's theory of gravity. Spacetime curvature, black holes, and gravitational waves.",
      tags: ["relativity", "einstein", "gravity"],
    },
    {
      title: "Particle Physics Overview",
      content: "The Standard Model of particle physics. Quarks, leptons, and fundamental forces.",
      tags: ["particles", "standard-model", "forces"],
    },
    {
      title: "Cosmology and Dark Matter",
      content: "The universe's structure and evolution. Dark matter, dark energy, and cosmic inflation.",
      tags: ["cosmology", "dark-matter", "universe"],
    },
    {
      title: "Thermodynamics Principles",
      content: "Laws of thermodynamics and their applications. Entropy, heat engines, and statistical mechanics.",
      tags: ["thermodynamics", "entropy", "heat"],
    },
  ],
  biology: [
    {
      title: "CRISPR Gene Editing",
      content: "Revolutionary gene editing technology. How CRISPR works and its medical applications.",
      tags: ["crispr", "genetics", "editing"],
    },
    {
      title: "Evolution and Natural Selection",
      content: "Darwin's theory in modern context. Genetic drift, speciation, and evolutionary evidence.",
      tags: ["evolution", "darwin", "selection"],
    },
    {
      title: "Neuroscience Basics",
      content: "How the brain works. Neurons, synapses, and neural networks in biological systems.",
      tags: ["neuroscience", "brain", "neurons"],
    },
    {
      title: "Ecology and Climate Change",
      content: "Ecosystem dynamics and climate impact. Biodiversity, conservation, and environmental science.",
      tags: ["ecology", "climate", "environment"],
    },
    {
      title: "Molecular Biology Central Dogma",
      content: "DNA to RNA to proteins. Transcription, translation, and gene regulation mechanisms.",
      tags: ["molecular", "dna", "proteins"],
    },
  ],
  chemistry: [
    {
      title: "Organic Chemistry Reactions",
      content: "Common organic reactions and mechanisms. Substitution, elimination, and addition reactions.",
      tags: ["organic", "reactions", "mechanisms"],
    },
    {
      title: "Quantum Chemistry Basics",
      content: "Quantum mechanics in chemistry. Molecular orbitals, bonding, and spectroscopy.",
      tags: ["quantum", "orbitals", "bonding"],
    },
    {
      title: "Green Chemistry Principles",
      content: "Sustainable chemistry practices. Reducing waste, safer chemicals, and environmental impact.",
      tags: ["green", "sustainable", "environment"],
    },
    {
      title: "Polymer Science Introduction",
      content: "Understanding polymers and plastics. Polymerization, properties, and applications.",
      tags: ["polymers", "plastics", "materials"],
    },
    {
      title: "Analytical Chemistry Methods",
      content: "Modern analytical techniques. Chromatography, spectroscopy, and mass spectrometry.",
      tags: ["analytical", "spectroscopy", "methods"],
    },
  ],
  "digital-art": [
    {
      title: "Digital Painting Techniques",
      content: "Master digital painting in Photoshop and Procreate. Brushes, layers, and color theory.",
      tags: ["painting", "digital", "photoshop"],
    },
    {
      title: "3D Modeling with Blender",
      content: "Create 3D models in Blender. Modeling, texturing, and rendering fundamentals.",
      tags: ["3d", "blender", "modeling"],
    },
    {
      title: "Vector Illustration Basics",
      content: "Create scalable vector graphics. Adobe Illustrator techniques and design principles.",
      tags: ["vector", "illustrator", "design"],
    },
    {
      title: "UI/UX Design Principles",
      content: "Design user interfaces that work. User research, wireframing, and prototyping.",
      tags: ["ui", "ux", "design"],
    },
    {
      title: "Motion Graphics Essentials",
      content: "Animate your designs. After Effects basics and motion design principles.",
      tags: ["motion", "animation", "aftereffects"],
    },
  ],
  "traditional-art": [
    {
      title: "Oil Painting Fundamentals",
      content: "Traditional oil painting techniques. Color mixing, brushwork, and glazing methods.",
      tags: ["oil", "painting", "traditional"],
    },
    {
      title: "Figure Drawing Anatomy",
      content: "Master human anatomy for artists. Proportions, gesture, and constructive drawing.",
      tags: ["figure", "anatomy", "drawing"],
    },
    {
      title: "Watercolor Techniques",
      content: "Explore watercolor's unique properties. Wet-on-wet, dry brush, and color blending.",
      tags: ["watercolor", "painting", "techniques"],
    },
    {
      title: "Sculpture Materials Guide",
      content: "Working with clay, stone, and metal. Tools, techniques, and finishing methods.",
      tags: ["sculpture", "materials", "3d"],
    },
    {
      title: "Art History Overview",
      content: "Major art movements through history. From Renaissance to Contemporary art.",
      tags: ["history", "movements", "culture"],
    },
  ],
  photography: [
    {
      title: "Camera Settings Explained",
      content: "Master manual mode. Aperture, shutter speed, ISO, and the exposure triangle.",
      tags: ["camera", "settings", "exposure"],
    },
    {
      title: "Composition Techniques",
      content: "Create compelling photographs. Rule of thirds, leading lines, and visual balance.",
      tags: ["composition", "techniques", "visual"],
    },
    {
      title: "Portrait Photography Tips",
      content: "Capture stunning portraits. Lighting, posing, and connecting with subjects.",
      tags: ["portrait", "lighting", "people"],
    },
    {
      title: "Landscape Photography Guide",
      content: "Shoot breathtaking landscapes. Golden hour, filters, and composition strategies.",
      tags: ["landscape", "nature", "outdoor"],
    },
    {
      title: "Photo Editing Workflow",
      content: "Post-processing in Lightroom and Photoshop. RAW processing and color grading.",
      tags: ["editing", "lightroom", "post-processing"],
    },
  ],
}

function generatePosts(): Post[] {
  const posts: Post[] = []
  const users = mockUsers.map((u) => u.id)
  let globalPostNumber = 1

  const webForumId = generateId("tech-web")
  for (let i = 0; i < 120; i++) {
    const topicIndex = i % webDevTopics.length
    const topic = webDevTopics[topicIndex]
    const iteration = Math.floor(i / webDevTopics.length)

    const title = iteration > 0 ? `${topic.title} - Part ${String(iteration + 1)}` : topic.title
    const content =
      iteration > 0
        ? `${topic.content} In this part ${String(iteration + 1)}, we'll dive deeper into advanced concepts and real-world applications.`
        : topic.content

    posts.push({
      id: generateId(`post-${String(globalPostNumber)}`),
      forumId: webForumId,
      number: i + 1,
      title,
      content,
      tags: topic.tags,
      authorId: users[i % users.length],
      createdAt: daysAgo(120 - i),
      updatedAt: Math.random() > 0.7 ? daysAgo(120 - i - Math.random() * 5) : null,
    })
    globalPostNumber++
  }

  mockForums.slice(1).forEach((forum) => {
    const topics = otherForumTopics[forum.slug as keyof typeof otherForumTopics]

    for (let i = 0; i < 5; i++) {
      const topic = topics[i % topics.length]
      posts.push({
        id: generateId(`post-${String(globalPostNumber)}`),
        forumId: forum.id,
        number: i + 1,
        title: topic.title,
        content: topic.content,
        tags: topic.tags,
        authorId: users[i % users.length],
        createdAt: daysAgo(60 - i * 10),
        updatedAt: Math.random() > 0.8 ? daysAgo(60 - i * 10 - Math.random() * 3) : null,
      })
      globalPostNumber++
    }
  })

  return posts
}

const commentTemplates = [
  "Great explanation! This really helped me understand the concept better.",
  "I've been using this approach in production and it works really well.",
  "Could you elaborate more on this point? I'm particularly interested in the implementation details.",
  "Thanks for sharing! I learned something new today.",
  "This is exactly what I was looking for. Bookmarking for future reference.",
  "I disagree with this approach. In my experience, a different method works better.",
  "Has anyone tried this with the latest version? I'm curious about compatibility.",
  "Excellent write-up! The examples really drive the point home.",
  "I'm having trouble implementing this. Could you provide more code examples?",
  "This saved me hours of debugging. Much appreciated!",
  "Interesting perspective. I hadn't thought about it this way before.",
  "For anyone struggling with this, I found a helpful resource that complements this post.",
  "This is outdated. The new version has a completely different approach.",
  "Can confirm this works perfectly. Just implemented it in my project.",
  "Be careful with this approach in production. There are some edge cases to consider.",
  "The performance implications of this are worth discussing further.",
  "I've been doing this for years. Glad to see it getting more attention.",
  "This is a game-changer! Why didn't I know about this earlier?",
  "The documentation could be clearer on this point. Thanks for the clarification.",
  "Anyone have benchmarks comparing this to alternative solutions?",
]

function generateComments(posts: Post[]): Comment[] {
  const comments: Comment[] = []
  const users = mockUsers.map((u) => u.id)
  let commentId = 1

  posts.forEach((post) => {
    const numComments = Math.floor(Math.random() * 6)

    for (let i = 0; i < numComments; i++) {
      const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]
      const postAge = (new Date().getTime() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      const commentAge = postAge - Math.random() * Math.min(postAge, 30)

      comments.push({
        id: generateId(`comment-${String(commentId)}`),
        postId: post.id,
        content: template,
        authorId: users[Math.floor(Math.random() * users.length)],
        createdAt: daysAgo(commentAge),
        updatedAt: Math.random() > 0.9 ? daysAgo(commentAge - Math.random() * 2) : null,
      })
      commentId++
    }
  })

  return comments
}

export const mockPosts = generatePosts()
export const mockComments = generateComments(mockPosts)

export const mockSessions = new Map<string, User>()
