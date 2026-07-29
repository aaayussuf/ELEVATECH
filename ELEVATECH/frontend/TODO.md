# ProductForm UI Refactor - TODO

## Steps

- [x] Step 1: Analyze current ProductForm.jsx and gather context
- [x] Step 2: Create plan and get approval
- [x] Step 3: Replace return JSX with new 3-column grid layout (ProductForm.jsx)
  - [x] 3.1 Add outer wrapper with `max-w-7xl mx-auto p-6` and `<h1>` title
  - [x] 3.2 Replace form layout with `grid grid-cols-1 lg:grid-cols-3 gap-6`
  - [x] 3.3 Left column: Basic Information card (name, slug, brand, SKU, barcode)
  - [x] 3.4 Left column: Pricing card (price, discount_price, cost_price)
  - [x] 3.5 Left column: Inventory card (quantity, low_stock, track_inventory checkbox)
  - [x] 3.6 Left column: Description card (textarea)
  - [x] 3.7 Right column: Product Image card (ImageUploader)
  - [x] 3.8 Right column: Category card (select dropdown)
  - [x] 3.9 Right column: Status card (featured, active checkboxes + action buttons)
- [x] Step 4: Verify file integrity

