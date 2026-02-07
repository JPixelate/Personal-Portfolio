# Deploy Guide System

## Overview

The Deploy Guide is an interactive onboarding system for the Request a Quote (Deploy) page. It provides step-by-step guidance through the quote request process with visual highlights and clear explanations.

## Features

### Automatic First-Time Display

- Automatically appears for first-time visitors to the `/deploy` page
- Uses `localStorage` to track if the user has completed the guide
- Shows after a short 800ms delay for better UX

### Manual Trigger

- Users can manually open the guide anytime via the "Guide" button in the page header
- The guide can also be triggered programmatically via the UIContext

### Interactive Steps

The guide includes 7 comprehensive steps:

1. **Welcome** - Introduction to the quote request process
2. **Solution Selection** - Explanation of available technical solutions
3. **Scope Definition** - Guide for budget and timeline selection
4. **Contact Information** - Instructions for providing contact details
5. **Review Process** - How to verify and submit the request
6. **Progress Tracker** - Understanding the sidebar navigation
7. **Completion** - Final message and next steps

### Visual Design

- Smooth animations with Framer Motion
- Theme-aware styling (supports light, dark, blueprint, and reading modes)
- Progress dots for step navigation
- Previous/Next navigation buttons
- Skip tour option
- ESC key to close

## Implementation

### Components

- **DeployGuide.jsx** - Main guide component with overlay and step content
- **DeployPage.jsx** - Integrates the guide and manages its state

### Context Integration

The guide can be triggered globally through UIContext:

```javascript
const { triggerDeployGuide } = useUI();

// Trigger the guide from anywhere
triggerDeployGuide();
```

### AI Assistant Integration

The AI assistant can mention the guide when users ask about:

- How to request a quote
- Starting a project
- The quote request process
- Help with the deploy page

Knowledge chunks have been added to inform the AI about the guide feature.

## User Flow

### First-Time Visitor

1. User navigates to `/deploy`
2. Page loads and checks `localStorage` for `deployGuideCompleted`
3. If not found, guide appears after 800ms
4. User goes through the guide or skips it
5. On completion, `deployGuideCompleted` is set in `localStorage`

### Returning Visitor

1. User navigates to `/deploy`
2. Guide doesn't appear automatically
3. User can click "Guide" button in header to view it again

### AI-Triggered

1. User asks AI about requesting a quote
2. AI mentions the guide and can trigger it
3. When user navigates to `/deploy`, guide appears automatically

## Customization

### Adding New Steps

Edit the `guideSteps` array in `DeployGuide.jsx`:

```javascript
{
  id: 7,
  title: "New Step Title",
  description: "Brief description",
  icon: IconComponent,
  highlight: "element-id", // or null
  position: "center", // or "left" or "right"
  content: "Detailed explanation..."
}
```

### Styling

The guide uses the `themed()` helper from UIContext for consistent theming:

- Automatically adapts to light/dark/blueprint/reading modes
- Uses accent colors from the current theme
- Maintains consistent spacing and typography

## Storage

### LocalStorage Keys

- `deployGuideCompleted` - Boolean flag indicating if user has seen the guide

## Accessibility

- Keyboard navigation (ESC to close)
- ARIA labels on interactive elements
- Focus management
- Screen reader friendly

## Future Enhancements

- [ ] Add visual highlights for specific page sections
- [ ] Implement tooltips for individual form fields
- [ ] Add video demonstrations for complex steps
- [ ] Track analytics for guide completion rates
- [ ] Add A/B testing for different guide flows
