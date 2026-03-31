# OutOfBox — Dependencies

## package.json (reference)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",

    "@google/generative-ai": "^0.15.0",

    "next-auth": "^5.0.0-beta",
    "@auth/prisma-adapter": "^2.0.0",

    "@prisma/client": "^5.14.0",

    "next-intl": "^3.14.0",

    "tailwindcss": "^3.4.0",
    "tailwind-merge": "^2.3.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",

    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",

    "framer-motion": "^11.2.0",

    "recharts": "^2.12.0",

    "web-push": "^3.6.0",

    "zod": "^3.23.0",

    "date-fns": "^3.6.0",

    "next-themes": "^0.3.0"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "@types/web-push": "^3.6.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

## Install command (after scaffolding)

```bash
npm install @google/generative-ai next-auth@beta @auth/prisma-adapter @prisma/client next-intl tailwind-merge clsx class-variance-authority framer-motion recharts web-push zod date-fns next-themes

npm install -D prisma @types/web-push prettier prettier-plugin-tailwindcss
```

## VAPID Key Generation

```bash
npx web-push generate-vapid-keys
```

## Prisma Setup

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```
