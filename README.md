# 📦 Payload Loggs (`payload-loggs`)

**Payload Loggs** is a fast, zero-config plugin for [Payload CMS](https://payloadcms.com) that provides **high-level site activity feeds, security auditing, and event tracking**.

Designed for developers and teams, `payload-loggs` automatically records human-readable activity feeds (`"Page created"`, `"Page modified"`, `"Global Header V2 updated"`), attributes user actions with email shortforms (e.g., `rushikesh.s`), retains 30 days of activity data with automated daily cleanup at 00:01 AM, and enforces strict read-only audit access control.

---

## ⚡ Key Features

- 🚀 **Zero-Config Plug-and-Play**: Automatically tracks all collections & globals out-of-the-box without requiring tedious manual configuration.
- 📋 **High-Level Activity Feed**: Stores clean, human-readable activity titles (`"Page created"`, `"Page modified"`, `"Global Header V2 updated"`), resource names, collection labels, and document IDs.
- 👤 **Shortform Email Attribution**: Formats user emails into clean display names (`rushikesh.s@brandlift.com` $\rightarrow$ `rushikesh.s`) while linking the user relationship and full email.
- 🧹 **Automated 30-Day Cleanup**: Automatically runs a background cleanup job daily at 00:01 AM (`1 0 * * *`) retaining the last 30 days of site activity and purging older logs.
- 🔒 **Strict Read-Only Protection**: Entire `site-activity` collection is read-only in Admin UI & API (`create`, `update`, `delete` disabled). Log cleanup is handled strictly via automated background tasks.
- 🌍 **Localization Support**: Automatically detects and records document locales when Payload localization is enabled.
- 🛡️ **Payload 3.0 Loop Prevention**: Uses atomic `req` context threading (`skipLogs: true`) to prevent infinite recursion loops.

---

## ⚙️ Installation & Usage

Install with your preferred package manager:

```bash
pnpm add payload-loggs

# or

npm install payload-loggs
```

Then, register the plugin in your `payload.config.ts`:

```ts
import { buildConfig } from 'payload'
import { siteActivity } from 'payload-loggs'

export default buildConfig({
  // ... your collections & globals ...
  plugins: [
    siteActivity(), // Zero-config: tracks all collections & globals automatically!
  ],
})
```

---

## 🔧 Granular Configuration (Optional)

You can selectively configure tracking if you want to filter specific collections or custom cleanup rules:

```ts
import { siteActivity } from 'payload-loggs'

export default buildConfig({
  plugins: [
    siteActivity({
      automation: {
        logCleanup: {
          cronTime: '1 0 * * *', // Runs daily at 00:01 AM (default)
          olderThan: 2592000000, // Retains 30 days of logs in milliseconds (default)
        },
      },
      collections: {
        track: [
          { slug: 'pages' },
          { slug: 'posts' },
        ],
      },
      globals: {
        track: [
          { slug: 'header' },
        ],
      },
    }),
  ],
})
```

---

## 📄 License

[MIT License](./LICENSE) - Copyright (c) 2026 Rushikesh Shinde
