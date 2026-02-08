import React from 'react';

const VerticalSection = ({ id, color, title }) => (
  <section
    id={`section-${id}`}
    className={`w-full h-screen ${color} flex items-center justify-center flex-shrink-0`}
  >
    <h1 className="text-neutral-900 dark:text-white text-4xl">{title}</h1>
  </section>
);

export default VerticalSection;
