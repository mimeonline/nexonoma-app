export interface GridEntityProps {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  children?: GridEntity[];
}

export class GridEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly children: GridEntity[];

  constructor(props: GridEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.type = props.type;
    this.shortDescription = props.shortDescription ?? '';
    this.longDescription = props.longDescription ?? '';
    this.children = props.children || [];
  }
}
