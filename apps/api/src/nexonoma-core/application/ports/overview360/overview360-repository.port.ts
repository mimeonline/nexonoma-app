import { Overview360Record } from 'src/nexonoma-core/infrastructure/persistence/neo4j/overview360/overview360-record.mapper';

export abstract class Overview360RepositoryPort {
  abstract findOverviewItems(locale: string): Promise<Overview360Record[]>;
}
