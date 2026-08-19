import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../types/product.type';
import ProductRepository from '../database/repositories/productRepository';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await ProductRepository.findAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('[useProducts] load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const removeProduct = useCallback(async (id: number) => {
    const prev = products;
    setProducts((cur) => cur.filter((p) => p.id !== id)); // optimistic
    try {
      const ok = await ProductRepository.remove(id);
      if (!ok) throw new Error('Delete failed');
    } catch (err) {
      setProducts(prev);
      console.error('[useProducts] remove error:', err);
      throw err;
    }
  }, [products]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    products,
    loading,
    refreshing,
    error,
    reload: () => load(false),
    refresh: () => load(true),
    removeProduct,
  };
}