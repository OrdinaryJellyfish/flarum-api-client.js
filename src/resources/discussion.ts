import { Resource } from './resource';
import type { Discussion as DiscussionType } from '../types/discussion';
import { Discussion } from '../models/discussion';
import type { FlarumAPIClient } from '../client';

export class DiscussionResource extends Resource<DiscussionType, Discussion> {
  constructor(client: FlarumAPIClient) {
    super(client, 'discussions', Discussion);
  }
}
