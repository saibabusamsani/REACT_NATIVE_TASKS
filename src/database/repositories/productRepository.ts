import { getDb } from '../connection';
import type {
  CreateProductInput,
  UpdateProductInput,
  Product
} from '../../types/product.type';

const ProductRepository = {
  async add(data: CreateProductInput): Promise<number> {
    const db = getDb();

    const result = await db.execute(
      `INSERT INTO products (name, price)
       VALUES (?, ?)`,
      [data.name, data.price]
    );

    return Number(result.insertId);
  },

  async findAll(): Promise<Product[]> {
    const db = getDb();

    const result = await db.execute(
      `SELECT id, name, price
       FROM products
       ORDER BY name`
    );
 return (result.rows ?? []) as unknown as Product[];
  },

  async findById(id: number): Promise<Product | null> {
    const db = getDb();

    const result = await db.execute(
      `SELECT id, name, price
       FROM products
       WHERE id = ?`,
      [id]
    );

    return (result.rows?.[0] as unknown as Product) ?? null;
  },

  async update(
    id: number,
    data: UpdateProductInput
  ): Promise<boolean> {
    const db = getDb();

    const result = await db.execute(
      `UPDATE products
       SET name = ?, price = ?
       WHERE id = ?`,
      [data.name, data.price, id]
    );

    return (result.rowsAffected ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const db = getDb();

    const result = await db.execute(
      `DELETE FROM products
       WHERE id = ?`,
      [id]
    );

    return (result.rowsAffected ?? 0) > 0;
  },
};

export default ProductRepository;