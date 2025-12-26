import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from '../category/entities/category.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'inventory_pos',
  entities: [Category],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
