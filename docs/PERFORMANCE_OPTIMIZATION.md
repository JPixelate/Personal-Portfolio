# Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented to address Lighthouse audit findings.

## Issues Addressed

### 1. ✅ Minify JavaScript (Est. savings: 2,060 KiB)

**Solution Implemented:**

- Switched from `esbuild` to `terser` minifier in `vite.config.js`
- Terser provides superior compression compared to esbuild
- Configured aggressive minification options:
  - `drop_console: true` - Removes all console.log statements in production
  - `drop_debugger: true` - Removes debugger statements
  - `passes: 2` - Runs compression twice for better results
  - `comments: false` - Strips all comments from output

**Expected Impact:** ~2MB reduction in JavaScript bundle size

### 2. ✅ Reduce Unused JavaScript (Est. savings: 1,375 KiB)

**Solutions Implemented:**

#### A. Improved Code Splitting

Enhanced manual chunking strategy in `vite.config.js`:

- `react-vendor` - React core libraries
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `three-core` - 3D libraries (largest dependency)
- `ai-vendor` - AI/ML libraries
- `router` - React Router
- `markdown` - Markdown renderer
- `vendor` - Everything else

**Benefits:**

- Parallel loading of chunks
- Better browser caching
- Only load what's needed per route

#### B. Icon Import Optimization

Created `src/utils/icons.js` for centralized icon exports:

- Enables tree-shaking of unused icons
- Reduces lucide-react bundle size significantly

**Usage:**

```javascript
// Before (imports entire library)
import { ArrowRight, Check } from "lucide-react";

// After (tree-shakeable)
import { ArrowRight, Check } from "../utils/icons";
```

#### C. Lazy Loading Strategy

Already implemented for:

- All page components
- SystemConcierge
- ExplorerControls
- BlueprintStats
- ArchitectureViewer

### 3. ✅ Back/Forward Cache Restoration

**Issue:** CSP header contained `unsafe-eval` which prevents bfcache

**Solution:** Removed `unsafe-eval` from Content-Security-Policy in `index.html`

**Impact:**

- Enables instant back/forward navigation
- Improves perceived performance
- Better user experience

## Build Configuration

### Terser Options

```javascript
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug'],
    passes: 2,
  },
  mangle: {
    safari10: true,
  },
  format: {
    comments: false,
  },
}
```

### Asset Organization

```
dist/
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── framer-motion-[hash].js
│   │   ├── three-core-[hash].js
│   │   ├── ai-vendor-[hash].js
│   │   └── vendor-[hash].js
│   ├── images/
│   └── fonts/
```

## Testing

### Build the Production Bundle

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Performance" category
4. Click "Analyze page load"

## Expected Results

After implementing these optimizations:

| Metric            | Before    | After     | Improvement   |
| ----------------- | --------- | --------- | ------------- |
| JavaScript Size   | ~3.4 MB   | ~1.3 MB   | -2.1 MB (61%) |
| Unused JS         | ~1.4 MB   | ~200 KB   | -1.2 MB (85%) |
| bfcache           | ❌ Failed | ✅ Passed | Restored      |
| Performance Score | ~70       | ~90+      | +20 points    |

## Additional Recommendations

### 1. Dynamic Imports for Heavy Features

Consider lazy loading:

- Three.js scenes only when needed
- AI chat only when opened
- Blueprint mode on demand

### 2. Image Optimization

- Use WebP format (already implemented)
- Implement responsive images with `srcset`
- Add lazy loading to below-fold images

### 3. Font Optimization

- Use `font-display: swap` (already implemented)
- Subset fonts to only needed characters
- Consider variable fonts

### 4. Preloading Strategy

```html
<!-- Critical resources -->
<link rel="preload" as="script" href="/assets/js/react-vendor-[hash].js" />
<link rel="preload" as="image" href="/hero-image.webp" />
```

### 5. Service Worker

Implement service worker for:

- Offline support
- Asset caching
- Background sync

## Monitoring

### Vercel Speed Insights

Already integrated - monitor real-user metrics:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Continuous Optimization

- Run Lighthouse audits regularly
- Monitor bundle size in CI/CD
- Use `npm run build -- --mode analyze` to visualize bundle

## Migration Guide

### Update Icon Imports

To take advantage of tree-shaking, update all icon imports:

```bash
# Find all lucide-react imports
grep -r "from 'lucide-react'" src/
```

Then replace with:

```javascript
import { IconName } from "../utils/icons";
```

## Troubleshooting

### Build Fails with Terser

If terser causes issues:

1. Check for dynamic `eval()` usage
2. Verify no runtime code generation
3. Fallback to esbuild if needed

### CSP Violations

If removing `unsafe-eval` breaks functionality:

1. Check browser console for CSP errors
2. Identify the violating code
3. Refactor to avoid eval/Function constructor

### Chunk Loading Errors

If code splitting causes issues:

1. Verify all dynamic imports have proper error boundaries
2. Check network tab for 404s
3. Ensure proper base path configuration

## Resources

- [Vite Build Optimizations](https://vitejs.dev/guide/build.html)
- [Terser Documentation](https://terser.org/docs/api-reference)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome bfcache Guide](https://web.dev/bfcache/)
