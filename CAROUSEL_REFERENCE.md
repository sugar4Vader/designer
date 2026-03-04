# Clients Carousel - Implementation Reference

## Quick Start

Everything is now set up and ready to use. The carousel is fully functional with:

- ✅ Responsive layout (1 card mobile, 4 cards desktop)
- ✅ JavaScript-driven navigation
- ✅ Click-to-modal functionality
- ✅ Smooth animations
- ✅ Proper accessibility attributes

## How It Works

### 1. JavaScript Carousel (`js/carousel-clients.js`)

The `ClientsCarousel` class handles:

- Calculating visible items based on viewport width
- Transforming the track to show/hide items
- Managing button states (enabled/disabled)
- Handling window resize events
- Opening modal on card click

**Key Methods**:

- `getVisibleCount()` - Returns 1 or 4 based on viewport
- `calculateLayout()` - Computes item dimensions
- `prev()` / `next()` - Navigate carousel
- `openModal(imgElement)` - Display modal with image
- `closeModal()` - Hide modal and restore scroll

### 2. CSS Grid & Flex (`css/sections/clients.css`)

```
Desktop (≥992px):
┌─────┬──────────────────────┬─────┐
│  ‹  │  [1] [2] [3] [4]    │  ›  │
└─────┴──────────────────────┴─────┘

Mobile (<992px):
┌─────┬──────────┬─────┐
│  ‹  │   [1]   │  ›  │
└─────┴──────────┴─────┘
```

### 3. Modal Overlay (`css/components/modal-clients.css`)

```
┌────────────────────────────────────┐
│                 ✕                  │
│         ┌──────────────┐           │
│         │              │           │
│         │  [Logo]      │           │
│         │              │           │
│         └──────────────┘           │
└────────────────────────────────────┘
      (Dark overlay behind)
```

## Code Structure

### Carousel HTML

```html
<div class="carousel-clients" aria-label="Clients list">
  <button data-carousel-prev="clients">‹</button>
  <div class="carousel-clients__track">
    <!-- Items scroll here -->
    <article class="carousel-clients__item">
      <img src="img/logo.webp" alt="Brand Name" />
    </article>
  </div>
  <button data-carousel-next="clients">›</button>
</div>
```

### Modal HTML (Auto-generated)

```html
<div id="modal-clients" class="modal-clients is-open">
  <div class="modal-clients__backdrop"></div>
  <div class="modal-clients__dialog">
    <button class="modal-clients__close">✕</button>
    <div class="modal-clients__content">
      <img src="img/logo.webp" alt="Brand Name" />
    </div>
  </div>
</div>
```

## Responsive Breakpoint

**Change point: 992px**

```javascript
getVisibleCount() {
  return window.innerWidth >= 992 ? 4 : 1;
}
```

To modify this breakpoint, edit the value in `js/carousel-clients.js`:

```javascript
// Change 992 to your desired breakpoint
return window.innerWidth >= 992 ? 4 : 1;
```

## Navigation Logic

**Prev Button**:

- Disabled when `currentIndex === 0`
- Decrements `currentIndex` on click
- Updates carousel position

**Next Button**:

- Disabled when `currentIndex >= (totalItems - visibleCount)`
- Increments `currentIndex` on click
- Updates carousel position

**Example Flow** (4 items, visible=1):

```
Click → Max Index = 4-1 = 3
Index 0: [1] _ _ _  ← Can next
Index 1: _ [2] _ _  ← Can prev/next
Index 2: _ _ [3] _  ← Can prev/next
Index 3: _ _ _ [4]  ← Can prev
```

## Modal Interactions

**Opening**:

1. Click on any `.carousel-clients__item`
2. JavaScript clones the image
3. Creates/populates `#modal-clients`
4. Adds `is-open` class (shows via CSS)
5. Prevents body scroll

**Closing**:

1. Click `.modal-clients__close` button
2. Click `.modal-clients__backdrop`
3. Press `Escape` key
4. Removes `is-open` class
5. Restores body scroll

## CSS Classes Reference

