import type { FlarumAPIClient } from '../client';
import type { ApiResponse, ApiResource, RequestOptions } from '../types';
import type { Model } from '../models/model';

export abstract class Resource<
  TResource extends ApiResource = ApiResource,
  TModel extends Model = Model
> {
  protected client: FlarumAPIClient;
  protected resourceType: string;
  protected modelClass: new (client: FlarumAPIClient, data: TResource) => TModel;
  
  constructor(
    client: FlarumAPIClient, 
    resourceType: string,
    modelClass: new (client: FlarumAPIClient, data: TResource) => TModel
  ) {
    this.client = client;
    this.resourceType = resourceType;
    this.modelClass = modelClass;
  }

  /**
   * Transform API response to model instance(s)
   */
  protected transformResponse(data: ApiResponse<TResource>): TModel | TModel[] {
    if (Array.isArray(data.data)) {
      return data.data.map(item => new this.modelClass(this.client, item));
    }
    return new this.modelClass(this.client, data.data as TResource);
  }

  /**
   * Get a single resource by ID
   */
  async get(id: string, options: RequestOptions = {}): Promise<TModel> {
    const response = await this.client.request<ApiResponse<TResource>>(
      `${this.resourceType}/${id}`,
      options
    );
    
    const transformed = this.transformResponse(response);
    return Array.isArray(transformed) ? transformed[0] : transformed;
  }

  /**
   * Get all resources
   */
  async getAll(options: RequestOptions = {}): Promise<TModel[]> {
    const response = await this.client.request<ApiResponse<TResource>>(
      this.resourceType,
      options
    );
    
    const transformed = this.transformResponse(response);
    return Array.isArray(transformed) ? transformed : [transformed];
  }

  /**
   * Create a resource with the given attributes and relationships
   */
  async create(
    attributes: Partial<TResource['attributes']>,
    relationships?: Partial<TResource['relationships']>
  ): Promise<TModel> {
    const payload: any = {
      data: {
        type: this.resourceType,
        attributes
      }
    };
    
    if (relationships) {
      payload.data.relationships = relationships;
    }
    
    const response = await this.client.request<ApiResponse<TResource>>(
      this.resourceType, 
      {
        method: 'POST',
        body: payload
      }
    );
    
    const transformed = this.transformResponse(response);
    return Array.isArray(transformed) ? transformed[0] : transformed;
  }
}