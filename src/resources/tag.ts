import { Resource } from './resource';
import type { Tag as TagType } from '../types/tag';
import { Tag } from '../models/tag';
import type { FlarumAPIClient } from '../client';

export class TagResource extends Resource<TagType, Tag> {
  constructor(client: FlarumAPIClient) {
    super(client, 'tags', Tag);
  }
}
