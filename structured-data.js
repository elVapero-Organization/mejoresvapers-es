(() => {
    const existingSchema = document.querySelector('script[data-schema-source="generated-jsonld"]');
    if (existingSchema) {
        return;
    }

    const fallbackSiteUrl = 'https://www.elvapero.es/';
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

    const pageUrl = (() => {
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return window.location.href.split('#')[0];
        }

        return fallbackSiteUrl;
    })();
    const pageTitle = document.title.trim();
    const siteName = text(document.title.split('|')[0]) || 'MejoresVapers.es';
    const metaDescription = document.querySelector('meta[name="description"]')?.content?.trim() || '';
    const inLanguage = document.documentElement.lang ? `${document.documentElement.lang}-ES` : 'es-ES';
    const websiteId = `${fallbackSiteUrl}#website`;
    const organizationId = `${fallbackSiteUrl}#organization`;
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    const webpageId = `${pageUrl}#webpage`;
    const itemListId = `${pageUrl}#itemlist`;

    const badgePrimary = text(document.querySelector('.badge-text')?.textContent);
    const badgeSecondary = text(document.querySelector('.badge-sub')?.textContent);
    const organizationName = badgePrimary && badgeSecondary
        ? `${badgePrimary}${badgeSecondary}.es`
        : siteName;
    const logoUrl = makeAbsoluteUrl('favicon-96x96.png', fallbackSiteUrl);
    const emailText = text(Array.from(document.querySelectorAll('.foot-cont-two p')).find((node) => node.textContent.includes('@'))?.textContent);
    const phoneText = text(Array.from(document.querySelectorAll('.foot-cont-two p')).find((node) => node.textContent.includes('+'))?.textContent);

    const products = Array.from(document.querySelectorAll('.product-section')).flatMap((section) => {
        const sectionTitle = text(section.querySelector('.section-title')?.textContent);
        const brandFromSection = sectionTitle.replace(/^Colecci\S*\s+/i, '').trim();
        const isMixedSection = sectionTitle.toLowerCase().includes('liquid');

        return Array.from(section.querySelectorAll('.product-card, .list-item')).map((card) => {
            const shortName = text(card.querySelector('h3')?.textContent);
            const link = makeAbsoluteUrl(card.querySelector('a[href]')?.getAttribute('href'), fallbackSiteUrl);
            const image = makeAbsoluteUrl(card.querySelector('img')?.getAttribute('src'), pageUrl);
            const description = text(card.querySelector('.product-desc, .item-details p, p')?.textContent);
            const inferredBrand = isMixedSection ? shortName.split(/\s+/)[0] : brandFromSection;
            const brand = text(inferredBrand);
            const fullName = brand && !shortName.toLowerCase().startsWith(brand.toLowerCase())
                ? `${brand} ${shortName}`
                : shortName;

            if (!shortName || !link) {
                return null;
            }

            const product = {
                '@type': 'Product',
                '@id': `${link}#product`,
                name: fullName,
                url: link
            };

            if (image) {
                product.image = image;
            }

            if (description) {
                product.description = description;
            }

            if (brand) {
                product.brand = {
                    '@type': 'Brand',
                    name: brand
                };
            }

            if (sectionTitle) {
                product.category = sectionTitle;
            }

            return product;
        }).filter(Boolean);
    }).slice(0, 12);

    const graph = [
        {
            '@type': 'OnlineStore',
            '@id': organizationId,
            name: organizationName,
            url: fallbackSiteUrl,
            logo: logoUrl,
            areaServed: 'ES',
            availableLanguage: ['es-ES'],
            contactPoint: [
                emailText ? {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    email: emailText,
                    availableLanguage: ['es-ES'],
                    areaServed: 'ES'
                } : null,
                phoneText ? {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    telephone: phoneText,
                    availableLanguage: ['es-ES'],
                    areaServed: 'ES'
                } : null
            ].filter(Boolean)
        },
        {
            '@type': 'WebSite',
            '@id': websiteId,
            name: siteName,
            url: fallbackSiteUrl,
            inLanguage
        },
        {
            '@type': 'BreadcrumbList',
            '@id': breadcrumbId,
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Inicio',
                    item: fallbackSiteUrl
                }
            ]
        }
    ];

    const webpage = {
        '@type': 'CollectionPage',
        '@id': webpageId,
        url: pageUrl,
        name: pageTitle,
        isPartOf: {
            '@id': websiteId
        },
        about: {
            '@id': organizationId
        },
        breadcrumb: {
            '@id': breadcrumbId
        },
        inLanguage
    };

    if (metaDescription) {
        webpage.description = metaDescription;
    }

    if (products.length > 0) {
        webpage.mainEntity = {
            '@id': itemListId
        };
    }

    graph.push(webpage);

    if (products.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': itemListId,
            name: 'Productos destacados',
            numberOfItems: products.length,
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: product.url,
                name: product.name,
                item: product
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
