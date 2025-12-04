export interface MacroClusterEntityProps {
  id: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  contributor?: string[];
  license?: string;
  language?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
  organizationalLevel?: string[];
  abbreviation?: string;
  attributes?: Record<string, unknown>;
}

export class MacroClusterEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: 'macroCluster';
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly status: string;
  readonly version: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly author: string;
  readonly contributor: string[];
  readonly license: string;
  readonly language: string;
  readonly tags: string[];
  readonly customFields: Record<string, unknown>;
  readonly organizationalLevel: string[];
  readonly abbreviation?: string;
  readonly attributes: Record<string, unknown>;

  constructor(props: MacroClusterEntityProps) {
    this.id = props.id;
    this.name = props.name ?? '';
    this.slug = props.slug ?? '';
    this.type = 'macroCluster';
    this.shortDescription = props.shortDescription ?? '';
    this.longDescription = props.longDescription ?? '';
    this.status = props.status ?? '';
    this.version = props.version ?? '';
    this.createdAt = props.createdAt ?? '';
    this.updatedAt = props.updatedAt ?? '';
    this.author = props.author ?? '';
    this.contributor = props.contributor ?? [];
    this.license = props.license ?? '';
    this.language = props.language ?? '';
    this.tags = props.tags ?? [];
    this.customFields = props.customFields ?? {};
    this.organizationalLevel = props.organizationalLevel ?? [];
    this.abbreviation = props.abbreviation;
    this.attributes = props.attributes ? { ...props.attributes } : {};
  }

  toPlain(): Record<string, unknown> & {
    id: string;
    name: string;
    slug: string;
    type: 'macroCluster';
    shortDescription: string;
    longDescription: string;
    status: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    contributor: string[];
    license: string;
    language: string;
    tags: string[];
    customFields: Record<string, unknown>;
    organizationalLevel: string[];
    abbreviation?: string;
  } {
    return {
      ...this.attributes,
      id: this.id,
      name: this.name,
      slug: this.slug,
      type: this.type,
      shortDescription: this.shortDescription,
      longDescription: this.longDescription,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: this.author,
      contributor: this.contributor,
      license: this.license,
      language: this.language,
      tags: this.tags,
      customFields: this.customFields,
      organizationalLevel: this.organizationalLevel,
      abbreviation: this.abbreviation,
    };
  }
}
