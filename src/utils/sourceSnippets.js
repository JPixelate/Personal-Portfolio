export const SOURCE_SNIPPETS = {
  "ProjectItem": `const ProjectItem = ({ project, index, onOpen }) => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  const isLarge = project.size === "large";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onOpen}
      className={\`group cursor-pointer flex flex-col gap-6 \${blueprintMode ? 'blueprint-active-outline' : ''}\`}
    >
      <div className="overflow-hidden rounded-2xl aspect-[4/3] relative">
        <img src={project.thumbnail} alt={project.title} />
      </div>
      <div className="flex justify-between items-start">
        <h3>{project.title}</h3>
        <span>{project.year}</span>
      </div>
    </motion.div>
  );
};`,
  "FloatingNavbar": `const FloatingNavbar = () => {
  const { themeMode, cycleTheme } = useUI();
  
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full backdrop-blur-xl border shadow-2xl">
      {NAV_ITEMS.map(item => (
        <a key={item.path} href={item.path}>{item.label}</a>
      ))}
      <button onClick={cycleTheme}>Toggle Theme</button>
    </nav>
  );
};`,
  "SystemConcierge": `const SystemConcierge = () => {
    const { isChatOpen, toggleChat } = useUI();
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async (text) => {
        // AI logic implementation
    };

    return (
        <div className="fixed bottom-8 right-8">
            <button onClick={toggleChat}>Chat with AI</button>
        </div>
    );
};`,
  "App": `<!doctype html>
<html lang="en">
  <head>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Jonald Penpillo | Full Stack Web Developer. Engineering high-performance web platforms and digital architecture."
    />
    <meta
      name="keywords"
      content="full stack developer, web development, React, Node.js, digital architecture, system engineering"
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://penpillo-portfolio.vercel.app/" />
    <meta property="og:title" content="Jonald Penpillo | Full Stack Web Developer" />
    <meta property="og:description" content="Engineering high-performance web platforms and digital architecture." />
    <meta property="og:image" content="https://penpillo-portfolio.vercel.app/og-image.png?v=2" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Jonald Penpillo Portfolio - Full Stack Web Developer" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://penpillo-portfolio.vercel.app/" />
    <meta name="twitter:title" content="Jonald Penpillo | Full Stack Web Developer" />
    <meta name="twitter:description" content="Engineering high-performance web platforms and digital architecture." />
    <meta name="twitter:image" content="https://penpillo-portfolio.vercel.app/og-image.png?v=2" />

    <!-- PRELOAD CRITICAL ASSETS -->
    <link
      rel="preload"
      as="image"
      href="/src/assets/images/hero_dark.webp"
      type="image/webp"
    />
    <link
      rel="preload"
      as="image"
      href="/src/assets/images/hero_light.webp"
      type="image/webp"
    />

    <script>
      (function () {
        const theme = localStorage.getItem("theme") || "dark";
        document.documentElement.classList.add(theme);
      })();
    </script>

    <!-- PRECONNECT -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://images.unsplash.com" />

    <!-- SECURITY HEADERS (Meta Tag Equivalents) -->
    <!-- Content Security Policy: Restricts where resources can be loaded from -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://raw.githack.com https://cdn.jsdelivr.net https://raw.githubusercontent.com; connect-src 'self' http://localhost:3001 https://api.emailjs.com https://raw.githack.com https://cdn.jsdelivr.net https://raw.githubusercontent.com https://generativelanguage.googleapis.com https://api.deepseek.com wss://streaming.assemblyai.com; upgrade-insecure-requests;"
    />

    <!-- Referrer Policy: Controls how much referrer information is passed -->
    <meta name="referrer" content="no-referrer-when-downgrade" />

    <!-- Permissions Policy: Restricts browser features -->
    <meta
      http-equiv="Permissions-Policy"
      content="camera=(), microphone=(), geolocation=()"
    />

    <title>Jonald Penpillo | Full Stack Web Developer</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx?t=1770463016683"></script>
  </body>
</html>`
};
