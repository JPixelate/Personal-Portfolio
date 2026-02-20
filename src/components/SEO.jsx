import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const name = 'Jonald Penpillo';
    const siteName = 'Jonald Penpillo Portfolio';
    const siteUrl = 'https://penpillo-portfolio.vercel.app';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Senior Full-Stack Developer & AI Solutions Architect`;
    
    // 3rd Person Perspective for AI/GEO
    const defaultDescription = 'Jonald Penpillo is a high-performance Full-Stack Developer specializing in digital architecture, autonomous AI workflows, and enterprise-grade systems based in the Philippines. He builds scalable, business-critical engines that drive modern innovation.';
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || 'Jonald Penpillo, penpillo.j, Full-Stack Developer Philippines, AI Automation Expert, Web Architecture, n8n workflows, React Developer, PHP CodeIgniter, Digital Transformation, Software Engineer General Santos City';
    const finalImage = image || `${siteUrl}/og-image.jpg?v=2`;
    const finalUrl = url || window.location.href;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Tags
        const updateMeta = (name, content, attr = 'name') => {
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (element) {
                element.setAttribute('content', content);
            } else {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                element.setAttribute('content', content);
                document.head.appendChild(element);
            }
        };

        // Canonical Link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', finalUrl);
        } else {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', finalUrl);
            document.head.appendChild(canonical);
        }

        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        updateMeta('author', name);
        updateMeta('robots', 'index, follow');
        updateMeta('googlebot', 'index, follow');

        // Open Graph
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', finalDescription, 'property');
        updateMeta('og:image', finalImage, 'property');
        updateMeta('og:url', finalUrl, 'property');
        updateMeta('og:type', 'website', 'property');
        updateMeta('og:site_name', siteName, 'property');
        updateMeta('og:locale', 'en_US', 'property');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', finalDescription);
        updateMeta('twitter:image', finalImage);
        updateMeta('twitter:site', '@h4kuna_11');

    }, [fullTitle, finalDescription, finalKeywords, finalImage, finalUrl]);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                "name": name,
                "jobTitle": "Full-Stack Software Developer & AI Solutions Architect",
                "description": finalDescription,
                "url": siteUrl,
                "image": `${siteUrl}/uss52.webp`,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "General Santos City",
                    "addressRegion": "South Cotabato",
                    "addressCountry": "PH"
                },
                "sameAs": [
                    "https://www.linkedin.com/in/jonald-penpillo",
                    "https://www.instagram.com/h4kuna_11/",
                    "https://github.com/JPixelate"
                ],
                "knowsAbout": [
                    "Full-Stack Development",
                    "AI Automation",
                    "Workflow Engineering",
                    "React.js",
                    "PHP CodeIgniter",
                    "n8n",
                    "Digital Architecture",
                    "System Scaling",
                    "Database Engineering"
                ]
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": siteName,
                "publisher": { "@id": `${siteUrl}/#person` },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteUrl}/#section-projects?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "WebPage",
                "@id": `${finalUrl}/#webpage`,
                "url": finalUrl,
                "name": fullTitle,
                "description": finalDescription,
                "isPartOf": { "@id": `${siteUrl}/#website` },
                "about": { "@id": `${siteUrl}/#person` },
                "breadcrumb": {
                    "@id": `${finalUrl}/#breadcrumb`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${finalUrl}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "item": {
                            "@id": siteUrl,
                            "name": "Home"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "item": {
                            "@id": finalUrl,
                            "name": title || "Overview"
                        }
                    }
                ]
            }
        ]
    };

    return (
        <React.Fragment>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </React.Fragment>
    );
};

export default SEO;

