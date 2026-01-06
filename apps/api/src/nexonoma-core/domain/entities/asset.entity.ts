import { AssetStatus, AssetType } from '../types/asset-enums';

export interface LocalizedTag {
  slug: string;
  label: string;
}

// 1. Das Interface definiert alle Felder, die rein müssen
export interface AssetBlockProps {
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  version: string;
  language: string;
  license?: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  contributor?: string[];
  shortDescription: string;
  longDescription: string;
  tags?: LocalizedTag[];
  tagOrder?: string[];
  abbreviation?: string;
  organizationalLevel?: string[];
  icon?: string;
  image?: string; // Neu hinzugefügt
}

export abstract class AssetBlock {
  // Die Properties müssen wir trotzdem als Class-Fields definieren
  public readonly id: string;
  public readonly slug: string;
  public readonly name: string;
  public readonly type: AssetType;
  public readonly status: AssetStatus;
  public readonly version: string;
  public readonly language: string;
  public readonly license?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly author: string;
  public readonly contributor: string[];
  public readonly shortDescription: string;
  public readonly longDescription: string;
  public readonly tags: LocalizedTag[];
  public readonly tagOrder?: string[];
  public readonly abbreviation?: string;
  public readonly organizationalLevel: string[];
  public readonly icon?: string;
  public readonly image?: string;

  // 2. Der Constructor nimmt jetzt EIN Objekt (props) statt 20 Argumente
  constructor(props: AssetBlockProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
    this.type = props.type;
    this.status = props.status;
    this.version = props.version;
    this.language = props.language;
    this.license = props.license;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.author = props.author;
    this.contributor = props.contributor || [];
    this.shortDescription = props.shortDescription;
    this.longDescription = props.longDescription;
    this.tags = props.tags || [];
    this.tagOrder = props.tagOrder;
    this.abbreviation = props.abbreviation;
    this.organizationalLevel = props.organizationalLevel || [];
    this.icon = props.icon;
    this.image = props.image;
  }
}
