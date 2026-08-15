import type { CollectionConfig } from 'payload';

export type SiteActivityLogData = {
  title: string;
  operation: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resourceName?: string;
  resourceType: 'collection' | 'global';
  collectionLabel?: string;
  slug: string;
  documentId?: string;
  locale?: string;
  user?: string | number;
  userEmail?: string;
  userDisplay?: string;
  createdAt?: string;
};

export const SITE_ACTIVITY_SLUG = 'site-activity';

export const SiteActivityCollection: CollectionConfig = {
  slug: SITE_ACTIVITY_SLUG,
  labels: {
    plural: 'Site Activities',
    singular: 'Site Activity',
  },
  admin: {
    defaultColumns: ['title', 'operation', 'resourceName', 'collectionLabel', 'userDisplay', 'createdAt'],
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'operation',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'resourceName',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Global', value: 'global' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collectionLabel',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'documentId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'locale',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userEmail',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userDisplay',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
  ],
  timestamps: false,
};

export default SiteActivityCollection;
