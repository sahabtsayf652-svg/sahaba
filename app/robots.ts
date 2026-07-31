import { MetadataRoute } from 'next'

const BASE_URL = 'https://sahaba-r6ph-kum1z843v-sahabtsayf652-svgs-projects.vercel.app'

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
