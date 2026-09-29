import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records in reverse order of foreign key dependencies
  console.log('Cleaning existing records...');
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.review.deleteMany().catch(() => {});
  await prisma.couponUsage.deleteMany().catch(() => {});
  await prisma.coupon.deleteMany().catch(() => {});
  await prisma.payment.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.wishlistItem.deleteMany().catch(() => {});
  await prisma.wishlist.deleteMany().catch(() => {});
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.cart.deleteMany().catch(() => {});
  await prisma.inventory.deleteMany().catch(() => {});
  await prisma.productVariant.deleteMany().catch(() => {});
  await prisma.productImage.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.address.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // 2. Create Users (Admin and Customers)
  console.log('Creating users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123456', salt);
  const customerPassword = await bcrypt.hash('Customer@123456', salt);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@apexcart.com',
      passwordHash: adminPassword,
      firstName: 'Apex',
      lastName: 'Admin',
      phone: '+91 9876543210',
      role: 'ADMIN' as any,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'rahul.sharma@example.com',
      passwordHash: customerPassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '+91 9811223344',
      role: 'CUSTOMER' as any,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      addresses: {
        create: [
          {
            fullName: 'Rahul Sharma',
            addressLine1: 'Flat 402, Skyline Residency, Outer Ring Road',
            addressLine2: 'Bellandur',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            phone: '+91 9811223344',
            isDefault: true,
            type: 'SHIPPING',
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'priya.patel@example.com',
      passwordHash: customerPassword,
      firstName: 'Priya',
      lastName: 'Patel',
      phone: '+91 9822334455',
      role: 'CUSTOMER' as any,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      addresses: {
        create: [
          {
            fullName: 'Priya Patel',
            addressLine1: 'B-12, Green Park Society, University Road',
            addressLine2: 'Navrangpura',
            city: 'Ahmedabad',
            state: 'Gujarat',
            postalCode: '380009',
            country: 'India',
            phone: '+91 9822334455',
            isDefault: true,
            type: 'SHIPPING',
          },
        ],
      },
    },
  });

  // 3. Create Categories
  console.log('Creating categories...');
  const categoriesData = [
    {
      name: 'Electronics & Audio',
      slug: 'electronics',
      description: 'Premium headphones, audio systems, smartwatches, and gadgets.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'Laptops & Computers',
      slug: 'computers',
      description: 'High-performance laptops, mechanical keyboards, and 4K monitors.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'Smartphones & Wearables',
      slug: 'smartphones',
      description: 'Flagship mobile phones, smart bands, and magnetic wireless chargers.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'Home & Ergonomic Office',
      slug: 'home-office',
      description: 'Ergonomic task chairs, motorized standing desks, and ambient light bars.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      name: 'Apparel & Lifestyle',
      slug: 'fashion',
      description: 'Minimalist luxury apparel, breathable sneakers, and travel backpacks.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      name: 'Photography & Optics',
      slug: 'photography',
      description: 'Mirrorless 4K cameras, prime cinema lenses, and studio stabilizers.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  // 4. Create 20+ Realistic Products with Variants, Images, and Inventory
  console.log('Creating 20+ products with variants and inventory...');

  const productsData = [
    {
      title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      description: 'Industry-leading noise cancellation optimized with two processors and 8 microphones. Enjoy crystal clear hands-free calling, up to 30 hours of battery life, and ultra-comfortable lightweight design.',
      brand: 'Sony',
      sku: 'SNY-WH1000XM5',
      price: 29990,
      salePrice: 26990,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'electronics',
      rating: 4.8,
      reviewCount: 34,
      specifications: JSON.stringify({
        'Battery Life': '30 Hours (ANC On)',
        'Bluetooth Version': '5.2 with LDAC support',
        'Weight': '250 grams',
        'Noise Cancellation': 'Dual Processor V1 + QN1',
        'Warranty': '1 Year Manufacturer Warranty'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 Black front view', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 earcup detail', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { name: 'Black', sku: 'SNY-WH1000XM5-BLK', price: 29990, salePrice: 26990, stock: 45, color: 'Black' },
        { name: 'Silver', sku: 'SNY-WH1000XM5-SLV', price: 29990, salePrice: 26990, stock: 30, color: 'Silver' },
        { name: 'Midnight Blue', sku: 'SNY-WH1000XM5-BLU', price: 30990, salePrice: 27990, stock: 15, color: 'Midnight Blue' },
      ],
      stock: 90,
    },
    {
      title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
      slug: 'apple-macbook-pro-16-m3-max',
      description: 'The most advanced Mac laptop ever engineered for extreme workflows. Powered by the M3 Max chip with a 14-core CPU and 30-core GPU, Liquid Retina XDR display with 1600 nits peak brightness.',
      brand: 'Apple',
      sku: 'APL-MBP16-M3M',
      price: 349900,
      salePrice: 329900,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'computers',
      rating: 4.9,
      reviewCount: 48,
      specifications: JSON.stringify({
        'Processor': 'Apple M3 Max (14-Core CPU, 30-Core GPU)',
        'Unified Memory': '36GB Unified Memory',
        'Storage': '1TB Superfast PCIe Gen4 NVMe SSD',
        'Display': '16.2-inch Liquid Retina XDR (3456x2234)',
        'Ports': '3x Thunderbolt 4, HDMI 2.1, MagSafe 3, SDXC card slot',
        'Battery Life': 'Up to 22 hours'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Pro 16 Space Black', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Pro keyboard and trackpad', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { name: 'Space Black / 36GB / 1TB', sku: 'APL-MBP16-M3M-SB', price: 349900, salePrice: 329900, stock: 18, color: 'Space Black', size: '1TB' },
        { name: 'Silver / 36GB / 1TB', sku: 'APL-MBP16-M3M-SLV', price: 349900, salePrice: 329900, stock: 12, color: 'Silver', size: '1TB' },
      ],
      stock: 30,
    },
    {
      title: 'Bose QuietComfort Ultra Spatial Audio Earbuds',
      slug: 'bose-quietcomfort-ultra-earbuds',
      description: 'Revolutionary spatial audio brings your sound right in front of you. CustomTune technology personalizes sound and silence specifically to your ear canals.',
      brand: 'Bose',
      sku: 'BSE-QCU-EAR',
      price: 25900,
      salePrice: 22900,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'electronics',
      rating: 4.7,
      reviewCount: 22,
      specifications: JSON.stringify({
        'Noise Cancellation': 'Active Noise Cancelling with Aware Mode',
        'Battery Life': '6 hours (24 hours total with charging case)',
        'Water Resistance': 'IPX4 Splashproof',
        'Connectivity': 'Bluetooth 5.3 AptX Adaptive'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', altText: 'Bose QuietComfort Ultra Earbuds', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Black', sku: 'BSE-QCU-EAR-BLK', price: 25900, salePrice: 22900, stock: 40, color: 'Black' },
        { name: 'White Smoke', sku: 'BSE-QCU-EAR-WHT', price: 25900, salePrice: 22900, stock: 25, color: 'White Smoke' },
      ],
      stock: 65,
    },
    {
      title: 'Herman Miller Aeron Ergonomic Task Chair',
      slug: 'herman-miller-aeron-chair',
      description: 'The benchmark for ergonomic office seating. Pellicle 8Z breathable mesh distributes weight evenly, PostureFit SL supports the sacrum and lumbar, fully adjustable arms.',
      brand: 'Herman Miller',
      sku: 'HM-AERON-CHAIR',
      price: 125000,
      salePrice: 114900,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'home-office',
      rating: 5.0,
      reviewCount: 19,
      specifications: JSON.stringify({
        'Material': '8Z Pellicle Elastomeric Suspension',
        'Mechanism': 'Harmonic 2 Tilt with Forward Angle',
        'Weight Capacity': '159 kg (350 lbs)',
        'Warranty': '12-Year Herman Miller Factory Warranty'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1580481077195-c3a9f3f58e71?auto=format&fit=crop&w=800&q=80', altText: 'Herman Miller Aeron Chair Mineral', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Graphite / Size B (Medium)', sku: 'HM-AERON-GRP-B', price: 125000, salePrice: 114900, stock: 15, color: 'Graphite', size: 'Size B' },
        { name: 'Mineral / Size B (Medium)', sku: 'HM-AERON-MIN-B', price: 132000, salePrice: 121900, stock: 8, color: 'Mineral', size: 'Size B' },
      ],
      stock: 23,
    },
    {
      title: 'Dell UltraSharp 32" 4K Thunderbolt Curved Hub Monitor (U3224KB)',
      slug: 'dell-ultrasharp-32-4k-curved-hub-monitor',
      description: 'Experience stunning clarity and vibrant color with IPS Black technology. Built-in 4K dual gain HDR webcam, 140W power delivery Thunderbolt 4 hub, and integrated dual 14W speakers.',
      brand: 'Dell',
      sku: 'DEL-U3224KB',
      price: 89900,
      salePrice: 81900,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'computers',
      rating: 4.8,
      reviewCount: 16,
      specifications: JSON.stringify({
        'Resolution': '6K UHD 6144 x 3456 at 60 Hz (IPS Black)',
        'Color Gamut': '99% DCI-P3, 100% sRGB',
        'Connectivity': 'Thunderbolt 4 (140W PD), HDMI 2.1, DP 2.1, 2.5Gbps RJ45',
        'Webcam': 'Integrated 4K Dual Gain HDR Webcam'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', altText: 'Dell UltraSharp Monitor setup', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Standard 32" Stand', sku: 'DEL-U3224KB-STD', price: 89900, salePrice: 81900, stock: 12, size: '32-inch' },
      ],
      stock: 12,
    },
    {
      title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Storage)',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Titanium frame with Galaxy AI live translate, Circle to Search, and pro-visual 200MP quad-telephoto camera system with Snapdragon 8 Gen 3 for Galaxy.',
      brand: 'Samsung',
      sku: 'SAM-S24U-512',
      price: 139999,
      salePrice: 129999,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'smartphones',
      rating: 4.9,
      reviewCount: 42,
      specifications: JSON.stringify({
        'Display': '6.8" Dynamic AMOLED 2X, 120Hz, 2600 nits',
        'Camera': '200MP + 50MP 5x + 10MP 3x + 12MP Ultra-wide',
        'Battery': '5000 mAh with 45W Fast Charging',
        'Stylus': 'Embedded S-Pen included'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', altText: 'Samsung Galaxy S24 Ultra Titanium Gray', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Titanium Gray / 512GB', sku: 'SAM-S24U-512-TGY', price: 139999, salePrice: 129999, stock: 25, color: 'Titanium Gray', size: '512GB' },
        { name: 'Titanium Black / 512GB', sku: 'SAM-S24U-512-TBK', price: 139999, salePrice: 129999, stock: 30, color: 'Titanium Black', size: '512GB' },
      ],
      stock: 55,
    },
    {
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
      slug: 'keychron-q1-pro-wireless-custom-keyboard',
      description: 'Full CNC machined 6063 aluminum body, double-gasket design, QMK/VIA programmable, hot-swappable switches with South-facing RGB backlighting.',
      brand: 'Keychron',
      sku: 'KEY-Q1PRO-RD',
      price: 18990,
      salePrice: 16490,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'computers',
      rating: 4.7,
      reviewCount: 15,
      specifications: JSON.stringify({
        'Case Material': 'Full CNC Machined Aluminum',
        'Keycaps': 'KSA Profile Double-shot PBT',
        'Switches': 'Keychron K Pro Red (Linear) / Brown (Tactile)',
        'Connectivity': 'Bluetooth 5.1 & Type-C Wired'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', altText: 'Keychron Custom Keyboard top view', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Carbon Black / Red Linear', sku: 'KEY-Q1PRO-BLK-RED', price: 18990, salePrice: 16490, stock: 20, color: 'Carbon Black' },
        { name: 'Silver Grey / Brown Tactile', sku: 'KEY-Q1PRO-SLV-BRN', price: 18990, salePrice: 16490, stock: 15, color: 'Silver Grey' },
      ],
      stock: 35,
    },
    {
      title: 'Sony Alpha 7 IV Full-Frame Hybrid Mirrorless Camera (Body Only)',
      slug: 'sony-alpha-7-iv-mirrorless-camera',
      description: '33MP full-frame Exmor R back-illuminated sensor, BIONZ XR processing engine, 4K 60p 10-bit 4:2:2 recording, real-time eye AF for human, animal, and bird.',
      brand: 'Sony',
      sku: 'SNY-ILCE7M4',
      price: 214990,
      salePrice: 199990,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'photography',
      rating: 4.9,
      reviewCount: 29,
      specifications: JSON.stringify({
        'Sensor': '33.0 Megapixel Full-Frame Exmor R CMOS',
        'Stabilization': '5-Axis Optical In-Body Image Stabilization',
        'Video Format': '4K 60p Super35, S-Cinetone, 10-Bit 4:2:2',
        'Viewfinder': '3.68 million-dot OLED Quad-VGA'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', altText: 'Sony Alpha 7 IV camera front', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Camera Body Only', sku: 'SNY-ILCE7M4-BODY', price: 214990, salePrice: 199990, stock: 10, color: 'Black' },
        { name: 'With 28-70mm Zoom Lens', sku: 'SNY-ILCE7M4-KIT', price: 232990, salePrice: 217990, stock: 8, color: 'Black' },
      ],
      stock: 18,
    },
    {
      title: 'Logitech MX Master 3S Wireless Performance Mouse',
      slug: 'logitech-mx-master-3s-wireless-mouse',
      description: 'Quiet Click technology with 90% less click noise, 8000 DPI track-on-glass sensor, and MagSpeed electromagnetic scroll wheel that scrolls 1,000 lines per second.',
      brand: 'Logitech',
      sku: 'LOG-MXM3S',
      price: 10995,
      salePrice: 8995,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'computers',
      rating: 4.8,
      reviewCount: 55,
      specifications: JSON.stringify({
        'DPI Range': '200 to 8000 DPI (Any surface including glass)',
        'Battery': '500 mAh rechargeable Li-Po (Up to 70 days)',
        'Buttons': '7 buttons (Left/Right, Back/Forward, App-Switch, Wheel Mode-shift, Middle click)'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', altText: 'Logitech MX Master 3S on desk', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Graphite', sku: 'LOG-MXM3S-GRP', price: 10995, salePrice: 8995, stock: 50, color: 'Graphite' },
        { name: 'Pale Grey', sku: 'LOG-MXM3S-GRY', price: 10995, salePrice: 8995, stock: 25, color: 'Pale Grey' },
      ],
      stock: 75,
    },
    {
      title: 'Nike Air Zoom Pegasus 40 Running Shoes',
      slug: 'nike-air-zoom-pegasus-40',
      description: 'A springy ride for any run with responsive Nike React technology combined with dual Zoom Air units for a balanced, energized transition through your stride.',
      brand: 'Nike',
      sku: 'NKE-PEG40',
      price: 11895,
      salePrice: 9495,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'fashion',
      rating: 4.6,
      reviewCount: 38,
      specifications: JSON.stringify({
        'Cushioning': 'Nike React foam with forefoot and heel Air Zoom units',
        'Surface': 'Road Running, Track, Daily Jogging',
        'Closure': 'Lace-up with engineered midfoot band'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', altText: 'Nike Air Zoom Pegasus Crimson', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Crimson Red / UK 8', sku: 'NKE-PEG40-RED-8', price: 11895, salePrice: 9495, stock: 20, color: 'Crimson Red', size: 'UK 8' },
        { name: 'Crimson Red / UK 9', sku: 'NKE-PEG40-RED-9', price: 11895, salePrice: 9495, stock: 22, color: 'Crimson Red', size: 'UK 9' },
        { name: 'Pure White / UK 9', sku: 'NKE-PEG40-WHT-9', price: 11895, salePrice: 9495, stock: 15, color: 'Pure White', size: 'UK 9' },
      ],
      stock: 57,
    },
    {
      title: 'Peak Design Everyday Backpack 20L V2',
      slug: 'peak-design-everyday-backpack-20l-v2',
      description: 'Iconic award-winning everyday camera and laptop backpack. MagLatch magnetic hardware, dual weatherproof side zippers, FlexFold customizable dividers.',
      brand: 'Peak Design',
      sku: 'PD-EDBP-20L',
      price: 27990,
      salePrice: 24990,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'fashion',
      rating: 4.9,
      reviewCount: 20,
      specifications: JSON.stringify({
        'Capacity': '20 Liters (Expands to 23L)',
        'Laptop Sleeve': 'Holds up to 15" / 16" MacBook Pro',
        'Weatherproofing': '100% recycled 400D nylon canvas shell'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', altText: 'Peak Design Backpack Charcoal', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Charcoal / 20L', sku: 'PD-EDBP-20L-CHR', price: 27990, salePrice: 24990, stock: 14, color: 'Charcoal', size: '20L' },
        { name: 'Black / 20L', sku: 'PD-EDBP-20L-BLK', price: 27990, salePrice: 24990, stock: 18, color: 'Black', size: '20L' },
      ],
      stock: 32,
    },
    {
      title: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)',
      slug: 'apple-watch-ultra-2-49mm',
      description: 'The most rugged and capable Apple Watch. Engineered for endurance athletes, outdoor adventurers, and water sports with up to 3000 nits display and precision dual-frequency GPS.',
      brand: 'Apple',
      sku: 'APL-WTCH-U2',
      price: 89900,
      salePrice: 84900,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'smartphones',
      rating: 4.9,
      reviewCount: 27,
      specifications: JSON.stringify({
        'Case': '49mm aerospace-grade titanium',
        'Display': '3000 nits Always-On Retina Sapphire display',
        'Water Resistance': '100m water resistant, EN13319 dive certified',
        'Battery Life': 'Up to 36 hours normal use (72 hours low power mode)'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80', altText: 'Apple Watch Ultra rugged smartwatch', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Orange Ocean Band / 49mm', sku: 'APL-WTCH-U2-ORG', price: 89900, salePrice: 84900, stock: 12, color: 'Orange', size: '49mm' },
        { name: 'Blue Trail Loop / 49mm', sku: 'APL-WTCH-U2-BLU', price: 89900, salePrice: 84900, stock: 16, color: 'Blue', size: '49mm' },
      ],
      stock: 28,
    },
    {
      title: 'BenQ ScreenBar Halo Wireless Monitor Light Bar',
      slug: 'benq-screenbar-halo-wireless',
      description: 'Smart eye-care desk lamp with zero screen glare, auto-dimming precision ambient sensor, wireless controller dial, and patented back-lighting curved mode.',
      brand: 'BenQ',
      sku: 'BNQ-SCRN-HALO',
      price: 17990,
      salePrice: 15490,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'home-office',
      rating: 4.7,
      reviewCount: 14,
      specifications: JSON.stringify({
        'Illuminance': 'Center illuminance 800 lux (height 45cm)',
        'Color Temperature': '2700K to 6500K adjustable',
        'Controls': 'Wireless 2.4GHz touch dial'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', altText: 'BenQ ScreenBar on monitor', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Gunmetal Grey', sku: 'BNQ-SCRN-HALO-GM', price: 17990, salePrice: 15490, stock: 25, color: 'Gunmetal' },
      ],
      stock: 25,
    },
    {
      title: 'DJI Mini 4 Pro Drone with DJI RC 2 Controller',
      slug: 'dji-mini-4-pro-drone-rc2',
      description: 'Under 249g ultra-lightweight drone with omnidirectional active obstacle sensing, 4K/60fps HDR true vertical shooting, and 20km FHD video transmission.',
      brand: 'DJI',
      sku: 'DJI-MINI4-RC2',
      price: 99990,
      salePrice: 92990,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'photography',
      rating: 4.8,
      reviewCount: 31,
      specifications: JSON.stringify({
        'Takeoff Weight': '< 249 grams (No registration required in most zones)',
        'Camera Sensor': '1/1.3-inch CMOS with dual native ISO fusion',
        'Flight Time': '34 minutes (Up to 45 mins with Plus battery)',
        'Transmission': 'DJI O4 up to 20km range'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', altText: 'DJI Mini 4 Pro Drone in flight', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Standard RC 2 Bundle', sku: 'DJI-MINI4-RC2-STD', price: 99990, salePrice: 92990, stock: 14, color: 'Light Grey' },
        { name: 'Fly More Combo Plus', sku: 'DJI-MINI4-RC2-FMC', price: 124990, salePrice: 114990, stock: 9, color: 'Light Grey' },
      ],
      stock: 23,
    },
    {
      title: 'Anker Prime 20,000mAh Power Bank (200W Output)',
      slug: 'anker-prime-20000mah-200w-power-bank',
      description: 'Two ultra-powerful USB-C ports and one USB-A port with a maximum combined output of 200W. Fast charges a 16" MacBook Pro to 50% in just 40 minutes.',
      brand: 'Anker',
      sku: 'ANK-PRIME-20K',
      price: 13999,
      salePrice: 11999,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'electronics',
      rating: 4.8,
      reviewCount: 24,
      specifications: JSON.stringify({
        'Capacity': '20,000 mAh (72Wh)',
        'Max Output': '200W Total (100W single port)',
        'Display': 'Smart digital display showing remaining time and wattage'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1609592424364-c6a6f1b3c959?auto=format&fit=crop&w=800&q=80', altText: 'Anker Prime Power Bank display', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Matte Black', sku: 'ANK-PRIME-20K-BLK', price: 13999, salePrice: 11999, stock: 40, color: 'Matte Black' },
      ],
      stock: 40,
    },
    {
      title: 'Sony FE 24-70mm F2.8 GM II Zoom Lens',
      slug: 'sony-fe-24-70mm-f2-8-gm-ii',
      description: 'The world\'s lightest and smallest F2.8 standard zoom lens. Equipped with four XD Linear motors delivering 4x faster autofocus for flawless still and video capture.',
      brand: 'Sony',
      sku: 'SNY-SEL2470GM2',
      price: 199990,
      salePrice: 184990,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'photography',
      rating: 4.9,
      reviewCount: 18,
      specifications: JSON.stringify({
        'Focal Length': '24-70mm',
        'Maximum Aperture': 'f/2.8 Constant',
        'Filter Thread': '82 mm',
        'Weight': '695 grams (22% lighter than mark I)'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80', altText: 'Sony G Master Lens mounted', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Standard E-Mount', sku: 'SNY-SEL2470GM2-EM', price: 199990, salePrice: 184990, stock: 10, color: 'Black' },
      ],
      stock: 10,
    },
    {
      title: 'Ray-Ban Meta Wayfarer Smart Glasses',
      slug: 'ray-ban-meta-wayfarer-smart-glasses',
      description: 'Iconic Wayfarer design reimagined with Meta AI voice assistance, capture high-res 12MP photos and 1080p videos directly from your perspective with open-ear audio.',
      brand: 'Ray-Ban',
      sku: 'RB-META-WAY',
      price: 29990,
      salePrice: 27490,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'electronics',
      rating: 4.6,
      reviewCount: 23,
      specifications: JSON.stringify({
        'Camera': '12 MP ultra-wide sensor, 1080p video at 30 fps',
        'Audio': '2 custom-built micro speakers + 5-mic array',
        'Battery Life': '4 hours per charge (Up to 36 hours with charging case)'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', altText: 'Ray-Ban Meta Smart Glasses Shiny Black', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Shiny Black / G-15 Green Lens', sku: 'RB-META-WAY-BLK', price: 29990, salePrice: 27490, stock: 20, color: 'Shiny Black' },
        { name: 'Matte Black / Polarized Gradient', sku: 'RB-META-WAY-MTB', price: 32990, salePrice: 29990, stock: 15, color: 'Matte Black' },
      ],
      stock: 35,
    },
    {
      title: 'E-Element Z-88 Mechanical Gaming Keyboard with RGB',
      slug: 'e-element-z88-mechanical-gaming-keyboard',
      description: 'Compact 81-key mechanical keyboard with modular Outemu Blue clicky switches, 10 backlighting modes, anti-ghosting, and ergonomic stepped keycap layout.',
      brand: 'E-Element',
      sku: 'ELE-Z88-RGB',
      price: 4999,
      salePrice: 3899,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'computers',
      rating: 4.4,
      reviewCount: 19,
      specifications: JSON.stringify({
        'Switches': 'Outemu Blue Clicky (Hot-swappable)',
        'Key Count': '81 Keys Tenkeyless',
        'Cable': 'Detachable Type-C Gold Plated'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', altText: 'Mechanical gaming keyboard glowing RGB', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Black / Blue Switch', sku: 'ELE-Z88-BLK-BLU', price: 4999, salePrice: 3899, stock: 35, color: 'Black' },
        { name: 'White / Blue Switch', sku: 'ELE-Z88-WHT-BLU', price: 5199, salePrice: 3999, stock: 20, color: 'White' },
      ],
      stock: 55,
    },
    {
      title: 'Marshall Stanmore III Bluetooth Wireless Home Speaker',
      slug: 'marshall-stanmore-iii-speaker',
      description: 'Fill any room with expansive Marshall signature sound. Redesigned with outward-angled tweeters and updated waveguides to deliver a consistently solid sound that is so wide it chases you around.',
      brand: 'Marshall',
      sku: 'MSH-STAN3',
      price: 38999,
      salePrice: 34999,
      isPublished: true,
      isFeatured: true,
      categorySlug: 'electronics',
      rating: 4.8,
      reviewCount: 26,
      specifications: JSON.stringify({
        'Amplifiers': 'One 50 Watt Class D (Woofer), Two 15 Watt Class D (Tweeters)',
        'Frequency Range': '45–20,000 Hz',
        'Connectivity': 'Bluetooth 5.2, 3.5mm AUX, RCA input'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', altText: 'Marshall Stanmore III speaker vintage grill', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Black', sku: 'MSH-STAN3-BLK', price: 38999, salePrice: 34999, stock: 20, color: 'Black' },
        { name: 'Cream Vintage', sku: 'MSH-STAN3-CRM', price: 39999, salePrice: 35999, stock: 12, color: 'Cream' },
      ],
      stock: 32,
    },
    {
      title: 'Apex Ergonomic Motorized Dual-Motor Standing Desk (140x70cm)',
      slug: 'apex-ergonomic-motorized-standing-desk',
      description: 'Solid walnut finish desktop with heavy-duty steel frame, dual ultra-quiet German motors with 4 programmable memory presets, anti-collision sensor, and cable management tray.',
      brand: 'ApexCraft',
      sku: 'APX-DSK-140',
      price: 36990,
      salePrice: 31990,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'home-office',
      rating: 4.9,
      reviewCount: 15,
      specifications: JSON.stringify({
        'Height Range': '62 cm to 127 cm',
        'Load Capacity': '125 kg',
        'Top Dimensions': '140 cm x 70 cm x 2.5 cm (Solid Walnut Finish)',
        'Warranty': '5 Years on Frame & Motors'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80', altText: 'Apex Motorized Standing Desk Setup', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Walnut Top / Black Frame', sku: 'APX-DSK-140-WB', price: 36990, salePrice: 31990, stock: 15, color: 'Walnut' },
        { name: 'Oak Top / White Frame', sku: 'APX-DSK-140-OW', price: 36990, salePrice: 31990, stock: 10, color: 'Oak' },
      ],
      stock: 25,
    },
    {
      title: 'Garmin Fenix 7X Pro Sapphire Solar Multisport GPS Watch',
      slug: 'garmin-fenix-7x-pro-solar',
      description: 'Ultimate multisport GPS smartwatch with built-in LED flashlight, Power Sapphire solar charging lens, Hill Score, Endurance Score, and weeks of battery life in smartwatch mode.',
      brand: 'Garmin',
      sku: 'GRM-FNX7X-PRO',
      price: 98990,
      salePrice: 89990,
      isPublished: true,
      isFeatured: false,
      categorySlug: 'smartphones',
      rating: 4.9,
      reviewCount: 12,
      specifications: JSON.stringify({
        'Battery Life': 'Up to 37 days with solar in smartwatch mode',
        'Lens': 'Power Sapphire scratch-resistant',
        'Flashlight': 'Multi-LED with variable intensities and red safety strobe',
        'Maps': 'Preloaded TopoActive and SkiView maps'
      }),
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', altText: 'Garmin Fenix Solar smartwatch', isPrimary: true, sortOrder: 0 },
      ],
      variants: [
        { name: 'Carbon Gray Titanium / 51mm', sku: 'GRM-FNX7X-PRO-CG', price: 98990, salePrice: 89990, stock: 14, color: 'Carbon Gray', size: '51mm' },
      ],
      stock: 14,
    },
  ];

  const createdProducts: any[] = [];
  for (const item of productsData) {
    const { categorySlug, images, variants, stock, ...productFields } = item;
    const cat = categories[categorySlug];

    const prod = await prisma.product.create({
      data: {
        ...productFields,
        categoryId: cat.id,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
        inventory: {
          create: {
            quantity: stock,
            reserved: 2,
            minThreshold: 5,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    createdProducts.push(prod);
  }

  // 5. Create Realistic Coupons
  console.log('Creating coupons...');
  const couponsData = [
    {
      code: 'WELCOME10',
      description: '10% instant discount on your first order up to ₹2,000',
      discountType: 'PERCENTAGE' as any,
      discountValue: 10,
      minOrderValue: 1000,
      maxDiscount: 2000,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
    },
    {
      code: 'FLAT500',
      description: 'Flat ₹500 discount on orders above ₹4,999',
      discountType: 'FIXED' as any,
      discountValue: 500,
      minOrderValue: 4999,
      maxDiscount: 500,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      perUserLimit: 2,
      isActive: true,
    },
    {
      code: 'FESTIVE20',
      description: 'Grand Festive 20% off up to ₹5,000',
      discountType: 'PERCENTAGE' as any,
      discountValue: 20,
      minOrderValue: 8000,
      maxDiscount: 5000,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 200,
      perUserLimit: 1,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }

  // 6. Create Sample Orders for customer1
  console.log('Creating sample customer orders...');
  const sampleProduct1 = createdProducts[0]; // Sony Headphones
  const sampleVariant1 = sampleProduct1.variants[0];
  const sampleProduct2 = createdProducts[8]; // Logitech mouse
  const sampleVariant2 = sampleProduct2.variants[0];

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'APX-2026-9041',
      userId: customer1.id,
      status: 'DELIVERED' as any,
      paymentStatus: 'PAID' as any,
      paymentMethod: 'RAZORPAY',
      subtotal: 35985,
      discount: 2000,
      shippingFee: 0,
      tax: 6117,
      total: 40102,
      shippingAddress: JSON.stringify({
        fullName: 'Rahul Sharma',
        addressLine1: 'Flat 402, Skyline Residency, Outer Ring Road',
        addressLine2: 'Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
        phone: '+91 9811223344',
      }),
      trackingNumber: 'DTDC987261543IN',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: sampleProduct1.id,
            variantId: sampleVariant1.id,
            productName: sampleProduct1.title,
            variantName: sampleVariant1.name,
            sku: sampleVariant1.sku,
            price: 26990,
            quantity: 1,
            total: 26990,
          },
          {
            productId: sampleProduct2.id,
            variantId: sampleVariant2.id,
            productName: sampleProduct2.title,
            variantName: sampleVariant2.name,
            sku: sampleVariant2.sku,
            price: 8995,
            quantity: 1,
            total: 8995,
          },
        ],
      },
      payments: {
        create: {
          amount: 40102,
          currency: 'INR',
          provider: 'RAZORPAY',
          transactionId: 'pay_Nq99XhY78216Ka',
          status: 'PAID' as any,
          rawResponse: JSON.stringify({ gateway: 'razorpay', order_id: 'order_Nq99Ka9182', status: 'captured' }),
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'APX-2026-9082',
      userId: customer1.id,
      status: 'PROCESSING' as any,
      paymentStatus: 'PAID' as any,
      paymentMethod: 'UPI',
      subtotal: 16490,
      discount: 500,
      shippingFee: 0,
      tax: 2878,
      total: 18868,
      shippingAddress: JSON.stringify({
        fullName: 'Rahul Sharma',
        addressLine1: 'Flat 402, Skyline Residency, Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
        phone: '+91 9811223344',
      }),
      trackingNumber: 'BLUEDART44810294',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: createdProducts[6].id, // Keychron keyboard
            variantId: createdProducts[6].variants[0].id,
            productName: createdProducts[6].title,
            variantName: createdProducts[6].variants[0].name,
            sku: createdProducts[6].variants[0].sku,
            price: 16490,
            quantity: 1,
            total: 16490,
          },
        ],
      },
      payments: {
        create: {
          amount: 18868,
          currency: 'INR',
          provider: 'UPI',
          transactionId: 'upi_txn_9871624510',
          status: 'PAID' as any,
        },
      },
    },
  });

  // 7. Create Reviews (Verified purchases)
  console.log('Creating verified customer reviews...');
  await prisma.review.create({
    data: {
      productId: sampleProduct1.id,
      userId: customer1.id,
      rating: 5,
      title: 'Best active noise cancellation on the market!',
      content: 'I travel weekly and these headphones have changed my flight experience completely. Sound quality is crisp, highs are clear, and battery easily lasts 30+ hours on a single charge.',
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      productId: sampleProduct2.id,
      userId: customer1.id,
      rating: 5,
      title: 'A productivity powerhouse',
      content: 'The quiet clicks are amazing in office environments and the ergonomic shape prevents wrist fatigue during long coding sessions.',
      isApproved: true,
    },
  });

  // 8. Create Customer Notifications
  console.log('Creating initial notifications...');
  await prisma.notification.create({
    data: {
      userId: customer1.id,
      title: 'Order Delivered!',
      message: 'Your order #APX-2026-9041 has been successfully delivered. Tap to view invoice.',
      type: 'ORDER',
      isRead: false,
      link: `/account/orders/${order1.id}`,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('Admin login: admin@apexcart.com / Admin@123456');
  console.log('Customer login: rahul.sharma@example.com / Customer@123456');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
