const BASE_URL = 'https://sahaba-r6ph-kum1z843v-sahabtsayf652-svgs-projects.vercel.app'

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'سحابة',
    alternateName: 'Sahaba',
    url: BASE_URL,
    description: 'منصة عربية لحماية الأفكار الإبداعية والروايات مع توثيق الملكية الفكرية',
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'سحابة',
    url: BASE_URL,
    description: 'منصة عربية لحماية الأفكار الإبداعية وتوثيق الملكية الفكرية',
    foundingDate: '2024',
    inLanguage: 'ar',
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
