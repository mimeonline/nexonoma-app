export interface GridContentItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
}

export interface GridSegmentContent {
  concepts: GridContentItem[];
  methods: GridContentItem[];
  tools: GridContentItem[];
  technologies: GridContentItem[];
}

export interface GridEntityProps {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  children?: GridEntity[];
  content?: GridSegmentContent;
}

export class GridEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly children: GridEntity[];
  readonly content: GridSegmentContent;

  constructor(props: GridEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.type = props.type;
    this.shortDescription = props.shortDescription ?? '';
    this.longDescription = props.longDescription ?? '';
    this.children = props.children || [];
    this.content =
      props.content ?? {
        concepts: [],
        methods: [],
        tools: [],
        technologies: [],
      };
  }
}
