import { newId } from '../../../common/utils/uuid.util';
import { GridAggregate } from '../../../domain/grid/grid.aggregate';

interface SegmentContentLike {
  methods?: unknown[];
  concepts?: unknown[];
  tools?: unknown[];
  technologies?: unknown[];
}

interface SegmentLike {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  content?: SegmentContentLike;
}

interface ClusterLike {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  segments?: SegmentLike[];
  children?: SegmentLike[]; // für GridEntity.children
}

interface MacroClusterLike {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription?: string;
  longDescription?: string;
  clusters?: ClusterLike[];
  children?: ClusterLike[]; // für GridEntity.children
}

export class GridResponseDto {
  data: {
    macroClusters: MacroClusterDto[];
  };

  meta: {
    requestId: string;
    timestamp: string;
    page: number;
    pageSize: number;
    total: number;
  };

  errors: unknown[];

  constructor(aggregate: GridAggregate) {
    this.data = {
      macroClusters: aggregate.macroClusters.map((mc) =>
        this.mapMacroCluster(mc as unknown as MacroClusterLike),
      ),
    };

    this.meta = {
      requestId: newId(),
      timestamp: new Date().toISOString(),
      page: 1,
      pageSize: aggregate.macroClusters.length,
      total: aggregate.macroClusters.length,
    };

    this.errors = [];
  }

  private mapMacroCluster(mc: MacroClusterLike): MacroClusterDto {
    const rawClusters = (mc.clusters ?? mc.children ?? []) as ClusterLike[];

    return {
      id: mc.id,
      name: mc.name,
      slug: mc.slug,
      type: mc.type,
      shortDescription: mc.shortDescription ?? '',
      longDescription: mc.longDescription ?? '',
      clusters: rawClusters.map((c) => this.mapCluster(c)),
    };
  }

  private mapCluster(c: ClusterLike): ClusterDto {
    const rawSegments = (c.segments ?? c.children ?? []) as SegmentLike[];

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type,
      shortDescription: c.shortDescription ?? '',
      longDescription: c.longDescription ?? '',
      segments: rawSegments.map((s) => this.mapSegment(s)),
    };
  }

  private mapSegment(s: SegmentLike): SegmentDto {
    const content: SegmentContentLike = s.content ?? {};
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      type: s.type,
      shortDescription: s.shortDescription ?? '',
      longDescription: s.longDescription ?? '',
      content: {
        methods: content.methods ?? [],
        concepts: content.concepts ?? [],
        tools: content.tools ?? [],
        technologies: content.technologies ?? [],
      },
    };
  }
}

export interface MacroClusterDto {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  clusters: ClusterDto[];
}

export interface ClusterDto {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  segments: SegmentDto[];
}

export interface SegmentDto {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  content: {
    methods: unknown[];
    concepts: unknown[];
    tools: unknown[];
    technologies: unknown[];
  };
}
