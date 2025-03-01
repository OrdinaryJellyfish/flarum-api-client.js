import { ApiResource } from '.';

/**
 * Flarum Post resource
 */
export interface Post extends ApiResource {
  type: 'posts';
  attributes: {
    number: number;
    content: string;
    contentHtml: string;
    createdAt: string;
    editedAt: string | null;
    canEdit: boolean;
    canDelete: boolean;
    canHide: boolean;
    isHidden: boolean;
  };
  relationships?: {
    user?: {
      data: { type: 'users'; id: string } | null;
    };
    discussion?: {
      data: { type: 'discussions'; id: string };
    };
    editedUser?: {
      data: { type: 'users'; id: string } | null;
    };
  };
}