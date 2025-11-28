import {
  Boxes,
  Building,
  Database,
  User,
  Wrench,
} from "lucide-react";

export type SubCluster = {
  id: string;
  title: string;
};

export type Category = {
  id: string;
  title: string;
  icon: keyof typeof iconMap;
  subclusters: SubCluster[];
};

export const iconMap = {
  Wrench,
  Boxes,
  Building,
  Database,
  User,
};

export const categories: Category[] = [
  {
    id: "tech-infra",
    title: "Technologie & Infrastruktur",
    icon: "Wrench",
    subclusters: [
      { id: "ai-ml", title: "AI & Machine Learning" },
      { id: "cloud", title: "Cloud & Infrastruktur" },
      { id: "cost", title: "Kosten & Effizienz" },
      { id: "incident", title: "Incident Management & Resilience" },
      { id: "integration", title: "Integration & APIs" },
      { id: "observability", title: "Observability & Monitoring" },
    ],
  },
  {
    id: "software-arch",
    title: "Software & Architektur",
    icon: "Boxes",
    subclusters: [
      { id: "backend", title: "Backend" },
      { id: "frontend", title: "Frontend" },
      { id: "devops", title: "DevOps & Platform Engineering" },
      { id: "legacy", title: "Legacy & Modernisierung" },
      { id: "mobile-edge", title: "Mobile & Edge Development" },
      { id: "architecture", title: "Software Architektur" },
      { id: "sdlc", title: "Software Development Lifecycle" },
    ],
  },
  {
    id: "strategy",
    title: "Strategie & Organisation",
    icon: "Building",
    subclusters: [
      { id: "business-org", title: "Business & Organisation" },
      { id: "org-maturity", title: "Organisationale Reife & Capability Development" },
      { id: "change", title: "Change & Transformation" },
      { id: "governance", title: "Governance & Architekturentscheidungen" },
      { id: "operating-model", title: "IT Operating Model" },
    ],
  },
  {
    id: "data-intelligence",
    title: "Data & Intelligence",
    icon: "Database",
    subclusters: [
      { id: "bi", title: "Data & Business Intelligence" },
      { id: "datastrategy", title: "Datenstrategie & Governance" },
      { id: "qa-testing", title: "Quality Assurance & Testing" },
    ],
  },
  {
    id: "user-context",
    title: "User & Kontext",
    icon: "User",
    subclusters: [
      { id: "ethics", title: "Ethics & Sustainability" },
      { id: "knowledge", title: "Knowledge Management & Collaboration" },
      { id: "security", title: "Security & Compliance" },
      { id: "system-thinking", title: "System Thinking" },
      { id: "ux", title: "UX & Product Design" },
    ],
  },
];
