(() => {
    const existingSchema = document.querySelector('script[data-schema-source="generated-jsonld"]');
    if (existingSchema) {
        return;
    }

    const fallbackSiteUrl = 'https://www.mejoresvapers.es/';
    const text = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const makeAbsoluteUrl = (value, base = fallbackSiteUrl) => {
        if (!value) {
            return '';
        }

        try {
            return new URL(value, base).toString();
        } catch (error) {
            return '';
        }
    };

    const normalizeBaseUrl = (value) => {
        if (!value) {
            return fallbackSiteUrl;
        }

        try {
            const url = new URL(value);
            url.hash = '';
            url.search = '';
            return url.toString().endsWith('/') ? url.toString() : `${url.toString()}/`;
        } catch (error) {
            return fallbackSiteUrl;
        }
    };

    const siteUrl = (() => {
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        if (canonical) {
            return normalizeBaseUrl(canonical);
        }

        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return normalizeBaseUrl(window.location.origin);
        }

        return fallbackSiteUrl;
    })();

    const pageUrl = (() => {
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return window.location.href.split('#')[0];
        }

        return siteUrl;
    })();
    const pageTitle = document.title.trim();
    const siteName = text(document.title.split('|')[0]) || 'MejoresVapers.es';
    const metaDescription = document.querySelector('meta[name="description"]')?.content?.trim() || '';
    const inLanguage = (() => {
        const rawLang = text(document.documentElement.lang).toLowerCase();
        if (!rawLang) return 'es-ES';
        if (rawLang === 'es' || rawLang.startsWith('es-')) return 'es-ES';
        if (rawLang === 'pt' || rawLang.startsWith('pt-')) return 'pt-PT';
        if (rawLang === 'en' || rawLang.startsWith('en-')) return 'en';
        return rawLang;
    })();
    const websiteId = `${siteUrl}#website`;
    const organizationId = `${siteUrl}#organization`;
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    const collectionPageId = `${pageUrl}#collection-page`;
    const itemListId = `${pageUrl}#itemlist`;

    const badgePrimary = text(document.querySelector('.badge-text')?.textContent);
    const badgeSecondary = text(document.querySelector('.badge-sub')?.textContent);
    const organizationName = badgePrimary && badgeSecondary
        ? `${badgePrimary}${badgeSecondary}.es`
        : siteName;
    const logoUrl = makeAbsoluteUrl('favicon-96x96.png', siteUrl);
    const emailText = text(Array.from(document.querySelectorAll('.foot-cont-two p')).find((node) => node.textContent.includes('@'))?.textContent);
    const phoneText = text(Array.from(document.querySelectorAll('.foot-cont-two p')).find((node) => node.textContent.includes('+'))?.textContent);

    const products = Array.from(document.querySelectorAll('.product-section')).flatMap((section) => {
        const sectionTitle = text(section.querySelector('.section-title')?.textContent);
        const brandFromSection = sectionTitle.replace(/^Colecci\S*\s+/i, '').trim();
        const isMixedSection = sectionTitle.toLowerCase().includes('liquid');

        return Array.from(section.querySelectorAll('.product-card, .list-item')).map((card) => {
            const shortName = text(card.querySelector('h3')?.textContent);
            const link = makeAbsoluteUrl(card.querySelector('a[href]')?.getAttribute('href'), siteUrl);
            const image = makeAbsoluteUrl(card.querySelector('img')?.getAttribute('src'), pageUrl);
            const fullName = shortName;

            if (!shortName || !link) {
                return null;
            }

            const item = {
                '@type': 'Thing',
                '@id': `${link}#thing`,
                name: fullName,
                url: link
            };

            if (image) {
                item.image = image;
            }

            return item;
        }).filter(Boolean);
    }).slice(0, 12);

    const graph = [
        {
            '@type': 'Organization',
            '@id': organizationId,
            name: organizationName,
            url: siteUrl,
            logo: logoUrl,
            contactPoint: [
                emailText ? {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    email: emailText,
                    availableLanguage: [inLanguage]
                } : null,
                phoneText ? {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    telephone: phoneText,
                    availableLanguage: [inLanguage]
                } : null
            ].filter(Boolean)
        },
        {
            '@type': 'WebSite',
            '@id': websiteId,
            name: siteName,
            url: siteUrl,
            publisher: {
                '@id': organizationId
            },
            inLanguage: inLanguage
        },
        {
            '@type': 'BreadcrumbList',
            '@id': breadcrumbId,
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Inicio',
                    item: siteUrl
                }
            ]
        }
    ];

    const collectionPage = {
        '@type': 'CollectionPage',
        '@id': collectionPageId,
        url: pageUrl,
        name: pageTitle,
        inLanguage: inLanguage,
        isPartOf: {
            '@id': websiteId
        },
        breadcrumb: {
            '@id': breadcrumbId
        }
    };

    if (metaDescription) {
        collectionPage.description = metaDescription;
    }

    if (products.length > 0) {
        collectionPage.mainEntity = {
            '@id': itemListId
        };
    }

    graph.push(collectionPage);

    if (products.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': itemListId,
            name: pageTitle,
            numberOfItems: products.length,
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            itemListElement: products.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: item
            }))
        });
    }

    // TODO: Add page-specific FAQPage / BlogPosting / Product offer schema if dedicated templates
    // with visible FAQ blocks, article metadata, prices, or availability are added to this project.
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.dataset.schemaSource = 'generated-jsonld';
    jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph
    });

    document.head.appendChild(jsonLdScript);
})();
