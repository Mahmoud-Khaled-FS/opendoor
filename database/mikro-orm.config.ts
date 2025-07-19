import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver, type Options } from '@mikro-orm/postgresql';
import { Config } from '../src/config';
import { defineConfig } from '@mikro-orm/core';

const config: Options = defineConfig({
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,
  dbName: Config.db.name,
  user: Config.db.user,
  password: Config.db.password,
  host: Config.db.host,
  port: +Config.db.port,
  migrations: {
    path: process.cwd() + '/database/migrations',
  },
  seeder: {
    path: process.cwd() + '/database/seeders',
  },

  // folder-based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  extensions: []
});

export default config;
