import { MetadataRoute } from 'next'

const BASE_URL = 'https://13000-i8n4pzjyoyl2qsyclcx9g-8f57ffe2.preview.happyseeds.space'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/explore', '/ideas/', '/users/'],
        disallow: ['/dashboard/', '/profile/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