```
.carousel-clients              - Main container (grid)
├── .carousel-clients__control - Prev/Next buttons
├── .carousel-clients__track   - Flex container (scrolls)
└── .carousel-clients__item    - Individual card
    └── img                    - Logo image

.modal-clients                 - Main modal (fixed overlay)
├── .modal-clients__backdrop   - Dark background
├── .modal-clients__dialog     - Content container
├── .modal-clients__close      - Close button
└── .modal-clients__content    - Image wrapper
    └── img                    - Cloned logo image
```

## CSS Variables Used

| Variable                | Value                  | Usage                 |
| ----------------------- | ---------------------- | --------------------- |
| `--color-dark`          | #2b2e33                | Card/modal background |
| `--color-accent`        | #f7c30a                | Button hover (yellow) |
| `--color-white`         | #ffffff                | Text/icons            |
| `--overlay-dark-strong` | rgba(0,0,0,0.66)       | Modal backdrop        |
| `--overlay-dark-soft`   | rgba(0,0,0,0.3)        | Close button bg       |
| `--overlay-white-soft`  | rgba(255,255,255,0.12) | Close hover           |
| `--radius-sm`           | 10px                   | Card radius           |
| `--radius-md`           | 18px                   | Modal radius          |
| `--shadow-md`           | 0 12px 30px...         | Modal shadow          |
| `--transition`          | 200ms ease             | Smooth animations     |

## Events & Listeners

```javascript
// Window resize - recalculates layout
window.addEventListener("resize", () => handleResize());

// Prev button
document
  .querySelector("[data-carousel-prev='clients']")
  .addEventListener("click", () => prev());

// Next button
// Card click - event delegation on track
document
  .querySelector("[data-carousel-next='clients']")
  .addEventListener("click", () => next()).carousel -
  // Modal close button
  clients__track.addEventListener("click", (e) => openModal(imgElement)).modal -
  // Modal backdrop
  clients__close.addEventListener("click", () => closeModal()).modal -
  clients__backdrop.addEventListener("click", () => closeModal());

// Escape key
document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
```

## Performance Notes

- **Transform only**: Uses CSS `transform: translateX()` for 60fps scrolling
- **Event delegation**: One listener on track instead of one per item
- **Lazy modal**: Modal created once on first card click, reused thereafter
- **No layout shift**: Flex layout prevents content jumping
- **Resize throttling**: Recalculates only when needed (resize event)

## Troubleshooting

**Carousel not working?**

- Check browser console for errors
- Verify `carousel-clients.js` is loaded in index.html
- Ensure `.carousel-clients__track` class exists in HTML

**Modal not opening?**

- Check that card images have `src` attributes
- Verify body element exists in DOM
- Check z-index conflicts with other modals

**Layout breaking on resize?**

- Add `box-sizing: border-box` to `.carousel-clients__item` if custom widths conflict
- Verify `--transition` variable is defined

**Buttons not responding?**

- Check that `data-carousel-prev="clients"` and `data-carousel-next="clients"` are correct
- Verify JavaScript console shows no errors

## Testing Viewport Sizes

Use DevTools to test:

```
Mobile: 375px × 812px (iPhone X)
Tablet: 768px × 1024px (iPad)
Desktop: 1920px × 1080px (Full HD)
Breakpoint: 992px ← Test here for transition
```

## Next Customizations

To customize carousel:

**1. Change visible items on desktop**:

```javascript
return window.innerWidth >= 992 ? 6 : 1; // Show 6 on desktop
```

**2. Change scroll direction**:

```javascript
// Change to scroll right instead of left
this.track.style.transform = `translateX(${scrollDistance}px)`;
```

**3. Add scroll amount**:

```javascript
// Skip by 2 items instead of 1
this.currentIndex += 2; // in next()
```

**4. Change modal width**:

```css
.modal-clients__dialog {
  width: min(92vw, 800px); /* Was 600px */
}
```

**5. Add animation on item enter**:

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.carousel-clients__item {
  animation: slideIn 0.3s ease;
}
```
