import { Resource } from './resource';
import type { User as UserType } from '../types/user';
import { User } from '../models/user';
import type { FlarumAPIClient } from '../client';

export class UserResource extends Resource<UserType, User> {
  constructor(client: FlarumAPIClient) {
    super(client, 'users', User);
  }
}
