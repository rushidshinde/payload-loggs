/* eslint-disable node/prefer-global/process */
import sharp from 'sharp';
import path from 'node:path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';
import { siteActivity } from '@brandlift/payload-loggs';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { navigation } from './globals/Nav.js';
import { media } from './collections/Media.js';
import { users } from './collections/Users.js';
import { testEmailAdapter } from './helpers/testEmailAdapter.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname;
}

export default buildConfig({
  admin: { importMap: { baseDir: path.resolve(dirname) } },
  collections: [media, users],
  globals: [navigation],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  // plugins
  plugins: [
    siteActivity({
      configureRootCollection: (collection) => {
        const newCollection = {
          ...collection,
          fields: [
            ...collection.fields,
            {
              name: 'new-fields',
              type: 'text',
              defaultValue: 'test new fields value',
            },
          ],
        } as CollectionConfig;
        return newCollection;
      },
      globals: {
        track: [
          {
            slug: 'navigation',
          },
        ],
      },
      collections: {
        track: [
          {
            slug: 'media',
          },
          {
            slug: 'users',
          },
        ],
      },
    }),
  ],

  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.hidden = false;
      return defaultJobsCollection;
    },
  },
});
