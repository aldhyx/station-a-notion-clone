This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Init supabase

You need to init supabase in this local project using

```bash
pnpm dlx supabase init
# or
npx supabase init
```

Then, Linking this project to supabase

```bash
pnpm dlx supabase link --project-ref <your-project-ref>
# or
npx supabase init --project-ref <your-project-ref>
```

Then generate database public schema types

```bash
pnpm dlx supabase gen types typescript --linked --schema public > <path-to-your-db-type-file>
# or
npx supabase gen types typescript --linked --schema public > <path-to-your-db-type-file>
```

Please reference to the [Supabase CLI docs](https://supabase.com/docs/reference/cli/introduction) for more instruction
