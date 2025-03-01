import { Model } from './model';
import type { Discussion as DiscussionType } from '../types/discussion';
import type { Post as PostType } from '../types/post';
import { Post } from './post';
import type { ApiResponse, RequestOptions } from '../types';

export class Discussion extends Model<DiscussionType> {
  /**
   * Create a new post in this discussion
   */
  async createPost(content: string): Promise<Post> {
    const response = await this.client.request<ApiResponse<PostType>>('posts', {
      method: 'POST',
      body: {
        data: {
          type: 'posts',
          attributes: {
            content
          },
          relationships: {
            discussion: {
              data: { type: 'discussions', id: this.id }
            }
          }
        }
      }
    });
    
    return new Post(this.client, response.data as PostType);
  }
  
  /**
   * Get all posts in this discussion
   */
  async getPosts(options: RequestOptions = {}): Promise<Post[]> {
    const response = await this.client.request<ApiResponse<PostType>>('posts', {
      ...options,
      filter: {
        ...options.filter,
        discussion: this.id
      }
    });
    
    if (Array.isArray(response.data)) {
      return response.data.map(post => new Post(this.client, post));
    }
    return [new Post(this.client, response.data as PostType)];
  }
  
  /**
   * Get the first post of this discussion
   */
  async getFirstPost(): Promise<Post> {
    const posts = await this.getPosts({
      filter: { number: 1 }
    });
    
    if (posts.length === 0) {
      throw new Error('First post not found');
    }
    
    return posts[0];
  }
  
  /**
   * Get the user ID of the discussion's author
   */
  getUserId(): string | null {
    return this.relationships?.user?.data?.id || null;
  }
}