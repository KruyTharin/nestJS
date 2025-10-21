import { registerAs } from '@nestjs/config';

export default registerAs('qdrant', () => ({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY || undefined,
}));
