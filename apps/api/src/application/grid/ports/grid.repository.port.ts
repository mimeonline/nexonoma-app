import { GridAggregate } from '../../../domain/grid/grid.aggregate';

export abstract class GridRepositoryPort {
  abstract loadGrid(): Promise<GridAggregate>;
}
