import { Model } from './model';
import type { User as UserType } from '../types/user';
import type { RequestOptions } from '../types';
import { Discussion } from './discussion';
import { Post } from './post';

export class User extends Model<UserType> {
  /**
   * Get discussions started by this user
   */
  async getDiscussions(options: RequestOptions = {}): Promise<Discussion[]> {
    const response = await this.client.request('discussions', {
      ...options,
      filter: {
        ...options.filter,
        user: this.id
      }
    });
    
    if (Array.isArray(response.data)) {
      return response.data.map((discussion: any) => new Discussion(this.client, discussion));
    }
    return [new Discussion(this.client, response.data)];
  }

  /**
   * Get posts created by this user
   */
  async getPosts(options: RequestOptions = {}): Promise<Post[]> {
    const response = await this.client.request('posts', {
      ...options,
      filter: {
        ...options.filter,
        user: this.id
      }
    });
    
    if (Array.isArray(response.data)) {
      return response.data.map((post: any) => new Post(this.client, post));
    }
    return [new Post(this.client, response.data)];
  }
  
  /**
   * Get the username of this user
   */
  getUsername(): string {
    return this.attributes.username;
  }
  
  /**
   * Get the display name of this user
   */
  getDisplayName(): string {
    return this.attributes.displayName || this.attributes.username;
  }
  
  /**
   * Get the avatar URL of this user
   */
  getAvatarUrl(): string | null {
    return this.attributes.avatarUrl || null;
  }
  
  /**
   * Get the group IDs this user belongs to
   */
  getGroupIds(): string[] {
    return this.getRelationshipIds('groups');
  }
}