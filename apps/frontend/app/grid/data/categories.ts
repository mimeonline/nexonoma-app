export type ContentItem = {
  slug: string;
  title: string;
  type: "concept" | "method" | "tool" | "technology";
  summary: string;
};

export type Segment = {
  slug: string;
  title: string;
  contents: Record<ContentItem["type"], ContentItem[]>;
};

export type SubCluster = {
  slug: string;
  title: string;
  segments: Segment[];
};

export type Cluster = {
  slug: string;
  title: string;
  icon: string;
  subclusters: SubCluster[];
};

const makeContents = (segment: string): Record<ContentItem["type"], ContentItem[]> => ({
  concept: [
    {
      slug: `${segment}-concept`,
      title: "Concept Placeholder",
      type: "concept",
      summary: "Konzeptioneller Überblick für dieses Segment.",
    },
  ],
  method: [
    {
      slug: `${segment}-method`,
      title: "Method Placeholder",
      type: "method",
      summary: "Methode, um das Segment praktisch umzusetzen.",
    },
  ],
  tool: [
    {
      slug: `${segment}-tool`,
      title: "Tool Placeholder",
      type: "tool",
      summary: "Werkzeug-Empfehlung für dieses Segment.",
    },
  ],
  technology: [
    {
      slug: `${segment}-technology`,
      title: "Technology Placeholder",
      type: "technology",
      summary: "Technologie-Beispiel für dieses Segment.",
    },
  ],
});

const makeSegment = (slug: string, title: string): Segment => ({
  slug,
  title,
  contents: makeContents(slug),
});

export const clusters: Cluster[] = [
  {
    slug: "tech-infra",
    title: "Technologie & Infrastruktur",
    icon: "Server",
    subclusters: [
      {
        slug: "ai-ml",
        title: "AI & Machine Learning",
        segments: [
          makeSegment("modeling", "Modeling"),
          makeSegment("deployment", "Deployment"),
        ],
      },
      {
        slug: "cloud",
        title: "Cloud & Infrastruktur",
        segments: [
          makeSegment("platform", "Platform Engineering"),
          makeSegment("networking", "Networking"),
        ],
      },
    ],
  },
  {
    slug: "software-arch",
    title: "Software & Architektur",
    icon: "Boxes",
    subclusters: [
      {
        slug: "backend",
        title: "Backend",
        segments: [
          makeSegment("apis", "APIs"),
          makeSegment("services", "Services"),
        ],
      },
      {
        slug: "frontend",
        title: "Frontend",
        segments: [
          makeSegment("ui-patterns", "UI Patterns"),
          makeSegment("performance", "Performance"),
        ],
      },
    ],
  },
  {
    slug: "strategy",
    title: "Strategie & Organisation",
    icon: "Building",
    subclusters: [
      {
        slug: "change",
        title: "Change & Transformation",
        segments: [
          makeSegment("roadmaps", "Roadmaps"),
          makeSegment("enablement", "Enablement"),
        ],
      },
    ],
  },
  {
    slug: "data-intelligence",
    title: "Data & Intelligence",
    icon: "Database",
    subclusters: [
      {
        slug: "bi",
        title: "Business Intelligence",
        segments: [
          makeSegment("dashboards", "Dashboards"),
          makeSegment("quality", "Data Quality"),
        ],
      },
    ],
  },
  {
    slug: "user-context",
    title: "User & Kontext",
    icon: "User",
    subclusters: [
      {
        slug: "ux",
        title: "UX & Product Design",
        segments: [
          makeSegment("research", "Research"),
          makeSegment("prototyping", "Prototyping"),
        ],
      },
    ],
  },
];
