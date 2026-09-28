export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId: string;
  category?: Category;
  brand?: string | null;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPopular: boolean;
  isDiscount: boolean;
  specifications?: Record<string, string> | null;
  rating: number;
  reviewCount: number;
  soldCount: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[];
  reviews?: Review[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  children?: Category[];
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  province: string;
  district: string;
  municipality: string;
  wardNumber: number;
  tole: string;
  houseNumber?: string | null;
  landmark?: string | null;
  deliveryInstructions?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  couponId?: string | null;
  couponCode?: string | null;
  couponDiscount: number;
  paymentMethod: "ESEWA" | "COD";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  transactionId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  address?: Address;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: "ESEWA" | "COD";
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  transactionId?: string | null;
  esewaRefId?: string | null;
  paidAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "ADMIN";
  emailVerified?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string | null;
  charge: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
}
