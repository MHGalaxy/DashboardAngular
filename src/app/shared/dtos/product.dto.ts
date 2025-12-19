export interface ProductDto {
  productId: number;
  title: string;
  description: string;
  providerId: number;
  price: number;
  imageSrc: string | null;
  createdAt: string;
  updatedAt: string | null;
}
