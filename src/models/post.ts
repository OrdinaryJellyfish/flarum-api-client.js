import { Model } from './model';
import type { Post as PostType } from '../types/post';

export class Post extends Model<PostType> {
  /**
   * Get the discussion ID this post belongs to
   */
  getDiscussionId(): string | null {
    return this.relationships?.discussion?.data?.id || null;
  }
  
  /**
   * Get the user ID who created this post
   */
  getUserId(): string | null {
    return this.relationships?.user?.data?.id || null;
  }
  
  /**
   * Check if this post is the first post in a discussion
   */
  isFirstPost(): boolean {
    return this.attributes.number === 1;
  }
}