export interface Project {
    id: string;
    title: string;
    description: string;
    group: string;
    stage: string;
    hashtags: string[];
    imageUrl: string;
    metrics?: {
        codingEffort: number;
        complexity: number;
        impact: number;
    };
}

export type ViewMode = 'grid' | 'list' | 'masonry';
