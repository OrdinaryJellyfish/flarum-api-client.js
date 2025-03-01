import type { ApiResource, ApiResponse } from '../types';
import type { FlarumAPIClient } from '../client';

export abstract class Model<T extends ApiResource = ApiResource> {
  protected client: FlarumAPIClient;

  readonly id: string;
  readonly type: string;
  readonly attributes: T['attributes'];
  readonly relationships?: T['relationships'];

  constructor(client: FlarumAPIClient, data: T) {
    this.client = client;
    this.id = data.id;
    this.type = data.type;
    this.attributes = { ...data.attributes };
    this.relationships = data.relationships
      ? { ...data.relationships }
      : undefined;
  }

  /**
   * Update this model with new attributes and optional relationships
   */
  async update(
    attributes: Partial<T['attributes']>,
    relationships?: Partial<T['relationships']>
  ): Promise<Model> {
    // Prepare request body
    const body: any = {
      data: {
        type: this.type,
        id: this.id,
        attributes
      }
    };
    
    // Add relationships if specified
    if (relationships && Object.keys(relationships).length > 0) {
      body.data.relationships = relationships;
    }
    
    const response = await this.client.request<ApiResponse<T>>(
      `${this.type}/${this.id}`,
      {
        method: 'PATCH',
        body
      }
    );

    // Use type casting to create a new instance of the same class
    const ModelClass = this.constructor as new (
      client: FlarumAPIClient,
      data: T
    ) => this;
    return new ModelClass(this.client, response.data as T);
  }

  /**
   * Delete this model
   */
  async delete(): Promise<void> {
    await this.client.request(`${this.type}/${this.id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Refresh this model with latest data from the server
   */
  async refresh(): Promise<Model> {
    const response = await this.client.request<ApiResponse<T>>(
      `${this.type}/${this.id}`
    );

    // Use type casting to create a new instance of the same class
    const ModelClass = this.constructor as new (client: FlarumAPIClient, data: T) => this;
    return new ModelClass(this.client, response.data as T);
  }

  /**
   * Check if this model has a specific permission
   */
  protected can(permission: string): boolean {
    const key = `can${permission.charAt(0).toUpperCase()}${permission.slice(
      1
    )}`;
    return !!this.attributes[key];
  }

  /**
   * Get relationship IDs by name
   */
  getRelationshipIds(name: string): string[] {
    const relation = this.relationships?.[name]?.data;
    if (!relation) return [];

    if (Array.isArray(relation)) {
      return relation.map((item) => item.id);
    }

    return relation ? [relation.id] : [];
  }

  /**
   * Get a Date object from a date string in the attributes
   */
  protected getDate(field: keyof T['attributes']): Date | null {
    const value = this.attributes[field];
    return typeof value === 'string' ? new Date(value) : null;
  }

  /**
   * Check if this model has a specific relationship
   */
  protected hasRelationship(name: string): boolean {
    return !!this.relationships?.[name]?.data;
  }

  /**
   * Get all related model IDs of a specific type
   */
  protected getRelatedIds(type: string): string[] {
    const result: string[] = [];

    // Skip if no relationships
    if (!this.relationships) return result;

    // Search through all relationships for matching type
    Object.values(this.relationships).forEach((relationship) => {
      if (!relationship.data) return;

      if (Array.isArray(relationship.data)) {
        relationship.data.forEach((item) => {
          if (item.type === type) {
            result.push(item.id);
          }
        });
      } else if (relationship.data.type === type) {
        result.push(relationship.data.id);
      }
    });

    return result;
  }

  /**
   * Get the creation date if the model has one
   */
  getCreatedAt(): Date | null {
    return this.getDate('createdAt' as keyof T['attributes']);
  }

  /**
   * Get the last update date if the model has one
   */
  getUpdatedAt(): Date | null {
    return (
      this.getDate('updatedAt' as keyof T['attributes']) ||
      this.getDate('editedAt' as keyof T['attributes'])
    );
  }
}