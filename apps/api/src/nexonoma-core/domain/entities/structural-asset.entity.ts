import { AssetBlock, AssetBlockProps } from './asset.entity';

export interface StructuralAssetProps extends AssetBlockProps {
  // Optionale Zusätze für Structural Assets
  framework?: string;
  parentId?: string;
}

export class StructuralAsset extends AssetBlock {
  public clusterSlug?: string;
  public framework?: string;

  public parentId?: string;
  public children: AssetBlock[] = [];

  constructor(props: StructuralAssetProps) {
    // Hier ist der Fix: Wir übergeben das props-Objekt direkt an super()
    super(props);

    // Die spezifischen Felder setzen
    this.framework = props.framework;
    this.parentId = props.parentId;
  }

  addChild(child: AssetBlock) {
    if (!this.children) this.children = [];
    this.children.push(child);
  }
}
