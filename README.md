# Flarum API Client

A modern, fully-typed JavaScript client for the Flarum API. Works in both Node.js and browser environments.

## Installation

```bash
# Using pnpm
pnpm add flarum-api-client
```

## Usage

```js
import FlarumAPIClient, { BaseResource } from 'flarum-api-client';

const client = new FlarumAPIClient('https://your-flarum-instance.com', {
  token: 'your-optional-api-token'
});

// Get recent discussions
client.discussions.getAll().then(discussions => {
  console.log(discussions);
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
