import React, { useState, useEffect, useRef } from 'react';

const ViewportSlot = ({ children, minHeight = "10vh" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "50% 0px" } // Load when within 50% of viewport height
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ minHeight }} className="w-full relative">
            {children}
        </div>
    );
};

export default ViewportSlot;
