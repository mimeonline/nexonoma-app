import { BaseAssetBlock } from "./base.assetblock";

/**
 * Rollen/Funktionen im Organisationskontext.
 * Schema: schemas/nodes/role.schema.json
 * Optional aus Basistyp: abbreviation/organizationalLevel/relations; keine zusätzlichen Pflichtfelder.
 */
export interface Role extends BaseAssetBlock {
  type: "role";
}
