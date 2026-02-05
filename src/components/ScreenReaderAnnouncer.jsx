import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScreenReaderAnnouncer = () => {
    const [announcement, setAnnouncement] = useState('');
    const location = useLocation();

    useEffect(() => {
        // Announce page changes to screen readers
        const pageNames = {
            '/': 'Home page',
            '/process': 'Process page',
            '/deploy': 'Deploy page',
            '/services/web-architecture': 'Web Architecture service page',
            '/services/ai-automation': 'AI Automation service page',
            '/services/mcp-chatbots': 'MCP Chatbots service page',
            '/pricing/web-architecture': 'Web Architecture pricing page',
            '/pricing/automation': 'Automation pricing page',
            '/pricing/ai-agents': 'AI Agents pricing page',
        };

        const pageName = pageNames[location.pathname] || 'Page';
        setAnnouncement(`Navigated to ${pageName}`);

        // Clear announcement after it's been read
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            {/* Live region for route announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            {/* Assertive announcements for important updates */}
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
                id="assertive-announcer"
            />
        </>
    );
};

export default ScreenReaderAnnouncer;
