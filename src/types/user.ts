import { ApiResource } from '.';

/**
 * Flarum User resource
 */
export interface User extends ApiResource {
  type: 'users';
  attributes: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    email?: string;
    isEmailConfirmed?: boolean;
    joinTime: string;
    discussionCount: number;
    commentCount: number;
    canEdit: boolean;
    canDelete: boolean;
    lastSeenAt: string | null;
    isAdmin?: boolean;
  };
  relationships?: {
    groups?: {
      data: Array<{ type: 'groups'; id: string }>;
    };
  };
}