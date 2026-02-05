 import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteName = 'Portfolio';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Intelligent Digital Architecture & AI Automation`;
    const defaultDescription = 'I specialize in high-performance digital architecture, autonomous AI workflows, and enterprise-grade MCP chatbot systems. I build the engines that drive modern business growth.';
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || 'AI automation, web architecture, MCP chatbots, digital transformation, n8n automation, Next.js development, enterprise AI';
    const finalImage = image || '/og-image.jpg'; // Placeholder for OG image
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

    return (
        <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Your Name",
                "url": "https://yourportfolio.com",
                "image": "https://yourportfolio.com/profile.jpg",
                "description": finalDescription,
                "jobTitle": "Principal Systems Architect",
                "sameAs": [
                    "https://twitter.com/yourhandle",
                    "https://linkedin.com/in/yourprofile",
                    "https://github.com/yourusername"
                ]
            })}
        </script>
    );
};

export default SEO;
