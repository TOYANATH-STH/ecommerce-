const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nepalshop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@nepalshop.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '9841234567',
    },
  });
  console.log('Created admin user:', admin.email);

  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Ram Sharma',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '9841234567',
    },
  });
  console.log('Created customer:', customer.email);

  const categories = [
    { name: "Men's Fashion", slug: 'mens-fashion', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop', sortOrder: 1, isActive: true },
    { name: "Women's Fashion", slug: 'womens-fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', sortOrder: 2, isActive: true },
    { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', sortOrder: 3, isActive: true },
    { name: 'Electronics', slug: 'electronics', isActive: false },
    { name: 'Mobile & Accessories', slug: 'mobile-accessories', isActive: false },
    { name: 'Computers & Laptops', slug: 'computers-laptops', isActive: false },
    { name: 'Fashion', slug: 'fashion', isActive: false },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', isActive: false },
    { name: 'Home & Kitchen', slug: 'home-kitchen', isActive: false },
    { name: 'Grocery', slug: 'grocery', isActive: false },
    { name: 'Sports', slug: 'sports', isActive: false },
    { name: 'Books', slug: 'books', isActive: false },
    { name: 'Accessories', slug: 'accessories', isActive: false },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { image: category.image },
      create: category,
    });
  }
  console.log('Created categories');

  const categoryMap = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryIdMap = Object.fromEntries(categoryMap.map((c) => [c.slug, c.id]));

  const img = (id) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop`;

  const products = [
    { name: 'Samsung Galaxy S25 Ultra', slug: 'samsung-galaxy-s25-ultra', description: 'Experience the ultimate smartphone with the Samsung Galaxy S25 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, 200MP camera, and the latest Snapdragon processor.', price: 189999, discountPrice: 179999, categoryId: categoryIdMap['mobile-accessories'], brand: 'Samsung', sku: 'SGS25U-001', stock: 25, isFeatured: true, isNewArrival: true, isPopular: true, isDiscount: true, image: img('photo-1610945415295-d9bbf067e59c'), specifications: JSON.stringify({ Display: '6.8 inch Dynamic AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Camera: '200MP + 12MP + 50MP + 10MP', Battery: '5000mAh' }) },
    { name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', description: 'The most powerful iPhone ever with A18 Pro chip, 48MP camera system, and titanium design.', price: 219999, categoryId: categoryIdMap['mobile-accessories'], brand: 'Apple', sku: 'IP16PM-001', stock: 15, isFeatured: true, isNewArrival: true, isPopular: true, image: img('photo-1592750475338-74b7b21085ab'), specifications: JSON.stringify({ Display: '6.9 inch Super Retina XDR', Processor: 'A18 Pro', RAM: '8GB', Storage: '256GB', Camera: '48MP + 48MP + 12MP', Battery: '4685mAh' }) },
    { name: 'MacBook Air M3', slug: 'macbook-air-m3', description: 'Supercharged by the M3 chip. Incredibly thin and light design with up to 18 hours of battery life.', price: 159999, discountPrice: 149999, categoryId: categoryIdMap['computers-laptops'], brand: 'Apple', sku: 'MBA-M3-001', stock: 10, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1517336714731-489689fd1ca8'), specifications: JSON.stringify({ Display: '13.6 inch Liquid Retina', Processor: 'Apple M3', RAM: '8GB', Storage: '256GB SSD', Battery: 'Up to 18 hours', Weight: '1.24 kg' }) },
    { name: 'Dell XPS 15', slug: 'dell-xps-15', description: 'Powerful performance meets stunning design. Intel Core i7, 16GB RAM, and NVIDIA graphics.', price: 189999, discountPrice: 174999, categoryId: categoryIdMap['computers-laptops'], brand: 'Dell', sku: 'DXPS15-001', stock: 8, isFeatured: true, isDiscount: true, image: img('photo-1593642632823-8f785ba67e45'), specifications: JSON.stringify({ Display: '15.6 inch OLED', Processor: 'Intel Core i7-13700H', RAM: '16GB', Storage: '512GB SSD', Graphics: 'NVIDIA RTX 4050' }) },
    { name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'Industry-leading noise canceling headphones with Auto NC Optimizer and crystal clear hands-free calling.', price: 44999, discountPrice: 39999, categoryId: categoryIdMap['electronics'], brand: 'Sony', sku: 'SWH1000XM5-001', stock: 30, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1505740420928-5e560c06d30e'), specifications: JSON.stringify({ Type: 'Over-Ear', Driver: '30mm', Battery: '30 hours', NoiseCanceling: 'Yes', Weight: '250g' }) },
    { name: 'Apple Watch Series 10', slug: 'apple-watch-series-10', description: 'Thinnest Apple Watch ever with the biggest display. Advanced health features and fitness tracking.', price: 59999, discountPrice: 54999, categoryId: categoryIdMap['electronics'], brand: 'Apple', sku: 'AWS10-001', stock: 20, isFeatured: true, isNewArrival: true, isDiscount: true, image: img('photo-1546868871-7041f2a55e12'), specifications: JSON.stringify({ Display: '46mm OLED', Battery: '18 hours', WaterResistant: '50m', GPS: 'Yes', Sensors: 'Heart rate, SpO2, Temperature' }) },
    { name: 'Nike Air Max 270', slug: 'nike-air-max-270', description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort.', price: 18999, discountPrice: 15999, categoryId: categoryIdMap['shoes'], brand: 'Nike', sku: 'NAM270-001', stock: 50, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1542291026-7eec264c27ff'), specifications: JSON.stringify({ Material: 'Mesh upper', Sole: 'Air Max 270', Closure: 'Lace-up', Weight: '320g' }) },
    { name: 'Adidas Ultraboost Light', slug: 'adidas-ultraboost-light', description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.', price: 22999, discountPrice: 19999, categoryId: categoryIdMap['shoes'], brand: 'Adidas', sku: 'AUL-001', stock: 40, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1608231387042-66d1773070a5'), specifications: JSON.stringify({ Material: 'Primeknit upper', Midsole: 'Light BOOST', Closure: 'Lace-up', Weight: '299g' }) },
    { name: "Levi's 501 Original Fit Jeans", slug: 'levis-501-original-jeans', description: 'The original jean. The blueprint for all jeans to come. The 501 Original is the definitive jean.', price: 8999, discountPrice: 7499, categoryId: categoryIdMap['mens-fashion'], brand: "Levi's", sku: 'L501-001', stock: 100, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1542272604-787c3835535d'), specifications: JSON.stringify({ Material: '100% Cotton', Fit: 'Straight', Wash: 'Medium', Closure: 'Button fly' }) },
    { name: 'H&M Cotton Kurta', slug: 'hm-cotton-kurta', description: 'Comfortable cotton kurta perfect for casual and festive occasions.', price: 3999, discountPrice: 3499, categoryId: categoryIdMap['womens-fashion'], brand: 'H&M', sku: 'HMCK-001', stock: 75, isFeatured: true, isDiscount: true, image: img('photo-1594633312681-425c7b97ccd1'), specifications: JSON.stringify({ Material: '100% Cotton', Fit: 'Regular', Occasion: 'Casual/Festive', Care: 'Machine wash' }) },
    { name: 'Dabur Amla Hair Oil', slug: 'dabur-amla-hair-oil', description: 'Nourish your hair with the goodness of Amla. Prevents hair fall and promotes hair growth.', price: 450, discountPrice: 399, categoryId: categoryIdMap['beauty-personal-care'], brand: 'Dabur', sku: 'DAO-001', stock: 200, isPopular: true, isDiscount: true, image: img('photo-1526947425960-945c6e72858f'), specifications: JSON.stringify({ Volume: '300ml', Type: 'Amla Oil', Suitable: 'All hair types', Ingredients: 'Amla, Mineral Oil' }) },
    { name: 'Himalaya Neem Face Wash', slug: 'himalaya-neem-face-wash', description: 'Deep cleanses and purifies skin with the power of Neem and Turmeric.', price: 350, discountPrice: 299, categoryId: categoryIdMap['beauty-personal-care'], brand: 'Himalaya', sku: 'HNFW-001', stock: 150, isPopular: true, isDiscount: true, image: img('photo-1556228578-0d85b1a4d571'), specifications: JSON.stringify({ Volume: '150ml', Type: 'Face Wash', Suitable: 'All skin types', KeyIngredient: 'Neem, Turmeric' }) },
    { name: 'Prestige Omega Deluxe Fry Pan', slug: 'prestige-omega-deluxe-fry-pan', description: 'Non-stick fry pan with 5-layer coating. Perfect for everyday cooking.', price: 2500, discountPrice: 1999, categoryId: categoryIdMap['home-kitchen'], brand: 'Prestige', sku: 'PODFP-001', stock: 60, isFeatured: true, isDiscount: true, image: img('photo-1556909114-f6e7ad7d3136'), specifications: JSON.stringify({ Diameter: '24cm', Material: 'Aluminium', Coating: '5-layer non-stick', Handle: 'Bakelite' }) },
    { name: 'Milton Thermosteel Flask', slug: 'milton-thermosteel-flask', description: 'Keeps beverages hot or cold for hours. 100% leak-proof and rust-free.', price: 1500, discountPrice: 1299, categoryId: categoryIdMap['home-kitchen'], brand: 'Milton', sku: 'MTF-001', stock: 80, isPopular: true, isDiscount: true, image: img('photo-1602143407151-7111542de6e8'), specifications: JSON.stringify({ Capacity: '1L', Material: 'Stainless Steel', Insulation: 'Hot/Cold', Warranty: '1 year' }) },
    { name: 'Organic Nepal Green Tea', slug: 'organic-nepal-green-tea', description: 'Premium organic green tea from the hills of Nepal. Rich in antioxidants.', price: 800, discountPrice: 699, categoryId: categoryIdMap['grocery'], brand: 'Organic Nepal', sku: 'ONGT-001', stock: 120, isFeatured: true, isNewArrival: true, isDiscount: true, image: img('photo-1556679343-c7306c1976bc'), specifications: JSON.stringify({ Weight: '250g', Type: 'Green Tea', Origin: 'Ilam, Nepal', Certification: 'Organic' }) },
    { name: 'Nepali Basmati Rice 5kg', slug: 'nepali-basmati-rice-5kg', description: 'Premium quality Basmati rice grown in Nepal. Long grain and aromatic.', price: 1200, discountPrice: 999, categoryId: categoryIdMap['grocery'], brand: 'Nepal Rice', sku: 'NBR5K-001', stock: 200, isPopular: true, isDiscount: true, image: img('photo-1586201375761-83865001e31c'), specifications: JSON.stringify({ Weight: '5kg', Type: 'Basmati', Origin: 'Nepal', ShelfLife: '24 months' }) },
    { name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', description: 'Extra thick yoga mat with non-slip surface. Perfect for yoga and exercise.', price: 2500, discountPrice: 1999, categoryId: categoryIdMap['sports'], brand: 'YogaPro', sku: 'YMP-001', stock: 45, isFeatured: true, isDiscount: true, image: img('photo-1601925260368-ae2f83cf8b7f'), specifications: JSON.stringify({ Thickness: '6mm', Material: 'TPE', Size: '183cm x 61cm', Weight: '900g' }) },
    { name: 'Dumbbells Set 20kg', slug: 'dumbbells-set-20kg', description: 'Adjustable dumbbells set for home gym. Cast iron with chrome finish.', price: 8500, discountPrice: 7499, categoryId: categoryIdMap['sports'], brand: 'FitPro', sku: 'DS20K-001', stock: 25, isFeatured: true, isDiscount: true, image: img('photo-1534438327276-14e5300c3a48'), specifications: JSON.stringify({ Weight: '20kg (adjustable)', Material: 'Cast Iron', Finish: 'Chrome', Grip: 'Knurled' }) },
    { name: 'The Palace of Illusions', slug: 'palace-of-illusions', description: 'A retelling of the Mahabharata from Draupadi\'s perspective. Bestselling novel by Chitra Banerjee Divakaruni.', price: 800, discountPrice: 699, categoryId: categoryIdMap['books'], brand: 'Pan Macmillan', sku: 'POI-001', stock: 35, isFeatured: true, isDiscount: true, image: img('photo-1544947950-fa07a98d237f'), specifications: JSON.stringify({ Pages: '384', Publisher: 'Pan Macmillan', Language: 'English', ISBN: '978-0330516327' }) },
    { name: 'Nepal: A History', slug: 'nepal-history-book', description: 'Comprehensive history of Nepal from ancient times to modern era.', price: 1500, discountPrice: 1299, categoryId: categoryIdMap['books'], brand: 'Cambridge', sku: 'NHB-001', stock: 20, isFeatured: true, isDiscount: true, image: img('photo-1543002588-bfa74002ed7e'), specifications: JSON.stringify({ Pages: '720', Publisher: 'Cambridge University Press', Language: 'English', ISBN: '978-0521804707' }) },
    { name: 'Checked Flannel Shirt', slug: 'checked-flannel-shirt', description: 'Warm and stylish checked flannel shirt for winter.', price: 2199, discountPrice: 1799, categoryId: categoryIdMap['mens-fashion'], brand: 'Mast & Harbour', sku: 'CFS-001', stock: 90, isPopular: true, isDiscount: true, image: img('photo-1603252109303-2751441dd157'), specifications: JSON.stringify({ Material: 'Cotton Flannel', Fit: 'Regular', Pattern: 'Checked' }) },
    { name: 'Graphic Print T-Shirt', slug: 'graphic-print-tshirt', description: 'Trendy graphic print t-shirt for casual wear.', price: 999, discountPrice: 799, categoryId: categoryIdMap['mens-fashion'], brand: 'Roadster', sku: 'GPT-001', stock: 150, isNewArrival: true, isDiscount: true, image: img('photo-1503341504253-dff4815485f1'), specifications: JSON.stringify({ Material: 'Cotton', Fit: 'Slim', Pattern: 'Graphic' }) },
    { name: 'Chino Shorts Khaki', slug: 'chino-shorts-khaki', description: 'Comfortable chino shorts for summer.', price: 1799, discountPrice: 1399, categoryId: categoryIdMap['mens-fashion'], brand: 'H&M', sku: 'CSK-001', stock: 110, isDiscount: true, image: img('photo-1591195853828-11db59a44f6b'), specifications: JSON.stringify({ Material: 'Cotton', Fit: 'Regular', Length: 'Knee', Color: 'Khaki' }) },
    { name: 'Leather Bomber Jacket', slug: 'leather-bomber-jacket', description: 'Premium leather bomber jacket for a rugged look.', price: 8999, discountPrice: 7499, categoryId: categoryIdMap['mens-fashion'], brand: 'Wildcraft', sku: 'LBJ-001', stock: 30, isFeatured: true, isDiscount: true, image: img('photo-1551028719-00167b16eac5'), specifications: JSON.stringify({ Material: 'Genuine Leather', Fit: 'Regular', Lining: 'Polyester' }) },
    { name: 'V-Neck Sweater', slug: 'vneck-sweater', description: 'Classic V-neck sweater for layering.', price: 2799, discountPrice: 2199, categoryId: categoryIdMap['mens-fashion'], brand: 'Allen Solly', sku: 'VNS-001', stock: 65, isDiscount: true, image: img('photo-1611312449408-fcece27cdbb7'), specifications: JSON.stringify({ Material: 'Wool Blend', Fit: 'Regular', Neck: 'V-Neck' }) },
    { name: 'Linen Casual Shirt', slug: 'linen-casual-shirt', description: 'Breathable linen shirt for summer days.', price: 2599, discountPrice: 1999, categoryId: categoryIdMap['mens-fashion'], brand: 'FabIndia', sku: 'LCS-001', stock: 75, isNewArrival: true, isDiscount: true, image: img('photo-1596755094514-f87e34085b2c'), specifications: JSON.stringify({ Material: 'Linen', Fit: 'Relaxed', Occasion: 'Casual' }) },
    { name: 'Satin Evening Dress', slug: 'satin-evening-dress', description: 'Elegant satin evening dress for parties.', price: 6999, discountPrice: 5599, categoryId: categoryIdMap['womens-fashion'], brand: 'Mango', sku: 'SED-001', stock: 35, isFeatured: true, isDiscount: true, image: img('photo-1595777457583-95e059d581b8'), specifications: JSON.stringify({ Material: 'Satin', Length: 'Midi', Occasion: 'Evening' }) },
    { name: 'Block Print Saree', slug: 'block-print-saree', description: 'Traditional block print saree for festivals.', price: 4999, discountPrice: 3999, categoryId: categoryIdMap['womens-fashion'], brand: 'FabIndia', sku: 'BPS-001', stock: 40, isFeatured: true, isDiscount: true, image: img('photo-1610030469983-98e550d6193c'), specifications: JSON.stringify({ Material: 'Cotton', Length: '5.5m', Pattern: 'Block Print' }) },
    { name: 'Top Stitched Blazer', slug: 'top-stitched-blazer', description: 'Tailored blazer for a power look.', price: 5999, discountPrice: 4799, categoryId: categoryIdMap['womens-fashion'], brand: 'Only', sku: 'TSB-001', stock: 30, isNewArrival: true, isDiscount: true, image: img('photo-1591369822096-ffd140ec948f'), specifications: JSON.stringify({ Material: 'Polyester Blend', Fit: 'Slim', Closure: 'Single Button' }) },
    { name: 'Printed Maxi Dress', slug: 'printed-maxi-dress', description: 'Flowing maxi dress for vacation vibes.', price: 4299, discountPrice: 3399, categoryId: categoryIdMap['womens-fashion'], brand: 'H&M', sku: 'PMD-001', stock: 50, isDiscount: true, image: img('photo-1572804013309-59a88b7e92f1'), specifications: JSON.stringify({ Material: 'Viscose', Length: 'Maxi', Pattern: 'Printed' }) },
    { name: 'Chiffon Dupatta', slug: 'chiffon-dupatta', description: 'Lightweight chiffon dupatta to complement any outfit.', price: 1299, discountPrice: 999, categoryId: categoryIdMap['womens-fashion'], brand: 'Biba', sku: 'CD-001', stock: 130, isDiscount: true, image: img('photo-1583391733956-6c78276477e2'), specifications: JSON.stringify({ Material: 'Chiffon', Length: '2.2m', Work: 'Embroidered' }) },
    { name: 'Ballet Flats - Red', slug: 'ballet-flats-red', description: 'Comfortable ballet flats in classic red.', price: 2499, discountPrice: 1999, categoryId: categoryIdMap['shoes'], brand: 'Clarks', sku: 'BFR-001', stock: 70, isNewArrival: true, isDiscount: true, image: img('photo-1543163521-1bf539c55dd2'), specifications: JSON.stringify({ Material: 'Synthetic', Type: 'Flat', Color: 'Red' }) },
    { name: 'Stride Walking Shoes', slug: 'stride-walking-shoes', description: 'Supportive walking shoes for daily use.', price: 4599, discountPrice: 3699, categoryId: categoryIdMap['shoes'], brand: 'Skechers', sku: 'SWS-001', stock: 60, isPopular: true, isDiscount: true, image: img('photo-1595950653106-6c9ebd614d3a'), specifications: JSON.stringify({ Type: 'Walking', Material: 'Mesh', Sole: 'Memory Foam' }) },
    { name: 'Desert Boots Tan', slug: 'desert-boots-tan', description: 'Rugged desert boots for outdoor adventures.', price: 5999, discountPrice: 4799, categoryId: categoryIdMap['shoes'], brand: 'Timberland', sku: 'DBT-001', stock: 40, isFeatured: true, isDiscount: true, image: img('photo-1608256246200-53e635b5b65f'), specifications: JSON.stringify({ Material: 'Nubuck Leather', Type: 'Boot', Color: 'Tan' }) },
    { name: 'Canvas Slip-On Shoes', slug: 'canvas-slip-on-shoes', description: 'Easy-going canvas slip-ons for casual days.', price: 1999, discountPrice: 1599, categoryId: categoryIdMap['shoes'], brand: 'Vans', sku: 'CSOS-001', stock: 85, isDiscount: true, image: img('photo-1600185365483-26d7a4cc7519'), specifications: JSON.stringify({ Material: 'Canvas', Type: 'Slip-On', Sole: 'Rubber' }) },
    { name: 'Premium Oxford Shirt', slug: 'premium-oxford-shirt', description: 'Luxury oxford cotton shirt by Hugo Boss. Perfect for boardroom meetings.', price: 8999, discountPrice: 7499, categoryId: categoryIdMap['mens-fashion'], brand: 'Hugo Boss', sku: 'POS-001', stock: 25, isFeatured: true, isDiscount: true, image: img('photo-1602810318383-e386cc2a3ccf'), specifications: JSON.stringify({ Material: '100% Oxford Cotton', Fit: 'Tailored', Cuff: 'Button', Brand: 'Hugo Boss' }) },
    { name: 'Italian Wool Blazer', slug: 'italian-wool-blazer', description: 'Hand-finished Italian wool blazer by Armani Exchange.', price: 24999, discountPrice: 21999, categoryId: categoryIdMap['mens-fashion'], brand: 'Armani Exchange', sku: 'IWB-001', stock: 15, isFeatured: true, isDiscount: true, image: img('photo-1594938298603-c8148c4dae35'), specifications: JSON.stringify({ Material: 'Super 120s Wool', Fit: 'Slim Tailored', Lining: 'Cupro', Origin: 'Italy' }) },
    { name: 'Premium Slim Chinos', slug: 'premium-slim-chinos', description: 'Stretch cotton chinos by Ralph Lauren.', price: 5999, discountPrice: 4999, categoryId: categoryIdMap['mens-fashion'], brand: 'Ralph Lauren', sku: 'PSC-001', stock: 40, isDiscount: true, image: img('photo-1473966968600-fa801b869a1a'), specifications: JSON.stringify({ Material: '98% Cotton 2% Elastane', Fit: 'Slim', Brand: 'Polo Ralph Lauren' }) },
    { name: 'Cashmere V-Neck Sweater', slug: 'cashmere-vneck-sweater', description: 'Pure cashmere sweater by Burberry. Ultimate winter luxury.', price: 32999, discountPrice: 28999, categoryId: categoryIdMap['mens-fashion'], brand: 'Burberry', sku: 'CVS-001', stock: 12, isFeatured: true, isDiscount: true, image: img('photo-1611312449408-fcece27cdbb7'), specifications: JSON.stringify({ Material: '100% Cashmere', Fit: 'Regular', Origin: 'Scotland' }) },
    { name: 'Tailored Three-Piece Suit', slug: 'tailored-three-piece-suit', description: 'Premium three-piece suit by Hugo Boss for weddings and galas.', price: 59999, discountPrice: 54999, categoryId: categoryIdMap['mens-fashion'], brand: 'Hugo Boss', sku: 'TTP-001', stock: 8, isFeatured: true, isDiscount: true, image: img('photo-1594938298603-c8148c4dae35'), specifications: JSON.stringify({ Material: 'Super 150s Wool', Pieces: '3', Fit: 'Slim Tailored', Includes: 'Jacket + Vest + Trousers' }) },
    { name: 'Silk Designer Saree', slug: 'silk-designer-saree', description: 'Handwoven Banarasi silk saree by Sabyasachi.', price: 45999, discountPrice: 39999, categoryId: categoryIdMap['womens-fashion'], brand: 'Sabyasachi', sku: 'SDS-001', stock: 10, isFeatured: true, isDiscount: true, image: img('photo-1610030469983-98e550d6193c'), specifications: JSON.stringify({ Material: 'Banarasi Silk', Work: 'Zari Embroidery', Occasion: 'Wedding/Festive', Length: '6m' }) },
    { name: 'Premium Anarkali Gown', slug: 'premium-anarkali-gown', description: 'Embroidered premium Anarkali gown by Tarun Tahiliani.', price: 38999, discountPrice: 34999, categoryId: categoryIdMap['womens-fashion'], brand: 'Tarun Tahiliani', sku: 'PAG-001', stock: 8, isFeatured: true, isDiscount: true, image: img('photo-1583391733956-6c78276477e2'), specifications: JSON.stringify({ Material: 'Raw Silk', Embroidery: 'Zardozi', Occasion: 'Wedding/Reception' }) },
    { name: 'Italian Leather Handbag', slug: 'italian-leather-handbag', description: 'Premium leather handbag by Michael Kors.', price: 18999, discountPrice: 15999, categoryId: categoryIdMap['womens-fashion'], brand: 'Michael Kors', sku: 'ILH-001', stock: 20, isFeatured: true, isDiscount: true, image: img('photo-1584917865442-de89df76afd3'), specifications: JSON.stringify({ Material: 'Saffiano Leather', Hardware: 'Gold-Tone', Origin: 'Italy' }) },
    { name: 'Premium Palazzo Set', slug: 'premium-palazzo-set', description: 'Designer palazzo set by Anita Dongre.', price: 12999, discountPrice: 10999, categoryId: categoryIdMap['womens-fashion'], brand: 'Anita Dongre', sku: 'PPS-001', stock: 15, isDiscount: true, image: img('photo-1594633312681-425c7b97ccd1'), specifications: JSON.stringify({ Material: 'Chanderi Silk', Print: 'Block Print', Includes: 'Kurta + Palazzo + Dupatta' }) },
    { name: 'Gown - Royal Velvet', slug: 'gown-royal-velvet', description: 'Royal velvet gown by Elie Saab.', price: 89999, discountPrice: 79999, categoryId: categoryIdMap['womens-fashion'], brand: 'Elie Saab', sku: 'GRV-001', stock: 5, isFeatured: true, isDiscount: true, image: img('photo-1566174053879-31528523f8ae'), specifications: JSON.stringify({ Material: 'Velvet', Length: 'Floor', Occasion: 'Red Carpet/Gala', Embellishment: 'Crystal' }) },
    { name: 'Premium Leather Oxford', slug: 'premium-leather-oxford', description: 'Handcrafted leather oxfords by Allen Edmonds.', price: 14999, discountPrice: 12999, categoryId: categoryIdMap['shoes'], brand: 'Allen Edmonds', sku: 'PLO-001', stock: 20, isFeatured: true, isDiscount: true, image: img('photo-1614252369475-531eba835eb1'), specifications: JSON.stringify({ Material: 'Cordovan Leather', Construction: 'Goodyear Welt', Origin: 'USA' }) },
    { name: 'Designer Heels - Jimmy Choo', slug: 'designer-heels-jimmy-choo', description: 'Luxury designer heels by Jimmy Choo.', price: 45999, discountPrice: 39999, categoryId: categoryIdMap['shoes'], brand: 'Jimmy Choo', sku: 'DHJ-001', stock: 10, isFeatured: true, isDiscount: true, image: img('photo-1543163521-1bf539c55dd2'), specifications: JSON.stringify({ Material: 'Patent Leather', Heel: '4 inch', Origin: 'Italy' }) },
    { name: 'Premium Running Shoes', slug: 'premium-running-shoes', description: 'Limited edition running shoes by Nike Air Zoom.', price: 22999, discountPrice: 19999, categoryId: categoryIdMap['shoes'], brand: 'Nike', sku: 'PRS-001', stock: 30, isFeatured: true, isDiscount: true, image: img('photo-1595950653106-6c9ebd614d3a'), specifications: JSON.stringify({ Type: 'Running', Cushion: 'ZoomX', Material: 'Flyknit', Limited: 'Yes' }) },
    { name: 'Handmade Loafers - Gucci', slug: 'handmade-loafers-gucci', description: 'Handmade leather loafers by Gucci with horsebit detail.', price: 65999, discountPrice: 59999, categoryId: categoryIdMap['shoes'], brand: 'Gucci', sku: 'HLG-001', stock: 8, isFeatured: true, isDiscount: true, image: img('photo-1614252369475-531eba835eb1'), specifications: JSON.stringify({ Material: 'Calfskin Leather', Detail: 'Gold Horsebit', Origin: 'Italy', Handmade: 'Yes' }) },
    { name: 'Premium White Sneakers', slug: 'premium-white-sneakers', description: 'Clean white sneakers by Common Projects.', price: 28999, discountPrice: 24999, categoryId: categoryIdMap['shoes'], brand: 'Common Projects', sku: 'PWS-001', stock: 25, isDiscount: true, image: img('photo-1600185365483-26d7a4cc7519'), specifications: JSON.stringify({ Material: 'Nappa Leather', Sole: 'Rubber', Style: 'Minimal' }) },
    { name: 'Chelsea Boots - Dr. Martens', slug: 'chelsea-boots-dr-martens', description: 'Premium Chelsea boots by Dr. Martens.', price: 16999, discountPrice: 14499, categoryId: categoryIdMap['shoes'], brand: 'Dr. Martens', sku: 'CBDM-001', stock: 35, isDiscount: true, image: img('photo-1608256246200-53e635b5b65f'), specifications: JSON.stringify({ Material: 'Smooth Leather', Sole: 'Air Cushion', Style: 'Chelsea' }) },
    { name: 'Valentino Red Gown', slug: 'valentino-red-gown', description: 'Stunning red Valentino gown for galas and red carpet events.', price: 125000, discountPrice: 115000, categoryId: categoryIdMap['womens-fashion'], brand: 'Valentino', sku: 'VRG-001', stock: 5, isFeatured: true, isDiscount: true, image: img('photo-1566174053879-31528523f8ae'), specifications: JSON.stringify({ Material: 'Silk', Color: 'Red', Length: 'Floor', Designer: 'Valentino' }) },
    { name: 'Chanel Cocktail Dress', slug: 'chanel-cocktail-dress', description: 'Classic Chanel cocktail dress with tweed finish.', price: 95000, discountPrice: 85000, categoryId: categoryIdMap['womens-fashion'], brand: 'Chanel', sku: 'CCD-001', stock: 8, isFeatured: true, isDiscount: true, image: img('photo-1595777457583-95e059d581b8'), specifications: JSON.stringify({ Material: 'Tweed', Length: 'Knee', Designer: 'Chanel' }) },
    { name: 'Dior Evening Gown', slug: 'dior-evening-gown', description: 'Elegant Dior evening gown with crystal embellishments.', price: 145000, discountPrice: 132000, categoryId: categoryIdMap['womens-fashion'], brand: 'Dior', sku: 'DEG-001', stock: 4, isFeatured: true, isDiscount: true, image: img('photo-1595777457583-95e059d581b8'), specifications: JSON.stringify({ Material: 'Silk', Embellishment: 'Crystal', Designer: 'Dior' }) },
    { name: 'Gucci Printed Maxi Dress', slug: 'gucci-printed-maxi-dress', description: 'Luxurious Gucci printed maxi dress for special occasions.', price: 78000, discountPrice: 69000, categoryId: categoryIdMap['womens-fashion'], brand: 'Gucci', sku: 'GPMD-001', stock: 12, isFeatured: true, isDiscount: true, image: img('photo-1572804013309-59a88b7e92f1'), specifications: JSON.stringify({ Material: 'Silk Twill', Pattern: 'Floral', Designer: 'Gucci' }) },
    { name: 'Prada Cocktail Dress', slug: 'prada-cocktail-dress', description: 'Sophisticated Prada cocktail dress for evening events.', price: 88000, discountPrice: 79000, categoryId: categoryIdMap['womens-fashion'], brand: 'Prada', sku: 'PCD-001', stock: 10, isFeatured: true, isDiscount: true, image: img('photo-1566174053879-31528523f8ae'), specifications: JSON.stringify({ Material: 'Crepe', Length: 'Midi', Designer: 'Prada' }) },
    { name: 'Armani Evening Dress', slug: 'armani-evening-dress', description: 'Timeless Armani evening dress with elegant draping.', price: 92000, discountPrice: 84000, categoryId: categoryIdMap['womens-fashion'], brand: 'Giorgio Armani', sku: 'AED-001', stock: 9, isFeatured: true, isDiscount: true, image: img('photo-1595777457583-95e059d581b8'), specifications: JSON.stringify({ Material: 'Jersey', Draping: 'Asymmetric', Designer: 'Giorgio Armani' }) },
    { name: 'Versace Medusa Gown', slug: 'versace-medusa-gown', description: 'Iconic Versace gown with Medusa print and gold accents.', price: 110000, discountPrice: 99000, categoryId: categoryIdMap['womens-fashion'], brand: 'Versace', sku: 'VMG-001', stock: 6, isFeatured: true, isDiscount: true, image: img('photo-1566174053879-31528523f8ae'), specifications: JSON.stringify({ Material: 'Silk', Print: 'Medusa', Designer: 'Versace' }) },
    { name: 'Classic White T-Shirt', slug: 'classic-white-tshirt', description: 'Premium cotton white t-shirt. Perfect for everyday wear.', price: 899, discountPrice: 699, categoryId: categoryIdMap['mens-fashion'], brand: 'H&M', sku: 'CWT-001', stock: 200, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1521572163474-6864f9cf17ab'), specifications: JSON.stringify({ Material: '100% Cotton', Fit: 'Regular', Color: 'White', Care: 'Machine wash' }) },
    { name: 'Slim Fit Formal Shirt', slug: 'slim-fit-formal-shirt', description: 'Elegant slim fit formal shirt for office and special occasions.', price: 2499, discountPrice: 1999, categoryId: categoryIdMap['mens-fashion'], brand: 'Van Heusen', sku: 'SFFS-001', stock: 80, isFeatured: true, isDiscount: true, image: img('photo-1602810318383-e386cc2a3ccf'), specifications: JSON.stringify({ Material: 'Cotton Blend', Fit: 'Slim', Pattern: 'Solid', Cuff: 'French' }) },
    { name: 'Casual Polo Shirt', slug: 'casual-polo-shirt', description: 'Comfortable polo shirt perfect for casual outings.', price: 1599, discountPrice: 1299, categoryId: categoryIdMap['mens-fashion'], brand: 'Peter England', sku: 'CPS-001', stock: 120, isPopular: true, isDiscount: true, image: img('photo-1620012253295-c15cc3e65df4'), specifications: JSON.stringify({ Material: 'Cotton Pique', Fit: 'Regular', Collar: 'Polo' }) },
    { name: 'Denim Jacket Classic', slug: 'denim-jacket-classic', description: 'Timeless denim jacket that goes with everything.', price: 4999, discountPrice: 3999, categoryId: categoryIdMap['mens-fashion'], brand: "Levi's", sku: 'DJC-001', stock: 60, isFeatured: true, isDiscount: true, image: img('photo-1576871337622-98d48d1cf531'), specifications: JSON.stringify({ Material: 'Denim', Fit: 'Regular', Wash: 'Light Blue', Pockets: '4' }) },
    { name: 'Formal Black Trousers', slug: 'formal-black-trousers', description: 'Classic black formal trousers for office wear.', price: 3299, discountPrice: 2799, categoryId: categoryIdMap['mens-fashion'], brand: 'Allen Solly', sku: 'FBT-001', stock: 90, isDiscount: true, image: img('photo-1594938298603-c8148c4dae35'), specifications: JSON.stringify({ Material: 'Polyester Blend', Fit: 'Slim', Occasion: 'Formal' }) },
    { name: 'Cargo Pants Utility', slug: 'cargo-pants-utility', description: 'Durable cargo pants with multiple pockets.', price: 2899, discountPrice: 2399, categoryId: categoryIdMap['mens-fashion'], brand: 'Wildcraft', sku: 'CPU-001', stock: 70, isDiscount: true, image: img('photo-1624378439575-d8705ad7ae80'), specifications: JSON.stringify({ Material: 'Cotton', Fit: 'Relaxed', Pockets: '6' }) },
    { name: 'Floral Print Dress', slug: 'floral-print-dress', description: 'Beautiful floral print dress perfect for summer.', price: 3499, discountPrice: 2799, categoryId: categoryIdMap['womens-fashion'], brand: 'Biba', sku: 'FPD-001', stock: 55, isFeatured: true, isNewArrival: true, isDiscount: true, image: img('photo-1595777457583-95e059d581b8'), specifications: JSON.stringify({ Material: 'Georgette', Length: 'Knee', Pattern: 'Floral', Occasion: 'Casual' }) },
    { name: 'Embroidered Kurta Set', slug: 'embroidered-kurta-set', description: 'Elegant embroidered kurta set for festive occasions.', price: 5999, discountPrice: 4999, categoryId: categoryIdMap['womens-fashion'], brand: 'FabIndia', sku: 'EKS-001', stock: 40, isFeatured: true, isDiscount: true, image: img('photo-1610030469983-98e550d6193c'), specifications: JSON.stringify({ Material: 'Cotton Silk', Embroidery: 'Thread Work', Includes: 'Kurta + Bottom' }) },
    { name: 'High Waist Skinny Jeans', slug: 'high-waist-skinny-jeans', description: 'Flattering high waist skinny jeans for women.', price: 3299, discountPrice: 2599, categoryId: categoryIdMap['womens-fashion'], brand: "Levi's", sku: 'HWSJ-001', stock: 85, isPopular: true, isDiscount: true, image: img('photo-1541099649105-f69ad21f3246'), specifications: JSON.stringify({ Material: 'Denim Denim', Fit: 'Skinny', Rise: 'High', Wash: 'Dark' }) },
    { name: 'Cotton Anarkali Suit', slug: 'cotton-anarkali-suit', description: 'Comfortable cotton Anarkali suit for daily wear.', price: 4599, discountPrice: 3699, categoryId: categoryIdMap['womens-fashion'], brand: 'W', sku: 'CAS-001', stock: 45, isDiscount: true, image: img('photo-1583391733956-6c78276477e2'), specifications: JSON.stringify({ Material: 'Cotton', Type: 'Anarkali', Includes: 'Kurta + Bottom + Dupatta' }) },
    { name: 'Party Wear Gown', slug: 'party-wear-gown', description: 'Stunning party wear gown for special occasions.', price: 7999, discountPrice: 6499, categoryId: categoryIdMap['womens-fashion'], brand: 'Zara', sku: 'PWG-001', stock: 25, isFeatured: true, isDiscount: true, image: img('photo-1566174053879-31528523f8ae'), specifications: JSON.stringify({ Material: 'Satin', Length: 'Floor', Occasion: 'Party' }) },
    { name: 'Printed Palazzo Pants', slug: 'printed-palazzo-pants', description: 'Comfortable printed palazzo pants for casual wear.', price: 1899, discountPrice: 1499, categoryId: categoryIdMap['womens-fashion'], brand: 'Biba', sku: 'PPP-001', stock: 95, isPopular: true, isDiscount: true, image: img('photo-1594633312681-425c7b97ccd1'), specifications: JSON.stringify({ Material: 'Rayon', Fit: 'Wide Leg', Pattern: 'Printed' }) },
    { name: 'Pumps Heels - Black', slug: 'pumps-heels-black', description: 'Classic black pumps for formal occasions.', price: 4999, discountPrice: 3999, categoryId: categoryIdMap['shoes'], brand: 'Clarks', sku: 'PHB-001', stock: 50, isFeatured: true, isDiscount: true, image: img('photo-1543163521-1bf539c55dd2'), specifications: JSON.stringify({ Material: 'Leather', Heel: '3 inch', Color: 'Black', Occasion: 'Formal' }) },
    { name: 'Sports Running Shoes', slug: 'sports-running-shoes', description: 'Lightweight running shoes for sports and jogging.', price: 6999, discountPrice: 5499, categoryId: categoryIdMap['shoes'], brand: 'Nike', sku: 'SRS-001', stock: 65, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1595950653106-6c9ebd614d3a'), specifications: JSON.stringify({ Type: 'Running', Material: 'Mesh', Sole: 'Rubber', Cushion: 'Air' }) },
    { name: 'Leather Loafers', slug: 'leather-loafers', description: 'Comfortable leather loafers for casual office wear.', price: 3999, discountPrice: 3299, categoryId: categoryIdMap['shoes'], brand: 'Red Tape', sku: 'LL-001', stock: 75, isDiscount: true, image: img('photo-1614252369475-531eba835eb1'), specifications: JSON.stringify({ Material: 'Genuine Leather', Type: 'Slip-On', Color: 'Brown' }) },
    { name: 'High Top Sneakers', slug: 'high-top-sneakers', description: 'Trendy high top sneakers for street style.', price: 5499, discountPrice: 4499, categoryId: categoryIdMap['shoes'], brand: 'Puma', sku: 'HTS-001', stock: 55, isNewArrival: true, isDiscount: true, image: img('photo-1600185365483-26d7a4cc7519'), specifications: JSON.stringify({ Material: 'Canvas', Type: 'High Top', Closure: 'Lace-up' }) },
    { name: 'Wedge Sandals', slug: 'wedge-sandals', description: 'Comfortable wedge sandals for women.', price: 2999, discountPrice: 2399, categoryId: categoryIdMap['shoes'], brand: 'Bata', sku: 'WS-001', stock: 80, isDiscount: true, image: img('photo-1560343090-f0409e92791a'), specifications: JSON.stringify({ Material: 'Synthetic', Heel: '2.5 inch', Color: 'Beige' }) },
    { name: 'Sunglasses - UV Protection', slug: 'sunglasses-uv-protection', description: 'Stylish sunglasses with 100% UV protection. Lightweight and durable frame.', price: 3500, discountPrice: 2999, categoryId: categoryIdMap['accessories'], brand: 'SunStyle', sku: 'SUVP-001', stock: 80, isFeatured: true, isPopular: true, isDiscount: true, image: img('photo-1572635196237-14b3f281503f'), specifications: JSON.stringify({ Lens: 'Polarized', UVProtection: '100%', Frame: 'TR90', Weight: '25g' }) },
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (!existing) {
      const { image, ...productData } = product;
      const created = await prisma.product.create({ data: productData });
      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: image,
          alt: created.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      console.log('Created product:', created.name);
    } else {
      // Update existing product images
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.create({
        data: {
          productId: existing.id,
          url: product.image,
          alt: existing.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      console.log('Updated image for:', existing.name);
    }
  }

  const deliveryZones = [
    { name: 'Inside Kathmandu Valley', description: 'Same day or next day delivery', charge: 100, sortOrder: 1 },
    { name: 'Outside Kathmandu Valley', description: '2-4 business days', charge: 150, sortOrder: 2 },
    { name: 'Remote Areas', description: '5-7 business days', charge: 250, sortOrder: 3 },
  ];

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.upsert({ where: { name: zone.name }, update: {}, create: zone });
  }
  console.log('Created delivery zones');

  await prisma.coupon.upsert({
    where: { code: 'DASH10' },
    update: {},
    create: {
      code: 'DASH10',
      description: '10% off on your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscount: 1000,
      usageLimit: 100,
      startsAt: new Date('2026-01-01'),
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  });
  console.log('Created coupon');

  console.log('Seeding completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
