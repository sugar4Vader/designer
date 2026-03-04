# Lightbox Gallery Implementation Guide

## Overview

This guide provides complete information about the new JavaScript lightbox gallery system that replaces the old CSS :target modal implementation for the "Latest Projects" section.

## Files Created/Modified

### New Files

1. **js/lightbox-projects.js** - Main JavaScript implementation
2. **css/components/lightbox-projects.css** - Lightbox styles

### Modified Files

1. **css/style.css** - Replaced `modal-project.css` import with `lightbox-projects.css`
2. **index.html** - Added script tag for lightbox-projects.js
3. **partials/index.latest-projects.partial.html** - Updated data attributes and href values

### Deprecated Files

- **css/components/modal-project.css** - No longer imported (can be safely deleted)

## Implementation Details

### HTML Structure

The grid requires the `data-projects-gallery` attribute:

```html
<div class="latest-projects__grid" data-projects-gallery>
  <a href="#" class="projects__link" data-project-open>
    <img src="img/latest_ptojects_one.webp" alt="Project 1 preview" />
  </a>
  <!-- More project links... -->
</div>
```

**Key Changes:**

- Changed `href="#project-1"` to `href="#"` (prevents navigation)
- Added `data-projects-gallery` to the grid container
- Kept `data-project-open` on each project link
- Grid structure and CSS classes remain unchanged

### JavaScript Architecture

The `ProjectsLightbox` class uses:

- **Event Delegation**: Single listener on the gallery for all project clicks
- **Dynamic DOM Creation**: Lightbox markup generated in JavaScript
- **Keyboard Support**:
  - `Escape` - Close lightbox
  - `ArrowLeft` - Previous image
  - `ArrowRight` - Next image
- **Auto-Initialization**: Runs when DOM is ready (DOMContentLoaded or immediately if page already loaded)

### CSS Features

- **Visibility**: Hidden by default, shown with `--active` modifier
- **Z-index**: 1000+ to appear above other content
- **Responsive**: Adjusts sizes on mobile devices
- **Animations**: Smooth fade-in effect for images
- **Dark Backdrop**: Semi-transparent overlay (85% black)
- **Interactive Elements**: Hover states for buttons and navigation

## Features

### Core Functionality

✓ Click any project image to open in lightbox
✓ Centered overlay with dark backdrop
✓ Close button (✕) in top-right
✓ Previous/Next navigation arrows
✓ Image counter (e.g., "1 / 6")
✓ No page navigation
✓ Prevents page scroll when open

### Navigation Options

✓ Click close button
✓ Click dark backdrop
✓ Click navigation arrows
✓ Press Escape key
✓ Press Arrow keys (Left/Right)

## Integration Steps

### 1. Verify File Locations

Ensure these files exist in your project:

```
js/lightbox-projects.js
css/components/lightbox-projects.css
index.html
partials/index.latest-projects.partial.html
```

### 2. Check CSS Import

In [css/style.css](css/style.css), verify this import exists:

```css
@import url("./components/lightbox-projects.css");
```

And that this import is removed or commented out:

```css
/* @import url("./components/modal-project.css"); */
```

### 3. Verify HTML Script Tag

In [index.html](index.html), verify this script tag exists (typically before closing `</head>` or `</body>`):

```html
<script src="js/lightbox-projects.js"></script>
```

### 4. Update Gallery Partial

In [partials/index.latest-projects.partial.html](partials/index.latest-projects.partial.html):

- Grid has `data-projects-gallery` attribute
- Each project link has `data-project-open` attribute
- All `href` values are set to `"#"` (not specific anchor IDs)

### 5. Remove Old Modal HTML (if present)

In [partials/global.modals.partial.html](partials/global.modals.partial.html):

- Remove all `<div id="project-*" class="modal-project">` elements
- These are no longer needed with the new lightbox system

## Customization

### Modify Colors

In [css/components/lightbox-projects.css](css/components/lightbox-projects.css), update:

```css
/* Dark backdrop transparency */
.lightbox-projects__backdrop {
  background-color: rgba(0, 0, 0, 0.85); /* Change 0.85 for transparency */
}

/* Button hover color */
.lightbox-projects__close:hover,
.lightbox-projects__nav:hover {
  color: var(--color-yellow); /* Change to your color */
}
```

### Adjust Button Styles

Modify these classes:

- `.lightbox-projects__close` - Close button
- `.lightbox-projects__nav` - Navigation arrows
- `.lightbox-projects__nav--prev` - Left arrow
- `.lightbox-projects__nav--next` - Right arrow

### Change Animation Speed

Update in [css/components/lightbox-projects.css](css/components/lightbox-projects.css):

```css
@keyframes lightbox-fade-in {
  /* Change 0.3s to desired duration */
  animation: lightbox-fade-in 0.3s ease-out;
}
```

### Adjust Counter Position

Modify `.lightbox-projects__counter`:

```css
.lightbox-projects__counter {
  bottom: 20px; /* Distance from bottom */
  left: 50%; /* Position from left */
  /* ... other properties ... */
}
```

## Troubleshooting

### Lightbox doesn't appear

- Verify `data-projects-gallery` is on the grid container
- Verify `data-project-open` is on each project link
- Check browser console for errors
- Ensure [js/lightbox-projects.js](js/lightbox-projects.js) is loaded

### Images show wrong size

- Check image `src` attributes are correct paths
- Verify CSS in [css/components/lightbox-projects.css](css/components/lightbox-projects.css) is loaded
- Check z-index isn't being overridden

### Keyboard navigation doesn't work

- Verify JavaScript file is loaded
- Check that focus isn't stuck on another element
- Ensure browser isn't preventing keyboard events

### Page scrolling while lightbox is open

- Check that overflow styles are being applied
- Verify `document.documentElement.style.overflow` is set to 'hidden'
- Check for conflicting CSS overflow properties

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **IE11**: Not supported (uses ES6+ syntax)
- **Mobile**: Full support with responsive design

## Performance Notes

- Lightbox markup is created once on page load, not on every click
- Event delegation reduces number of event listeners
- Images are reused (src updated, not replaced)
- No external dependencies

## Accessibility

- Close button has `aria-label="Close lightbox"`
- Navigation buttons have `aria-label` descriptions
- Keyboard navigation fully supported
- Semantic HTML with proper link structure

## Migration Checklist

- [ ] New files created (js/lightbox-projects.js, css/components/lightbox-projects.css)
- [ ] CSS style.css import updated
- [ ] Script tag added to index.html
- [ ] HTML partial updated with data attributes
- [ ] Old modal-project.css import removed from style.css
- [ ] Old project modal HTML removed from global.modals.partial.html (if present)
- [ ] Test lightbox opening by clicking a project image
- [ ] Test navigation with arrow buttons
- [ ] Test keyboard navigation (Escape, Arrow keys)
- [ ] Test responsive design on mobile
- [ ] Verify no console errors
- [ ] Delete/archive css/components/modal-project.css if no longer needed

## Support for HTMX

Since your project uses HTMX to load partials, the lightbox will reinitialize automatically when the latest-projects partial is loaded because:

1. The JavaScript checks for existing lightbox elements before creating
2. Event delegation works even after partial replacement
3. Auto-initialization runs whenever the script executes

If you swap the partial multiple times, the lightbox will seamlessly adapt.
