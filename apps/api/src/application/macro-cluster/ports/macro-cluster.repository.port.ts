import { MacroClusterAggregate } from '../../../domain/macro-cluster/macro-cluster.aggregate';
import { MacroClusterEntity } from '../../../domain/macro-cluster/macro-cluster.entity';

export abstract class MacroClusterRepositoryPort {
  abstract loadMacroClusters(): Promise<MacroClusterAggregate>;
  abstract loadMacroClusterById(id: string): Promise<MacroClusterEntity | null>;
}
