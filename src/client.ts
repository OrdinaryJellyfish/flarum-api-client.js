import { RequestOptions, FlarumAPIClientConfig } from './types';
import { UserResource } from './resources/user';
import { DiscussionResource } from './resources/discussion';
import { TagResource } from './resources/tag';

export class FlarumAPIClient {
  private baseUrl: string;
  private token: string | null = null;

  // Resource instances
  public users: UserResource;
  public discussions: DiscussionResource;
  public tags: TagResource;

  constructor(url: string | URL, config: FlarumAPIClientConfig = {}) {
    // Process the input URL
    const parsedUrl = url instanceof URL ? url : new URL(url);

    // Create baseUrl with proper path handling
    this.baseUrl = parsedUrl.toString();

    // Ensure trailing slash for consistent path joining
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }

    // If the URL is just the hostname without a path (or only '/'), add 'api/'
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
      this.baseUrl += 'api/';
    }

    if (config.token) {
      this.token = config.token;
    }

    // Initialize resources
    this.users = new UserResource(this);
    this.discussions = new DiscussionResource(this);
    this.tags = new TagResource(this);
  }

  /**
   * Set the API token for authenticated requests.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Create and set an API token with user credentials.
   */
  async createToken(username: string, password: string): Promise<void> {
    const response = await this.request('token', {
      method: 'POST',
      body: { identification: username, password }
    });

    this.setToken(response.token);
  }

  /**
   * Get the authorization headers for API requests
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    return headers;
  }

  /**
   * Universal fetch method for making API requests
   *
   * @param endpoint API endpoint path (without base URL)
   * @param options Request options
   * @returns Promise with the API response
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // Remove 'api/' prefix if present in endpoint since it's already in baseUrl when needed
    const cleanEndpoint = endpoint.startsWith('api/')
      ? endpoint.slice(4)
      : endpoint;

    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);
    const method = options.method || 'GET';

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Add include parameter
    if (options.include?.length) {
      url.searchParams.append('include', options.include.join(','));
    }

    // Add sparse fieldsets
    if (options.fields) {
      Object.entries(options.fields).forEach(([type, fields]) => {
        url.searchParams.append(`fields[${type}]`, fields.join(','));
      });
    }

    // Add sorting
    if (options.sort) {
      url.searchParams.append('sort', options.sort);
    }

    // Add filters
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        url.searchParams.append(`filter[${key}]`, String(value));
      });
    }

    // Add pagination
    if (options.page) {
      if (typeof options.page === 'number') {
        url.searchParams.append('page[number]', String(options.page));
      } else {
        if (options.page.number !== undefined) {
          url.searchParams.append('page[number]', String(options.page.number));
        }
        if (options.page.limit !== undefined) {
          url.searchParams.append('page[limit]', String(options.page.limit));
        }
        if (options.page.offset !== undefined) {
          url.searchParams.append('page[offset]', String(options.page.offset));
        }
      }
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: this.getHeaders()
    };

    // Add body for POST, PATCH requests
    if (options.body && (method === 'POST' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    // Make the request
    const response = await fetch(url.toString(), fetchOptions);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}${
          errorData ? `\n${JSON.stringify(errorData)}` : ''
        }`
      );
    }

    // Return parsed JSON for everything except 204 No Content
    return response.status === 204 ? (null as T) : response.json();
  }
}
