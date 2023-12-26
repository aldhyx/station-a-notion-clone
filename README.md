## 🚀 Live demo:

[station-proto.netlify.app](https://station-proto.netlify.app)

## 📦 Tech Stack

#### Frontend

- [NextJS](https://supabase.com)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)
- [Usehooks-ts](https://github.com/juliencrn/usehooks-ts)
- [Sonner](https://github.com/emilkowalski/sonner)
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
- Drag n drop sidebar ⏳
- Image gallery with upload image support ✅
- Block editor ⏳
- Realtime editor ⏳
- Publishable ⏳

## Installation

To clone and run this application locally, you'll need Git & Node.js installed on your computer.

### Setup supabase

> \*I'm still working on this

Please reference to the [Supabase docs](https://supabase.com/docs) for more instruction

### Setup project locally

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
