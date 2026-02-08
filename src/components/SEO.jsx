import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const name = 'Jonald Penpillo';
    const siteName = 'Jonald Penpillo Portfolio';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Full-Stack Developer & AI Solutions Architect`;
    
    // 3rd Person Perspective for AI/GEO
    const defaultDescription = 'Jonald Penpillo is a high-performance Full-Stack Developer specializing in digital architecture, autonomous AI workflows, and enterprise-grade systems. He builds the scalable engines that drive modern business innovation.';
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || 'Jonald Penpillo, Full-Stack Developer, AI Automation, Web Architecture, n8n workflows, React Developer, PHP CodeIgniter, Digital Transformation, Philippines Developer';
    const finalImage = image || 'https://penpillo.j/og-image.jpg'; 
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

        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        updateMeta('author', name);

        // Open Graph
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', finalDescription, 'property');
        updateMeta('og:image', finalImage, 'property');
        updateMeta('og:url', finalUrl, 'property');
        updateMeta('og:type', 'website', 'property');
        updateMeta('og:site_name', siteName, 'property');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', finalDescription);
        updateMeta('twitter:image', finalImage);

    }, [fullTitle, finalDescription, finalKeywords, finalImage, finalUrl]);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://penpillo.j/#person",
                "name": name,
                "jobTitle": "Full-Stack Software Developer & AI Solutions Architect",
                "description": finalDescription,
                "url": "https://penpillo.j",
                "sameAs": [
                    "https://www.linkedin.com/in/jonald-penpillo",
                    "https://www.instagram.com/h4kuna_11/",
                    "https://github.com/JPixelate"
                ],
                "image": "https://penpillo.j/uss52.webp",
                "knowsAbout": [
                    "Full-Stack Development",
                    "AI Automation",
                    "Workflow Engineering",
                    "React.js",
                    "PHP CodeIgniter",
                    "n8n",
                    "Digital Architecture"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://penpillo.j/#website",
                "url": "https://penpillo.j",
                "name": siteName,
                "publisher": { "@id": "https://penpillo.j/#person" }
            },
            {
                "@type": "WebPage",
                "@id": `${finalUrl}/#webpage`,
                "url": finalUrl,
                "name": fullTitle,
                "description": finalDescription,
                "isPartOf": { "@id": "https://penpillo.j/#website" },
                "about": { "@id": "https://penpillo.j/#person" }
            }
        ]
    };

    return (
        <script type="application/ld+json">
            {JSON.stringify(structuredData)}
        </script>
    );
};

export default SEO;

