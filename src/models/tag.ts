import { Model } from './model';
import type { Tag as TagType } from '../types/tag';
import type { RequestOptions } from '../types';
import { Discussion } from './discussion';

export class Tag extends Model<TagType> {
  /**
   * Get all discussions that have this tag
   */
  async getDiscussions(options: RequestOptions = {}): Promise<Discussion[]> {
    const response = await this.client.request('discussions', {
      ...options,
      filter: {
        ...options.filter,
        tag: this.id
      }
    });
    
    if (Array.isArray(response.data)) {
      return response.data.map((discussion: any) => new Discussion(this.client, discussion));
    }
    return [new Discussion(this.client, response.data)];
  }
}