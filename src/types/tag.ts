import { ApiResource } from '.';

/**
 * Flarum Tag resource
 */
export interface Tag extends ApiResource {
  type: 'tags';
  attributes: {
    name: string;
    description: string | null;
    slug: string;
    color: string | null;
    backgroundUrl: string | null;
    backgroundMode: string | null;
    icon: string | null;
    discussionCount: number;
    position: number | null;
    isChild: boolean;
    isHidden: boolean;
  };
  relationships?: {
    parent?: {
      data: { type: 'tags'; id: string } | null;
    };
  };
}