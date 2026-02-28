# 🍜 Wanderbites — Food Travel Blog

![Wanderbites Food Travel Blog](https://imgix.cosmicjs.com/de4232f0-14e6-11f1-9559-f51d6633c622-photo-1569718212165-3a8278d5f624-1772311722349.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A stunning food travel blog built with Next.js 16 and powered by [Cosmic](https://www.cosmicjs.com). Explore culinary adventures across the globe — from Tokyo's ramen shops to Rome's hidden trattorias — with rich author profiles, photo galleries, star ratings, and regional filtering.

## Features

- 🌍 **Global Food Stories** — Browse posts by region (Asia, Europe, Americas, and more)
- ⭐ **Star Ratings** — Visual 1–5 star rating system for each destination
- 👨‍🍳 **Author Profiles** — Dedicated pages with bios, social links, and authored posts
- 🏷️ **Category Navigation** — Browse by cuisine type with hierarchical categories
- 🖼️ **Photo Galleries** — Beautiful image galleries for each food adventure
- 📱 **Fully Responsive** — Gorgeous on desktop, tablet, and mobile
- 🔍 **SEO Optimized** — Dynamic meta titles and descriptions from Cosmic
- 📝 **Markdown Content** — Rich article formatting with typography plugin

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=69a353dcc02439ab357851f4&clone_repository=69a35674c02439ab3578521e)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a prompt for AI to create a food travel blog with posts, authors, and categories"

### Code Generation Prompt

> "Build a Next.js website that uses my existing objects in this bucket"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [Cosmic](https://www.cosmicjs.com/docs) — Headless CMS for content management
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown support

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Cosmic](https://www.cosmicjs.com) account with the food travel blog content model

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wanderbites

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

### Environment Variables

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

## Cosmic SDK Examples

### Fetching Blog Posts with Related Objects

```typescript
import { cosmic } from '@/lib/cosmic'

// Fetch all published posts with author and category data
const { objects: posts } = await cosmic.objects
  .find({ type: 'blog-posts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Access nested author data
const authorName = posts[0].metadata.author.title
const authorAvatar = posts[0].metadata.author.metadata.avatar.imgix_url
```

### Fetching a Single Post by Slug

```typescript
const { object: post } = await cosmic.objects
  .findOne({ type: 'blog-posts', slug: 'ultimate-ramen-guide-tokyo' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application uses three Cosmic object types:

| Object Type | Description | Key Fields |
|---|---|---|
| **Blog Posts** | Food travel articles | excerpt, featured_image, gallery, content, rating, region, tags, author, categories |
| **Authors** | Content writers | name, avatar, short_bio, extended_bio, social links |
| **Categories** | Cuisine types | name, description, image, parent_category |

All content is fetched server-side using the [Cosmic SDK](https://www.cosmicjs.com/docs) with `depth(1)` to resolve connected objects (authors and categories) in a single query.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import the repository on [Netlify](https://netlify.com)
3. Set the build command to `bun run build`
4. Add environment variables in the Netlify dashboard
5. Deploy!

<!-- README_END -->