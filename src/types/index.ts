/**
 * Common interfaces for Flarum API resources and responses
 */

/**
 * Base JSON:API resource interface
 */
export interface ApiResource {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<string, {
    data: { type: string; id: string }[] | { type: string; id: string } | null;
  }>;
}

/**
 * JSON:API response format
 */
export interface ApiResponse<T extends ApiResource = ApiResource> {
  data: T | T[];
  included?: ApiResource[];
  links?: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
  meta?: Record<string, any>;
}

/**
 * Request options for Flarum API
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  params?: Record<string, string | number | boolean | string[]>;
  body?: any;
  include?: string[];
  fields?: Record<string, string[]>;
  sort?: string;
  filter?: Record<string, string | number | boolean>;
  page?: number | { offset?: number; limit?: number; number?: number };
}

/**
 * Configuration options for Flarum API Client
 */
export interface FlarumAPIClientConfig {
  token?: string;
}