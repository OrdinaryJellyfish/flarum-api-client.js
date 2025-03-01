import { FlarumAPIClient } from '../src/client';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

describe('FlarumAPIClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('constructor', () => {
    test('should handle URL with only hostname', () => {
      const client = new FlarumAPIClient('https://example.com');
      expect((client as any).baseUrl).toBe('https://example.com/api/');
    });

    test('should handle URL with custom path', () => {
      const client = new FlarumAPIClient('https://example.com/custom-path');
      expect((client as any).baseUrl).toBe('https://example.com/custom-path/');
    });

    test('should handle URL with trailing slash', () => {
      const client = new FlarumAPIClient('https://example.com/');
      expect((client as any).baseUrl).toBe('https://example.com/api/');
    });

    test('should initialize resources', () => {
      const client = new FlarumAPIClient('https://example.com');
      expect(client.users).toBeDefined();
      expect(client.discussions).toBeDefined();
      expect(client.tags).toBeDefined();
    });
  });

  describe('setToken', () => {
    test('should set the token', () => {
      const client = new FlarumAPIClient('https://example.com');
      client.setToken('test-token');
      expect((client as any).token).toBe('test-token');
    });
  });

  describe('request', () => {
    test('should make a GET request with correct headers', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      await client.request('discussions');
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/api/discussions');
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
        'Accept': 'application/json'
      });
    });

    test('should include authorization header when token is set', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      client.setToken('test-token');
      await client.request('discussions');
      
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
        'Accept': 'application/json',
        'Authorization': 'Token test-token'
      });
    });

    test('should handle include parameter', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      await client.request('discussions', { include: ['user', 'tags'] });
      
      expect(fetchMock.mock.calls[0][0]).toContain('include=user%2Ctags');
    });

    test('should handle filters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      await client.request('discussions', { 
        filter: { q: 'test', solved: true } 
      });
      
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('filter%5Bq%5D=test');
      expect(url).toContain('filter%5Bsolved%5D=true');
    });

    test('should handle pagination with number', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      await client.request('discussions', { page: 5 });
      
      expect(fetchMock.mock.calls[0][0]).toContain('page%5Bnumber%5D=5');
    });

    test('should handle pagination with object', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
      
      const client = new FlarumAPIClient('https://example.com');
      await client.request('discussions', { 
        page: { number: 5, limit: 20 } 
      });
      
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('page%5Bnumber%5D=5');
      expect(url).toContain('page%5Blimit%5D=20');
    });

    test('should handle POST request with body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: { type: 'discussions', id: '1' } }));
      
      const client = new FlarumAPIClient('https://example.com');
      const body = { data: { type: 'discussions', attributes: { title: 'Test' } } };
      await client.request('discussions', { method: 'POST', body });
      
      expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
      expect(fetchMock.mock.calls[0][1]?.body).toBe(JSON.stringify(body));
    });

    test('should throw error on non-2xx response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ errors: [{ status: '404', title: 'Not Found' }] }), { status: 404 });
      
      const client = new FlarumAPIClient('https://example.com');
      await expect(client.request('nonexistent')).rejects.toThrow('API request failed: 404 Not Found');
    });

    test('should return null for 204 responses', async () => {
      fetchMock.mockResponseOnce('', { status: 204 });
      
      const client = new FlarumAPIClient('https://example.com');
      const result = await client.request('discussions/1', { method: 'DELETE' });
      
      expect(result).toBeNull();
    });
  });
});