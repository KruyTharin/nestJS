import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Inject } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import qdrantConfig from 'src/config/qdrant.config';

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client: QdrantClient;

  constructor(
    @Inject(qdrantConfig.KEY)
    private readonly config: ConfigType<typeof qdrantConfig>,
  ) {
    this.client = new QdrantClient({
      url: config.url,
      //   apiKey: config.apiKey,
    });
  }

  async onModuleInit() {
    try {
      await this.client.getCollections();
      this.logger.log(`Connected to Qdrant at ${this.config.url}`);
    } catch (error) {
      this.logger.error(
        `Failed to connect to Qdrant at ${this.config.url}: ${error.message}`,
      );
    }
  }

  getClient() {
    return this.client;
  }

  async createCollection(collectionName: string, vectorSize: number) {
    const collections = await this.client.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === collectionName,
    );

    if (!collectionExists) {
      const res = await this.client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      });

      console.log(res);

      this.logger.log(`Created Qdrant collection: ${collectionName}`);
      return res;
    } else {
      this.logger.error(`Qdrant collection already exists: ${collectionName}`);
    }
  }

  async addVectors(collectionName: string, points: any) {
    const operationInfo = await this.client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: 1,
          vector: [0.05, 0.61, 0.76, 0.74],
          payload: { city: 'Berlin' },
        },
        {
          id: 2,
          vector: [0.19, 0.81, 0.75, 0.11],
          payload: { city: 'London' },
        },
        {
          id: 3,
          vector: [0.36, 0.55, 0.47, 0.94],
          payload: { city: 'Moscow' },
        },
        {
          id: 4,
          vector: [0.18, 0.01, 0.85, 0.8],
          payload: { city: 'New York' },
        },
        {
          id: 5,
          vector: [0.24, 0.18, 0.22, 0.44],
          payload: { city: 'Beijing' },
        },
        {
          id: 6,
          vector: [0.35, 0.08, 0.11, 0.44],
          payload: { city: 'Mumbai' },
        },
      ],
    });

    console.debug(operationInfo);
    return operationInfo;
  }

  async searchVectors(collectionName: string, queryVector: number[], topK = 3) {
    console.log('called');

    const searchResult = await this.client.search(collectionName, {
      vector: queryVector,
      limit: topK,
    });

    console.log('Search results:', searchResult);
    return searchResult;
  }
}
