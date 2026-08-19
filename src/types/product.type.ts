export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
}

export interface UpdateProductInput {
  name: string;
  price: number;
}