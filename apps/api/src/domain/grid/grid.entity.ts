export interface GridEntityProps {
  id: string;
  name: string;
  slug: string;
  type: string;
  children?: GridEntity[];
}

export class GridEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  readonly children: GridEntity[];

  constructor(props: GridEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.type = props.type;
    this.children = props.children || [];
  }
}
