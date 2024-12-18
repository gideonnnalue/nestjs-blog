import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(config: ConfigService): Promise<void> {
  // Create the connection datasource
  const AppDataSource = new DataSource({
    type: 'postgres',
    synchronize: config.get<boolean>('database.synchronize'),
    host: config.get<string>('database.host'),
    port: +config.get<number>('database.port'),
    username: config.get<string>('database.username'),
    password: config.get<string>('database.password'),
    database: config.get<string>('database.name'),
  });
  // Drop all tables
  await AppDataSource.dropDatabase();
  // close the connection
  await AppDataSource.destroy();
}
