import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-NP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `NP-${year}-${random}`;
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function calculateDiscount(
  subtotal: number,
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
  maxDiscount?: number | null
): number {
  let discount = 0;
  if (discountType === "PERCENTAGE") {
    discount = (subtotal * discountValue) / 100;
  } else {
    discount = discountValue;
  }
  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount;
  }
  return Math.min(discount, subtotal);
}

export function getDeliveryCharge(district: string): number {
  const kathmanduValleyDistricts = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Kavrepalanchok",
    "Sindhupalchok",
  ];

  const remoteDistricts = [
    "Dolpa",
    "Mugu",
    "Humla",
    "Jumla",
    "Kalikot",
    "Dailekh",
    "Jajarkot",
    "Rukum",
    "Rolpa",
    "Pyuthan",
    "Salyan",
    "Dang",
    "Banke",
    "Bardiya",
    "Kailali",
    "Kanchanpur",
    "Dadeldhura",
    "Baitadi",
    "Darchula",
    "Taplejung",
    "Panchthar",
    "Ilam",
    "Jhapa",
    "Morang",
    "Sunsari",
    "Dhankuta",
    "Terhathum",
    "Sankhuwasabha",
    "Bhojpur",
    "Khotang",
    "Okhaldhunga",
    "Solukhumbu",
    "Mustang",
    "Manang",
    "Gorkha",
    "Lamjung",
    "Tanahu",
    "Syangja",
    "Kaski",
    "Parbat",
    "Baglung",
    "Gulmi",
    "Palpa",
    "Nawalparasi",
    "Rupandehi",
    "Kapilvastu",
    "Arghakhanchi",
    "Dang",
    "Pyuthan",
    "Rolpa",
    "Rukum",
    "Salyan",
    "Dailekh",
    "Jajarkot",
    "Dolpa",
    "Mugu",
    "Humla",
    "Jumla",
    "Kalikot",
    "Bajura",
    "Bajhang",
    "Achham",
    "Doti",
    "Kailali",
    "Kanchanpur",
    "Dadeldhura",
    "Baitadi",
    "Darchula",
  ];

  if (kathmanduValleyDistricts.includes(district)) {
    return 100;
  }

  if (remoteDistricts.includes(district)) {
    return 250;
  }

  return 150;
}

export function validateNepalPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  // Mobile: 98XXXXXXXX or 97XXXXXXXX or 96XXXXXXXX
  const mobileRegex = /^(977)?[9][6-8]\d{8}$/;
  return mobileRegex.test(cleaned);
}

export function formatNepalPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("977")) {
    return `+977 ${cleaned.substring(3)}`;
  }
  if (cleaned.startsWith("9") && cleaned.length === 10) {
    return `+977 ${cleaned}`;
  }
  return phone;
}
