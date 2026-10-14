export const projects = [
  {
    id: "galaxy",
    name: "Galaxy Knitwear",
    category: "Manufacturing / Business Website",
    description:
      "An apparel manufacturing website, currently branded Silver Textile.",
    url: "https://galaxy-lilac-alpha.vercel.app/",
    image: "/projects/galaxy.webp",
    tone: "galaxy",
  },
  {
    id: "nova",
    name: "Nova Builders",
    category: "Construction / Business Website",
    description:
      "An architectural concept site with a development collection and interactive model study.",
    url: "https://nova-nova-builders.vercel.app/",
    image: "/projects/nova.webp",
    tone: "nova",
  },
  {
    id: "vantor",
    name: "Vantor Automotive",
    category: "Automotive Website",
    description:
      "A showroom concept with a vehicle collection and enquiry interfaces.",
    url: "https://vantor-automative.vercel.app/",
    image: "/projects/vantor.webp",
    tone: "vantor",
  },
  {
    id: "ember",
    name: "Ember & Grain",
    category: "Restaurant Web Application",
    description:
      "A restaurant app demo with menu, bag, order, and account interfaces.",
    url: "https://restaurant-app-blush-mu.vercel.app/",
    image: "/projects/ember.webp",
    tone: "ember",
  },
  {
    id: "fade",
    name: "Fade & Co.",
    category: "Barbershop Web Application",
    description:
      "A barbershop booking interface with a five-step reservation flow.",
    url: "https://fade-and-co-omega.vercel.app/",
    image: "/projects/fade.webp",
    tone: "fade",
  },
] as const;

export const services = [
  {
    name: "Websites",
    icon: "window",
    description:
      "Fast, responsive websites that communicate your value, build trust, and help turn visitors into customers.",
    examples: [
      "Business websites",
      "Landing pages",
      "E-commerce websites",
      "Website redesigns",
    ],
    cta: "Explore Website Development",
    interest: "Website",
  },
  {
    name: "Web Applications",
    icon: "code",
    description:
      "Custom web applications that solve real problems, streamline operations, and make complex tasks easier.",
    examples: [
      "Custom business applications",
      "Dashboards and portals",
      "Database-driven applications",
      "API integrations",
    ],
    cta: "Explore Web Applications",
    interest: "Web Application",
  },
  {
    name: "AI & Automation",
    icon: "flow",
    description:
      "Practical AI tools and automations that reduce repetitive work, connect your tools, and improve everyday business processes.",
    examples: [
      "AI assistants and chatbots",
      "Workflow automation",
      "Customer support triage",
      "Review response workflows",
      "Business process integrations",
    ],
    cta: "Explore AI Automation",
    interest: "AI Automation",
  },
] as const;

export const workflows = [
  {
    name: "Support Triage Assistant",
    icon: "inbox",
    description:
      "An AI-assisted support workflow designed to categorize incoming requests, identify their intent, and help route them to the right next step.",
    steps: [
      "Incoming request",
      "Intent classification",
      "Priority assessment",
      "Routing suggestion",
    ],
  },
  {
    name: "Google Review Response Automation",
    icon: "star",
    description:
      "A workflow concept for helping businesses organize incoming Google reviews and prepare context-aware responses for review.",
    steps: [
      "Review received",
      "Sentiment analysis",
      "Response draft",
      "Human review & approval",
    ],
  },
] as const;

export const approach = [
  [
    "Understand",
    "We learn about your business, your goals, and the problems you need to solve.",
  ],
  [
    "Plan",
    "We define the right approach, scope, and priorities before building.",
  ],
  ["Build", "We develop, test, and refine the solution around your needs."],
  [
    "Launch & Improve",
    "We help get your solution live and identify opportunities to improve it.",
  ],
] as const;

export const principles = [
  [
    "Practical Solutions",
    "Technology should solve a real problem, not create unnecessary complexity.",
  ],
  [
    "Performance & Reliability",
    "Responsive interfaces, maintainable code, and careful implementation.",
  ],
  [
    "Clear Communication",
    "Straightforward collaboration, clear expectations, and visible progress.",
  ],
  [
    "Room to Grow",
    "Solutions designed with future improvements and integrations in mind.",
  ],
] as const;
