export interface CatalogEntityProps {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  attributes?: Record<string, unknown>;
}

/**
 * Repräsentiert einen Content-Baustein (Concept, Method, Tool, Technology).
 * Hält alle übergebenen Attribute, damit spätere Filter/Views darauf zugreifen können.
 */
export class CatalogEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly attributes: Record<string, unknown>;

  constructor(props: CatalogEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.type = props.type;
    this.shortDescription = props.shortDescription ?? '';
    this.longDescription = props.longDescription ?? '';
    this.attributes = props.attributes ? { ...props.attributes } : {};
  }

  /**
   * Liefert eine flache Darstellung inkl. aller Zusatzattribute.
   */
  toPlain(): Record<string, unknown> & {
    id: string;
    name: string;
    slug: string;
    type: string;
    shortDescription: string;
    longDescription: string;
  } {
    return {
      ...this.attributes,
      id: this.id,
      name: this.name,
      slug: this.slug,
      type: this.type,
      shortDescription: this.shortDescription,
      longDescription: this.longDescription,
    };
  }
}
