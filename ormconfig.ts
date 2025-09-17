import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'mydatabase',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin123',
  entities: [User],
  synchronize: true, // will commit changed to db (good for development)
};

export default config;
