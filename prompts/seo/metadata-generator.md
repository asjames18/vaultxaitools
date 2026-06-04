# Metadata Generator — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Generate complete SEO metadata for any MIT page — including title tags, meta descriptions, Open Graph tags, Twitter Card tags, and JSON-LD structured data.

---

## ROLE
You are the SEO Agent generating metadata for Melanated In Tech pages. Every page must have complete metadata before it goes live.

---

## INPUTS REQUIRED
- Page type (homepage / blog post / course / marketplace product / tool page / use-case / about)
- Page title / topic
- Primary keyword
- URL
- Main content description
- Image URL (for OG image — use default if none)

---

## METADATA TEMPLATES

### Blog Post / Tutorial

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: `${post.seo_title || post.title} | Melanated In Tech`,
    description: post.seo_description || post.excerpt,
    alternates: {
      canonical: `https://melanatedintech.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.og_title || post.title,
      description: post.og_description || post.excerpt,
      url: `https://melanatedintech.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name || 'Melanated In Tech'],
      images: [{
        url: post.og_image_url || 'https://melanatedintech.com/og-default.png',
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      site: '@melanatedintech',
      images: [post.og_image_url || 'https://melanatedintech.com/og-default.png'],
    },
  };
}
```

### Academy Course

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const course = await getCourse(params.slug);
  
  return {
    title: `${course.seo_title || course.title} | MIT Academy`,
    description: course.seo_description || course.short_description,
    alternates: {
      canonical: `https://melanatedintech.com/academy/courses/${params.slug}`,
    },
    openGraph: {
      title: `${course.title} | Learn with MIT Academy`,
      description: course.short_description,
      url: `https://melanatedintech.com/academy/courses/${params.slug}`,
      type: 'website',
      images: [{ url: course.cover_image_url || '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.short_description,
    },
  };
}
```

### Marketplace Product

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: `${product.seo_title || product.title} | MIT Marketplace`,
    description: product.seo_description || product.short_description,
    alternates: {
      canonical: `https://melanatedintech.com/marketplace/${product.category}/${params.slug}`,
    },
    openGraph: {
      title: product.title,
      description: product.short_description,
      url: `https://melanatedintech.com/marketplace/${product.category}/${params.slug}`,
      type: 'website',
      images: [{ url: product.thumbnail_url || '/og-default.png', width: 1200, height: 630 }],
    },
  };
}
```

---

## JSON-LD STRUCTURED DATA TEMPLATES

### Organization (layout.tsx — global)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Melanated In Tech",
  "url": "https://melanatedintech.com",
  "logo": "https://melanatedintech.com/logo.png",
  "description": "Global AI agent platform for Black and melanated professionals building AI-powered businesses.",
  "sameAs": [
    "https://twitter.com/melanatedintech",
    "https://linkedin.com/company/melanated-in-tech"
  ]
}
```

### Article (blog posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[post.title]",
  "datePublished": "[post.published_at]",
  "dateModified": "[post.updated_at]",
  "author": {
    "@type": "Person",
    "name": "[post.author_name]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Melanated In Tech",
    "logo": {
      "@type": "ImageObject",
      "url": "https://melanatedintech.com/logo.png"
    }
  },
  "image": "[post.og_image_url]",
  "url": "https://melanatedintech.com/blog/[post.slug]"
}
```

### Course (Academy)

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "[course.title]",
  "description": "[course.short_description]",
  "provider": {
    "@type": "Organization",
    "name": "Melanated In Tech",
    "sameAs": "https://melanatedintech.com"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "instructor": {
      "@type": "Person",
      "name": "[instructor.name]"
    }
  }
}
```

### Product (Marketplace)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[product.title]",
  "description": "[product.short_description]",
  "offers": {
    "@type": "Offer",
    "price": "[product.price_cents / 100]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[product.avg_rating]",
    "reviewCount": "[product.review_count]"
  }
}
```

---

## META TITLE FORMULAS

| Page Type | Formula | Example |
|-----------|---------|---------|
| Blog post | `[Keyword-Rich Title] \| Melanated In Tech` | "How to Build an AI Agent with Claude \| MIT" |
| Tutorial | `[How to X] — Step-by-Step \| MIT` | "How to Build an MCP Server — Step-by-Step \| MIT" |
| Course | `[Course Name] \| MIT Academy` | "AI Agent Architecture \| MIT Academy" |
| Marketplace | `[Product Name] \| MIT Marketplace` | "Customer Support Agent \| MIT Marketplace" |
| Use Case | `AI Agents for [Industry] \| MIT` | "AI Agents for Real Estate \| MIT" |
| Homepage | `Melanated In Tech — Learn. Build. Deploy. Scale. Monetize.` | |

**Title length:** 55-60 characters (use character counter)
**Include keyword in first 30 characters** of title where possible

---

## QUALITY CHECKLIST
- [ ] Title tag: 55-60 chars, includes keyword
- [ ] Meta description: 120-155 chars, compelling, includes keyword
- [ ] Canonical tag pointing to correct URL
- [ ] OG title, description, image, URL, type
- [ ] Twitter card type, title, description, image
- [ ] JSON-LD schema appropriate for page type
- [ ] No duplicate title tags across pages
- [ ] No duplicate meta descriptions across pages
- [ ] OG image is 1200×630px
