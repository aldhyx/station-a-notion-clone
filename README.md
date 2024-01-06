## 🚀 Live demo:

For testing purpose only.
[station-proto.netlify.app](https://station-proto.netlify.app)

## 📦 Tech Stack

#### Frontend

- [NextJS](https://supabase.com)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)
- [Emoji Mart](https://github.com/missive/emoji-mart)
- etc, at the package.json file

#### Backend

- [Supabase](https://nextjs.org)

## 🎯 Features

- User Authentication ✅
- Mobile responsive ✅
- Dark & light mode ✅
- Search & trash ✅
- Expandable sidebar ✅
- Realtime sidebar ✅
- Block editor ✅
- Realtime editor ⏳
- Publishable ⏳

## Installation

To clone and run this application locally, you'll need Git, Docker & Node.js installed on your computer.

### Run supabase locally

Start supabase container on your local machine, to get your anon key and url for local development purpose

```bash
pnpm dlx supabase start
# or
npx supabase start
```

Please reference to the [Supabase cli doc](https://supabase.com/docs/guides/cli) for more instruction

### Run project locally

1. Clone the project

```bash
git clone git@github.com:fsaythanry/station-a-notion-clone.git
cd station-a-notion-clone
```

2. Create `.env.local` file in root directory

```bash

NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Install the app dependencies:

```bash
pnpm install
# or
npm install
# or
yarn
# or
```

2. Run the app:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

Distributed under the MIT license. See LICENSE for more information.
