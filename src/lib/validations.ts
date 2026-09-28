import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  phone: z
    .string()
    .regex(
      /^(977)?[9][6-8]\d{8}$/,
      "Invalid Nepali phone number. Use format: 98XXXXXXXX"
    )
    .optional()
    .nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
});

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  phone: z
    .string()
    .regex(
      /^(977)?[9][6-8]\d{8}$/,
      "Invalid Nepali phone number. Use format: 98XXXXXXXX"
    ),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  wardNumber: z.number().int().min(1).max(36, "Ward number must be between 1 and 36"),
  tole: z.string().min(1, "Tole/Street is required"),
  houseNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isDiscount: z.boolean().optional(),
  specifications: z.record(z.any()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  parentId: z.string().optional().nullable(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderAmount: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  isActive: z.boolean().optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const orderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
  paymentMethod: z.enum(["ESEWA", "COD"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z
    .string()
    .regex(/^(977)?[9][6-8]\d{8}$/, "Invalid Nepali phone number")
    .optional()
    .or(z.literal("")),
  image: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
