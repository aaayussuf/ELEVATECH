# Admin Product Restructuring — Task List

- [x] Gather information & understand current structure
- [x] Plan approved
- [x] Step 1: Create `src/components/admin/ProductForm.jsx` — reusable form component
- [x] Step 2: Create `src/pages/admin/CreateProduct.jsx` — create wrapper
- [x] Step 3: Create `src/pages/admin/EditProduct.jsx` — edit wrapper
- [x] Step 4: Rename `AdminDashboard.jsx` → `Dashboard.jsx` and update content
- [x] Step 5: Update `src/App.jsx` — routes & imports
- [x] Step 6: Delete old `src/pages/admin/AddProduct.jsx` & `AdminDashboard.jsx`
- [x] Step 7: Verify everything works

## Final Structure

```
src/
├── components/
│   └── admin/
│       └── ProductForm.jsx      ← reusable form (Name, Price, Description, Category, Quantity, Brand, Upload Image, Save)
├── pages/
│   └── admin/
│       ├── ProductList.jsx      ← search, table, pagination, delete, edit
│       ├── CreateProduct.jsx    ← <ProductForm mode="create" />
│       ├── EditProduct.jsx      ← <ProductForm mode="edit" />
│       └── Dashboard.jsx        ← renamed from AdminDashboard
```

