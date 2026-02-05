# Accessibility Quick Reference

## Component Checklist

When creating new components, ensure you include:

### ✅ Semantic HTML
```jsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

### ✅ ARIA Labels
```jsx
// For buttons with only icons
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

// For links
<Link to="/about" aria-label="Learn more about our company">
  About
</Link>
```

### ✅ Keyboard Support
```jsx
// Handle both click and keyboard events
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

### ✅ Focus Management
```jsx
// Trap focus in modals
useEffect(() => {
  if (isOpen) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
    
    // Handle Tab key
    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isOpen]);
```

### ✅ Alt Text for Images
```jsx
// Decorative images
<img src="decoration.png" alt="" aria-hidden="true" />

// Informative images
<img src="logo.png" alt="Company Name - Home" />

// Complex images
<img 
  src="chart.png" 
  alt="Bar chart showing 50% increase in sales from Q1 to Q2"
/>
```

### ✅ Form Accessibility
```jsx
<form>
  {/* Always associate labels with inputs */}
  <label htmlFor="email">Email Address</label>
  <input 
    id="email" 
    type="email" 
    required
    aria-required="true"
    aria-describedby="email-help"
  />
  <span id="email-help" className="sr-only">
    Enter your email address for updates
  </span>
  
  {/* Error messages */}
  {error && (
    <div role="alert" aria-live="assertive">
      {error}
    </div>
  )}
</form>
```

### ✅ Live Regions
```jsx
// Polite announcements (non-urgent)
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// Assertive announcements (urgent)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>
```

### ✅ Modal Dialogs
```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  <button onClick={handleConfirm}>Confirm</button>
  <button onClick={handleCancel}>Cancel</button>
</div>
```

## Common ARIA Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `aria-label` | Provides accessible name | `<button aria-label="Close">×</button>` |
| `aria-labelledby` | References element for label | `<div aria-labelledby="title">` |
| `aria-describedby` | References element for description | `<input aria-describedby="help">` |
| `aria-hidden` | Hides from screen readers | `<div aria-hidden="true">` |
| `aria-live` | Announces dynamic changes | `<div aria-live="polite">` |
| `aria-current` | Indicates current item | `<a aria-current="page">` |
| `aria-expanded` | Indicates expanded state | `<button aria-expanded={isOpen}>` |
| `aria-haspopup` | Indicates popup trigger | `<button aria-haspopup="dialog">` |
| `aria-modal` | Indicates modal dialog | `<div aria-modal="true">` |
| `aria-pressed` | Indicates toggle state | `<button aria-pressed={isActive}>` |

## Keyboard Navigation Patterns

### Buttons
- `Enter` or `Space` - Activate

### Links
- `Enter` - Follow link

### Tabs
- `Tab` - Move to next tab
- `Arrow Left/Right` - Navigate between tabs
- `Home/End` - First/last tab

### Dropdowns
- `Enter` or `Space` - Open/close
- `Arrow Up/Down` - Navigate options
- `Escape` - Close
- `Home/End` - First/last option

### Modals
- `Escape` - Close modal
- `Tab` - Cycle through focusable elements (trapped)

## Testing Commands

### Keyboard Testing
1. Unplug your mouse
2. Use `Tab` to navigate
3. Use `Enter`/`Space` to activate
4. Use `Escape` to close
5. Verify all functionality is accessible

### Screen Reader Testing

#### Windows (NVDA)
```bash
# Start NVDA
Ctrl + Alt + N

# Read next item
Down Arrow

# Read previous item
Up Arrow

# Read from current position
Insert + Down Arrow
```

#### macOS (VoiceOver)
```bash
# Start VoiceOver
Cmd + F5

# Read next item
VO + Right Arrow

# Read previous item
VO + Left Arrow

# Interact with element
VO + Space
```

## Color Contrast

### Minimum Ratios (WCAG AA)
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (Inspect > Accessibility)
- [Contrast Ratio](https://contrast-ratio.com/)

## Common Mistakes to Avoid

### ❌ Don't
```jsx
// Missing alt text
<img src="photo.jpg" />

// Div as button
<div onClick={handleClick}>Click</div>

// No keyboard support
<span onClick={handleClick}>Action</span>

// Placeholder as label
<input placeholder="Email" />

// Auto-playing media
<video autoplay />

// Opening new windows without warning
<a href="/page" target="_blank">Link</a>
```

### ✅ Do
```jsx
// Proper alt text
<img src="photo.jpg" alt="Team celebrating success" />

// Use button element
<button onClick={handleClick}>Click</button>

// Proper interactive element
<button onClick={handleClick}>Action</button>

// Proper label
<label htmlFor="email">Email</label>
<input id="email" placeholder="you@example.com" />

// User-controlled media
<video controls />

// Warning for new windows
<a href="/page" target="_blank" rel="noopener noreferrer">
  Link <span className="sr-only">(opens in new window)</span>
</a>
```

## Useful Utilities

### Screen Reader Only Class
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Visible
```css
*:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Resources

- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

*Keep this guide handy when developing new features!*
