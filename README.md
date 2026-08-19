# Products Module — README

Simple CRUD for `products` using SQLite in React Native (TypeScript).

---

## 1. Folder structure

```
src/
├── database/
│   ├── connection.ts              # opens/holds the single SQLite instance
│   ├── migrations/
│   │   ├── 001_create_tables.ts
│   │   ├── 003_create_products.ts # creates the products table
│   │   └── index.ts               # registers + runs migrations in order
│   └── repositories/
│       └── product.repository.ts  # all SQL for products lives here
├── types/
│   └── product.type.ts            # Product, CreateProductInput, UpdateProductInput
├── hooks/
│   └── useProducts.ts             # data + loading/error state for the list screen
├── navigation/
│   └── types.ts                   # RootStackParamList
└── screens/
    ├── ProductListScreen.tsx      # shows all products
    └── AddProductScreen.tsx       # form to add a product
```

**Rule of thumb:** screens never talk to SQLite directly. They only talk to a repository (or a hook that wraps a repository).

---

## 2. How the connection works

```
App starts
   │
   ▼
connection.ts opens the DB (once) ──► returns a single shared `db` instance
   │
   ▼
migrations/index.ts runs any migration whose version > current PRAGMA user_version
   │
   ▼
DB is ready → getDb() can now be called from anywhere
```

- `getDb()` always returns the **same** open connection — nothing re-opens the DB per screen.
- Migrations only run **once per version bump**. If a device is already on version 3, only migration 004+ runs on it.

---

## 3. How a repository is used

A repository = one file per table. It's the **only** place SQL exists.

```
Screen / Hook
   │  calls
   ▼
ProductRepository.add(data)
   │  calls
   ▼
getDb()
   │  runs
   ▼
db.execute("INSERT INTO products ...")
   │
   ▼
returns plain typed data (Product, number, boolean) — never raw SQLite rows
```

**Example — adding a product:**

```typescript
// in a screen or hook
const id = await ProductRepository.add({ name: 'Mouse', price: 499 });
```

**Example — listing products:**

```typescript
const products = await ProductRepository.findAll(); // Product[]
```

### Why this pattern?
| Without repository | With repository |
|---|---|
| SQL scattered across screens | SQL lives in one place per table |
| Hard to test | Easy to mock `ProductRepository` in tests |
| Copy-paste errors in queries | One source of truth |
| UI knows about SQLite | UI only knows `Product`, `add()`, `findAll()` |

---

## 4. Full flow, start to finish

```
User taps "Save"
   → AddProductScreen validates input
   → ProductRepository.add(data)
   → getDb().execute(INSERT...)
   → navigation.goBack()
   → ProductListScreen refetches on focus (useProducts hook)
   → FlatList re-renders with the new product
```

That's the whole loop: **Screen → Repository → DB → back to Screen.**