import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nepalshop.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@nepalshop.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "9841234567",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create sample customer
  const customerPassword = await bcrypt.hash("Customer@123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Ram Sharma",
      email: "customer@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "9841234567",
    },
  });
  console.log("Created customer:", customer.email);

  // Create categories
  const categories = [
    { name: "Electronics", slug: "electronics", description: "Latest electronic devices and gadgets" },
    { name: "Mobile & Accessories", slug: "mobile-accessories", description: "Smartphones and accessories" },
    { name: "Computers & Laptops", slug: "computers-laptops", description: "Laptops, desktops, and accessories" },
    { name: "Fashion", slug: "fashion", description: "Trendy fashion for everyone" },
    { name: "Men's Fashion", slug: "mens-fashion", description: "Fashion for men" },
    { name: "Women's Fashion", slug: "womens-fashion", description: "Fashion for women" },
    { name: "Shoes", slug: "shoes", description: "Footwear for all occasions" },
    { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Beauty and personal care products" },
    { name: "Home & Kitchen", slug: "home-kitchen", description: "Home and kitchen essentials" },
    { name: "Grocery", slug: "grocery", description: "Daily grocery items" },
    { name: "Sports", slug: "sports", description: "Sports and fitness equipment" },
    { name: "Books", slug: "books", description: "Books and educational materials" },
    { name: "Accessories", slug: "accessories", description: "Fashion accessories and more" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log("Created categories");

  // Get category IDs
  const categoryMap = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdMap = Object.fromEntries(
    categoryMap.map((c) => [c.slug, c.id])
  );

  // Create products
  const products = [
    {
      name: "Samsung Galaxy S25 Ultra",
      slug: "samsung-galaxy-s25-ultra",
      description: "Experience the ultimate smartphone with the Samsung Galaxy S25 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, 200MP camera, and the latest Snapdragon processor.",
      price: 189999,
      discountPrice: 179999,
      categoryId: categoryIdMap["mobile-accessories"],
      brand: "Samsung",
      sku: "SGS25U-001",
      stock: 25,
      isFeatured: true,
      isNewArrival: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Display: "6.8 inch Dynamic AMOLED",
        Processor: "Snapdragon 8 Gen 3",
        RAM: "12GB",
        Storage: "256GB",
        Camera: "200MP + 12MP + 50MP + 10MP",
        Battery: "5000mAh",
      },
    },
    {
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      description: "The most powerful iPhone ever with A18 Pro chip, 48MP camera system, and titanium design.",
      price: 219999,
      discountPrice: null,
      categoryId: categoryIdMap["mobile-accessories"],
      brand: "Apple",
      sku: "IP16PM-001",
      stock: 15,
      isFeatured: true,
      isNewArrival: true,
      isPopular: true,
      isDiscount: false,
      specifications: {
        Display: "6.9 inch Super Retina XDR",
        Processor: "A18 Pro",
        RAM: "8GB",
        Storage: "256GB",
        Camera: "48MP + 48MP + 12MP",
        Battery: "4685mAh",
      },
    },
    {
      name: "MacBook Air M3",
      slug: "macbook-air-m3",
      description: "Supercharged by the M3 chip. Incredibly thin and light design with up to 18 hours of battery life.",
      price: 159999,
      discountPrice: 149999,
      categoryId: categoryIdMap["computers-laptops"],
      brand: "Apple",
      sku: "MBA-M3-001",
      stock: 10,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Display: "13.6 inch Liquid Retina",
        Processor: "Apple M3",
        RAM: "8GB",
        Storage: "256GB SSD",
        Battery: "Up to 18 hours",
        Weight: "1.24 kg",
      },
    },
    {
      name: "Dell XPS 15",
      slug: "dell-xps-15",
      description: "Powerful performance meets stunning design. Intel Core i7, 16GB RAM, and NVIDIA graphics.",
      price: 189999,
      discountPrice: 174999,
      categoryId: categoryIdMap["computers-laptops"],
      brand: "Dell",
      sku: "DXPS15-001",
      stock: 8,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Display: "15.6 inch OLED",
        Processor: "Intel Core i7-13700H",
        RAM: "16GB",
        Storage: "512GB SSD",
        Graphics: "NVIDIA RTX 4050",
      },
    },
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description: "Industry-leading noise canceling headphones with Auto NC Optimizer and crystal clear hands-free calling.",
      price: 44999,
      discountPrice: 39999,
      categoryId: categoryIdMap["electronics"],
      brand: "Sony",
      sku: "SWH1000XM5-001",
      stock: 30,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Type: "Over-Ear",
        Driver: "30mm",
        Battery: "30 hours",
        NoiseCanceling: "Yes",
        Weight: "250g",
      },
    },
    {
      name: "Apple Watch Series 10",
      slug: "apple-watch-series-10",
      description: "Thinnest Apple Watch ever with the biggest display. Advanced health features and fitness tracking.",
      price: 59999,
      discountPrice: 54999,
      categoryId: categoryIdMap["electronics"],
      brand: "Apple",
      sku: "AWS10-001",
      stock: 20,
      isFeatured: true,
      isNewArrival: true,
      isDiscount: true,
      specifications: {
        Display: "46mm OLED",
        Battery: "18 hours",
        WaterResistant: "50m",
        GPS: "Yes",
        Sensors: "Heart rate, SpO2, Temperature",
      },
    },
    {
      name: "Nike Air Max 270",
      slug: "nike-air-max-270",
      description: "The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort.",
      price: 18999,
      discountPrice: 15999,
      categoryId: categoryIdMap["shoes"],
      brand: "Nike",
      sku: "NAM270-001",
      stock: 50,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Material: "Mesh upper",
        Sole: "Air Max 270",
        Closure: "Lace-up",
        Weight: "320g",
      },
    },
    {
      name: "Adidas Ultraboost Light",
      slug: "adidas-ultraboost-light",
      description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.",
      price: 22999,
      discountPrice: 19999,
      categoryId: categoryIdMap["shoes"],
      brand: "Adidas",
      sku: "AUL-001",
      stock: 40,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Material: "Primeknit upper",
        Midsole: "Light BOOST",
        Closure: "Lace-up",
        Weight: "299g",
      },
    },
    {
      name: "Levi's 501 Original Fit Jeans",
      slug: "levis-501-original-jeans",
      description: "The original jean. The blueprint for all jeans to come. The 501 Original is the definitive jean.",
      price: 8999,
      discountPrice: 7499,
      categoryId: categoryIdMap["mens-fashion"],
      brand: "Levi's",
      sku: "L501-001",
      stock: 100,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Material: "100% Cotton",
        Fit: "Straight",
        Wash: "Medium",
        Closure: "Button fly",
      },
    },
    {
      name: "H&M Cotton Kurta",
      slug: "hm-cotton-kurta",
      description: "Comfortable cotton kurta perfect for casual and festive occasions.",
      price: 3999,
      discountPrice: 3499,
      categoryId: categoryIdMap["womens-fashion"],
      brand: "H&M",
      sku: "HMCK-001",
      stock: 75,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Material: "100% Cotton",
        Fit: "Regular",
        Occasion: "Casual/Festive",
        Care: "Machine wash",
      },
    },
    {
      name: "Dabur Amla Hair Oil",
      slug: "dabur-amla-hair-oil",
      description: "Nourish your hair with the goodness of Amla. Prevents hair fall and promotes hair growth.",
      price: 450,
      discountPrice: 399,
      categoryId: categoryIdMap["beauty-personal-care"],
      brand: "Dabur",
      sku: "DAO-001",
      stock: 200,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Volume: "300ml",
        Type: "Amla Oil",
        Suitable: "All hair types",
        Ingredients: "Amla, Mineral Oil",
      },
    },
    {
      name: "Himalaya Neem Face Wash",
      slug: "himalaya-neem-face-wash",
      description: "Deep cleanses and purifies skin with the power of Neem and Turmeric.",
      price: 350,
      discountPrice: 299,
      categoryId: categoryIdMap["beauty-personal-care"],
      brand: "Himalaya",
      sku: "HNFW-001",
      stock: 150,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Volume: "150ml",
        Type: "Face Wash",
        Suitable: "All skin types",
        Key Ingredient: "Neem, Turmeric",
      },
    },
    {
      name: "Prestige Omega Deluxe Fry Pan",
      slug: "prestige-omega-deluxe-fry-pan",
      description: "Non-stick fry pan with 5-layer coating. Perfect for everyday cooking.",
      price: 2500,
      discountPrice: 1999,
      categoryId: categoryIdMap["home-kitchen"],
      brand: "Prestige",
      sku: "PODFP-001",
      stock: 60,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Diameter: "24cm",
        Material: "Aluminium",
        Coating: "5-layer non-stick",
        Handle: "Bakelite",
      },
    },
    {
      name: "Milton Thermosteel Flask",
      slug: "milton-thermosteel-flask",
      description: "Keeps beverages hot or cold for hours. 100% leak-proof and rust-free.",
      price: 1500,
      discountPrice: 1299,
      categoryId: categoryIdMap["home-kitchen"],
      brand: "Milton",
      sku: "MTF-001",
      stock: 80,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Capacity: "1L",
        Material: "Stainless Steel",
        Insulation: "Hot/Cold",
        Warranty: "1 year",
      },
    },
    {
      name: "Organic Nepal Green Tea",
      slug: "organic-nepal-green-tea",
      description: "Premium organic green tea from the hills of Nepal. Rich in antioxidants.",
      price: 800,
      discountPrice: 699,
      categoryId: categoryIdMap["grocery"],
      brand: "Organic Nepal",
      sku: "ONG T-001",
      stock: 120,
      isFeatured: true,
      isNewArrival: true,
      isDiscount: true,
      specifications: {
        Weight: "250g",
        Type: "Green Tea",
        Origin: "Ilam, Nepal",
        Certification: "Organic",
      },
    },
    {
      name: "Nepali Basmati Rice 5kg",
      slug: "nepali-basmati-rice-5kg",
      description: "Premium quality Basmati rice grown in Nepal. Long grain and aromatic.",
      price: 1200,
      discountPrice: 999,
      categoryId: categoryIdMap["grocery"],
      brand: "Nepal Rice",
      sku: "NBR5K-001",
      stock: 200,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Weight: "5kg",
        Type: "Basmati",
        Origin: "Nepal",
        Shelf Life: "24 months",
      },
    },
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description: "Extra thick yoga mat with non-slip surface. Perfect for yoga and exercise.",
      price: 2500,
      discountPrice: 1999,
      categoryId: categoryIdMap["sports"],
      brand: "YogaPro",
      sku: "YMP-001",
      stock: 45,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Thickness: "6mm",
        Material: "TPE",
        Size: "183cm x 61cm",
        Weight: "900g",
      },
    },
    {
      name: "Dumbbells Set 20kg",
      slug: "dumbbells-set-20kg",
      description: "Adjustable dumbbells set for home gym. Cast iron with chrome finish.",
      price: 8500,
      discountPrice: 7499,
      categoryId: categoryIdMap["sports"],
      brand: "FitPro",
      sku: "DS20K-001",
      stock: 25,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Weight: "20kg (adjustable)",
        Material: "Cast Iron",
        Finish: "Chrome",
        Grip: "Knurled",
      },
    },
    {
      name: "The Palace of Illusions",
      slug: "palace-of-illusions",
      description: "A retelling of the Mahabharata from Draupadi&apos;s perspective. Bestselling novel by Chitra Banerjee Divakaruni.",
      price: 800,
      discountPrice: 699,
      categoryId: categoryIdMap["books"],
      author: "Chitra Banerjee Divakaruni",
      sku: "POI-001",
      stock: 35,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Pages: "384",
        Publisher: "Pan Macmillan",
        Language: "English",
        ISBN: "978-0330516327",
      },
    },
    {
      name: "Nepal: A History from the Earliest Times",
      slug: "nepal-history-book",
      description: "Comprehensive history of Nepal from ancient times to modern era.",
      price: 1500,
      discountPrice: 1299,
      categoryId: categoryIdMap["books"],
      author: "John Whelpton",
      sku: "NHB-001",
      stock: 20,
      isFeatured: true,
      isDiscount: true,
      specifications: {
        Pages: "720",
        Publisher: "Cambridge University Press",
        Language: "English",
        ISBN: "978-0521804707",
      },
    },
    {
      name: "Leather Wallet - Genuine Leather",
      slug: "leather-wallet-genuine",
      description: "Handcrafted genuine leather wallet with multiple card slots and coin pocket.",
      price: 2500,
      discountPrice: 1999,
      categoryId: categoryIdMap["accessories"],
      brand: "Leather Craft",
      sku: "LWGL-001",
      stock: 60,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Material: "Genuine Leather",
        Color: "Brown",
        Card Slots: "8",
        Closure: "Snap button",
      },
    },
    {
      name: "Sunglasses - UV Protection",
      slug: "sunglasses-uv-protection",
      description: "Stylish sunglasses with 100% UV protection. Lightweight and durable frame.",
      price: 3500,
      discountPrice: 2999,
      categoryId: categoryIdMap["accessories"],
      brand: "SunStyle",
      sku: "SUVP-001",
      stock: 80,
      isFeatured: true,
      isPopular: true,
      isDiscount: true,
      specifications: {
        Lens: "Polarized",
        UV Protection: "100%",
        Frame: "TR90",
        Weight: "25g",
      },
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existingProduct) {
      const createdProduct = await prisma.product.create({
        data: product,
      });

      // Create product image
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: `/images/products/${product.slug}.jpg`,
          alt: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });

      console.log("Created product:", product.name);
    }
  }

  // Create delivery zones
  const deliveryZones = [
    { name: "Inside Kathmandu Valley", description: "Same day or next day delivery", charge: 100, sortOrder: 1 },
    { name: "Outside Kathmandu Valley", description: "2-4 business days", charge: 150, sortOrder: 2 },
    { name: "Remote Areas", description: "5-7 business days", charge: 250, sortOrder: 3 },
  ];

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.upsert({
      where: { name: zone.name },
      update: {},
      create: zone,
    });
  }
  console.log("Created delivery zones");

  // Create sample coupon
  await prisma.coupon.upsert({
    where: { code: "DASH10" },
    update: {},
    create: {
      code: "DASH10",
      description: "10% off on your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscount: 1000,
      usageLimit: 100,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2026-12-31"),
      isActive: true,
    },
  });
  console.log("Created coupon");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
