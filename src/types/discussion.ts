import { ApiResource } from '.';

/**
 * Flarum Discussion resource
 */
export interface Discussion extends ApiResource {
  type: 'discussions';
  attributes: {
    title: string;
    slug: string;
    commentCount: number;
    participantCount: number;
    createdAt: string;
    lastPostedAt: string | null;
    lastPostNumber: number | null;
    canReply: boolean;
    canRename: boolean;
    canDelete: boolean;
    isLocked: boolean;
    isSticky: boolean;
    isPrivate?: boolean;
  };
  relationships?: {
    user?: {
      data: { type: 'users'; id: string };
    };
    lastPostedUser?: {
      data: { type: 'users'; id: string } | null;
    };
    firstPost?: {
      data: { type: 'posts'; id: string };
    };
    lastPost?: {
      data: { type: 'posts'; id: string } | null;
    };
    posts?: {
      data: Array<{ type: 'posts'; id: string }>;
    };
    tags?: {
      data: Array<{ type: 'tags'; id: string }>;
    };
  };
}

/**
 * Discussion options
 */
export interface DiscussionOptions {
  title: string;
  content: string;
  tags?: string[];
}