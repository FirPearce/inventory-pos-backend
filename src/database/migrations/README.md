# Database Migrations

## Menjalankan Migration

### Generate Migration (dari entity changes)

```bash
npm run migration:generate src/database/migrations/MigrationName
```

### Create Migration (manual)

```bash
npm run migration:create src/database/migrations/MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

## Migration Files

- `1703616000000-CreateCategoriesTable.ts` - Creates the categories table with all required fields
