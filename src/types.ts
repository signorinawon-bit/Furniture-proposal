export type StyleType = 'modern' | 'scandinavian' | 'natural_wood' | 'mid_century' | 'classic';

export type BrandType = 'all' | 'HAY' | 'IKEA' | 'iloom' | 'Casamia' | 'MUJI';

export type PriceRangeType = 'all' | 'budget' | 'mid' | 'premium' | 'luxury';

export type FurnitureCategory = 'all' | 'sofa' | 'table' | 'chair' | 'lighting' | 'storage';

export interface RoomPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale?: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export interface FurnitureItem {
  id: string;
  name: string;
  brand: string;
  style: StyleType;
  price: number;
  category: Exclude<FurnitureCategory, 'all'>;
  dimensions: string;
  material: string;
  imageUrl: string;
  roomPlacement: RoomPosition;
  description: string;
  color: string;
}

export interface ProposalFilter {
  style: StyleType;
  brand: BrandType;
  priceRange: PriceRangeType;
}

export interface ProposalItemWithQuantity {
  item: FurnitureItem;
  quantity: number;
}
