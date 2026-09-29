import initialDatabase from '../data/mockDatabase.json';
import { Product, Category, Order, CartSummary, CartItem, User, Address } from '../types';

const STORAGE_KEY = 'apexcart_mock_database_v1';

interface MockDatabase {
  users: any[];
  categories: Category[];
  products: Product[];
  coupons: any[];
  orders: Order[];
  reviews: any[];
}

// Initialize mock DB from localStorage or bundled initialDatabase
export const getMockDB = (): MockDatabase => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse saved mock DB, resetting to defaults', e);
  }

  // Ensure default demo users exist
  const db: MockDatabase = {
    users: [
      {
        id: 'admin-001',
        email: 'admin@aurora.com',
        firstName: 'System',
        lastName: 'Admin',
        phone: '+91 9876543210',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        addresses: [],
      },
      {
        id: 'admin-002',
        email: 'admin@apexcart.com',
        firstName: 'Apex',
        lastName: 'Admin',
        phone: '+91 9876543210',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        addresses: [],
      },
      {
        id: 'cust-001',
        email: 'customer@aurora.com',
        firstName: 'Rahul',
        lastName: 'Sharma',
        phone: '+91 9811223344',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: 'addr-1',
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
      {
        id: 'cust-002',
        email: 'rahul.sharma@example.com',
        firstName: 'Rahul',
        lastName: 'Sharma',
        phone: '+91 9811223344',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: 'addr-2',
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
      ...((initialDatabase as any).users || []),
    ],
    categories: (initialDatabase as any).categories || [],
    products: (initialDatabase as any).products || [],
    coupons: [
      {
        id: 'cpn-1',
        code: 'WELCOME10',
        description: 'Get 10% off on your first order up to ₹500',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 999,
        maxDiscount: 500,
        startDate: new Date(Date.now() - 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        usageLimit: 1000,
        perUserLimit: 1,
        usedCount: 14,
        isActive: true,
      },
      {
        id: 'cpn-2',
        code: 'SAVE20',
        description: 'Mega 20% savings on orders above ₹2,500',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderValue: 2500,
        maxDiscount: 1500,
        startDate: new Date(Date.now() - 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        usageLimit: 500,
        perUserLimit: 1,
        usedCount: 28,
        isActive: true,
      },
      {
        id: 'cpn-3',
        code: 'TECH500',
        description: 'Flat ₹500 off on tech hardware over ₹5,000',
        discountType: 'FIXED',
        discountValue: 500,
        minOrderValue: 5000,
        maxDiscount: null,
        startDate: new Date(Date.now() - 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        usageLimit: 200,
        perUserLimit: 1,
        usedCount: 42,
        isActive: true,
      },
      ...((initialDatabase as any).coupons || []),
    ],
    orders: (initialDatabase as any).orders || [],
    reviews: (initialDatabase as any).reviews || [],
  };

  saveMockDB(db);
  return db;
};

export const saveMockDB = (db: MockDatabase) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save mock database', e);
  }
};

// Current authenticated user helper
const getCurrentMockUser = (db: MockDatabase): any | null => {
  const token = localStorage.getItem('apexcart_access_token');
  if (!token) return null;
  const userId = token.replace('mock_token_', '');
  return db.users.find((u) => u.id === userId) || db.users.find((u) => u.role === 'ADMIN') || null;
};

// Cart storage helper
const getCartKey = (sessionId?: string) => {
  const token = localStorage.getItem('apexcart_access_token');
  if (token) return `apexcart_mock_cart_${token}`;
  return `apexcart_mock_cart_${sessionId || 'guest'}`;
};

const getStoredCartItems = (key: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredCartItems = (key: string, items: CartItem[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const shippingFee = subtotal > 1999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const estimatedTotal = subtotal + shippingFee + tax;

  return {
    id: 'cart-session',
    items,
    itemCount,
    subtotal,
    shippingFee,
    tax,
    estimatedTotal,
  };
};

// Mock Backend Request Dispatcher
export const handleMockRequest = async (config: any): Promise<any> => {
  const db = getMockDB();
  const url = (config.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  const params = config.params || {};
  let body: any = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = config.data;
    }
  }

  const currentUser = getCurrentMockUser(db);
  const sessionId = config.headers?.['X-Session-Id'] || localStorage.getItem('apexcart_session_id') || 'guest';
  const cartKey = getCartKey(sessionId);

  // Artificial slight delay for realistic UI feel
  await new Promise((resolve) => setTimeout(resolve, 80));

  // --- AUTH ROUTES ---
  if (url === '/auth/login' && method === 'post') {
    const { email, password } = body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check against mock users
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If not found, check if it's admin or customer demo
    if (!user) {
      if (cleanEmail === 'admin@aurora.com' || cleanEmail === 'admin@apexcart.com') {
        user = {
          id: 'admin-' + Date.now(),
          email: cleanEmail,
          firstName: 'System',
          lastName: 'Admin',
          role: 'ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          addresses: [],
        };
        db.users.push(user);
        saveMockDB(db);
      } else if (cleanEmail.includes('customer') || cleanEmail.includes('rahul')) {
        user = {
          id: 'cust-' + Date.now(),
          email: cleanEmail,
          firstName: 'Rahul',
          lastName: 'Sharma',
          role: 'CUSTOMER',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          addresses: [],
        };
        db.users.push(user);
        saveMockDB(db);
      }
    }

    if (!user) {
      // In demo mode, accept any non-empty password and register user on the fly if needed
      user = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        firstName: cleanEmail.split('@')[0],
        lastName: 'Demo',
        role: cleanEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        addresses: [],
      };
      db.users.push(user);
      saveMockDB(db);
    }

    const token = 'mock_token_' + user.id;
    return {
      status: 200,
      data: {
        success: true,
        message: 'Login successful',
        data: {
          user,
          tokens: {
            accessToken: token,
            refreshToken: 'refresh_' + token,
          },
        },
      },
    };
  }

  if (url === '/auth/register' && method === 'post') {
    const { email, firstName, lastName, phone } = body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const newUser: any = {
      id: 'cust-' + Date.now(),
      email: cleanEmail,
      firstName: firstName || 'User',
      lastName: lastName || '',
      phone: phone || '',
      role: 'CUSTOMER',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=10b981&color=fff`,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveMockDB(db);

    const token = 'mock_token_' + newUser.id;
    return {
      status: 201,
      data: {
        success: true,
        data: {
          user: newUser,
          tokens: {
            accessToken: token,
            refreshToken: 'refresh_' + token,
          },
        },
      },
    };
  }

  if (url === '/auth/me' && method === 'get') {
    const user = currentUser || db.users[0];
    return {
      status: 200,
      data: {
        success: true,
        data: user,
      },
    };
  }

  if (url === '/auth/me' && method === 'put') {
    if (currentUser) {
      Object.assign(currentUser, body);
      saveMockDB(db);
    }
    return {
      status: 200,
      data: {
        success: true,
        data: currentUser,
      },
    };
  }

  if (url === '/auth/addresses' && method === 'post') {
    const newAddress: Address = {
      id: 'addr-' + Date.now(),
      ...body,
    };
    if (currentUser) {
      currentUser.addresses = currentUser.addresses || [];
      if (newAddress.isDefault) {
        currentUser.addresses.forEach((a: Address) => (a.isDefault = false));
      }
      currentUser.addresses.push(newAddress);
      saveMockDB(db);
    }
    return {
      status: 201,
      data: {
        success: true,
        data: newAddress,
      },
    };
  }

  if (url.startsWith('/auth/addresses/') && method === 'put') {
    const addressId = url.replace('/auth/addresses/', '');
    let updatedAddress: any = null;
    if (currentUser && currentUser.addresses) {
      const idx = currentUser.addresses.findIndex((a: any) => a.id === addressId);
      if (idx !== -1) {
        currentUser.addresses[idx] = { ...currentUser.addresses[idx], ...body };
        updatedAddress = currentUser.addresses[idx];
        saveMockDB(db);
      }
    }
    return {
      status: 200,
      data: {
        success: true,
        data: updatedAddress || body,
      },
    };
  }

  if (url.startsWith('/auth/addresses/') && method === 'delete') {
    const addressId = url.replace('/auth/addresses/', '');
    if (currentUser && currentUser.addresses) {
      currentUser.addresses = currentUser.addresses.filter((a: any) => a.id !== addressId);
      saveMockDB(db);
    }
    return {
      status: 200,
      data: {
        success: true,
        message: 'Address deleted',
      },
    };
  }

  // --- PRODUCTS ROUTES ---
  if (url === '/products' && method === 'get') {
    let list = [...db.products];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (params.category) {
      list = list.filter((p) => p.category?.slug === params.category || p.categoryId === params.category);
    }

    if (params.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase());
    }

    if (params.minPrice) {
      list = list.filter((p) => (p.salePrice || p.price) >= Number(params.minPrice));
    }

    if (params.maxPrice) {
      list = list.filter((p) => (p.salePrice || p.price) <= Number(params.maxPrice));
    }

    if (params.rating) {
      list = list.filter((p) => p.rating >= Number(params.rating));
    }

    if (params.inStock === 'true' || params.inStock === true) {
      list = list.filter((p) => (p.inventory?.quantity || 0) > 0);
    }

    if (params.featured === 'true' || params.featured === true) {
      list = list.filter((p) => p.isFeatured);
    }

    // Sort
    if (params.sortBy === 'price_asc') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (params.sortBy === 'price_desc') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (params.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (params.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const sliced = list.slice(startIndex, startIndex + limit);

    return {
      status: 200,
      data: {
        success: true,
        data: sliced,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  }

  if (url === '/products/suggestions' && method === 'get') {
    const q = (params.q || '').toLowerCase();
    const suggestions = db.products
      .filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        price: p.salePrice || p.price,
        image: p.images?.[0]?.url || '',
      }));

    return {
      status: 200,
      data: {
        success: true,
        data: suggestions,
      },
    };
  }

  if (url.startsWith('/products/') && url.endsWith('/related') && method === 'get') {
    const prodId = url.replace('/products/', '').replace('/related', '');
    const current = db.products.find((p) => p.id === prodId);
    const related = db.products
      .filter((p) => p.id !== prodId && (!current || p.categoryId === current.categoryId))
      .slice(0, 4);

    return {
      status: 200,
      data: {
        success: true,
        data: related.length > 0 ? related : db.products.slice(0, 4),
      },
    };
  }

  if (url.startsWith('/products/') && method === 'get') {
    const slugOrId = url.replace('/products/', '');
    const product = db.products.find((p) => p.slug === slugOrId || p.id === slugOrId);

    if (!product) {
      return {
        status: 404,
        data: { success: false, message: 'Product not found' },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
        data: product,
      },
    };
  }

  // Admin create product
  if (url === '/products' && method === 'post') {
    const newProduct: any = {
      id: 'prod-' + Date.now(),
      slug: (body.title || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      images: body.images || [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', isPrimary: true, sortOrder: 0 }],
      variants: body.variants || [],
      inventory: { quantity: body.stock || 50, minThreshold: 5 },
      ...body,
    };
    db.products.unshift(newProduct);
    saveMockDB(db);

    return {
      status: 201,
      data: {
        success: true,
        data: newProduct,
      },
    };
  }

  // Admin update product
  if (url.startsWith('/products/') && method === 'put') {
    const prodId = url.replace('/products/', '');
    const idx = db.products.findIndex((p) => p.id === prodId);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...body };
      saveMockDB(db);
      return {
        status: 200,
        data: { success: true, data: db.products[idx] },
      };
    }
  }

  // Admin delete product
  if (url.startsWith('/products/') && method === 'delete') {
    const prodId = url.replace('/products/', '');
    db.products = db.products.filter((p) => p.id !== prodId);
    saveMockDB(db);
    return {
      status: 200,
      data: { success: true, message: 'Product deleted' },
    };
  }

  // --- CATEGORIES ROUTES ---
  if (url === '/categories' && method === 'get') {
    return {
      status: 200,
      data: {
        success: true,
        data: db.categories,
      },
    };
  }

  if (url === '/categories' && method === 'post') {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      _count: { products: 0 },
      ...body,
    };
    db.categories.push(newCat);
    saveMockDB(db);
    return {
      status: 201,
      data: { success: true, data: newCat },
    };
  }

  if (url.startsWith('/categories/') && method === 'delete') {
    const catId = url.replace('/categories/', '');
    db.categories = db.categories.filter((c) => c.id !== catId);
    saveMockDB(db);
    return {
      status: 200,
      data: { success: true, message: 'Category removed' },
    };
  }

  // --- CART ROUTES ---
  if (url === '/cart' && method === 'get') {
    const items = getStoredCartItems(cartKey);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary(items),
      },
    };
  }

  if (url === '/cart/items' && method === 'post') {
    const { productId, variantId, quantity = 1 } = body;
    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return { status: 404, data: { success: false, message: 'Product not found' } };
    }

    const variant = variantId ? product.variants?.find((v) => v.id === variantId) : null;
    const price = variant?.salePrice || variant?.price || product.salePrice || product.price;
    const originalPrice = variant?.price || product.price;

    const items = getStoredCartItems(cartKey);
    const existingIndex = items.findIndex(
      (item) => item.productId === productId && (variantId ? item.variantId === variantId : !item.variantId)
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
      items[existingIndex].total = items[existingIndex].quantity * items[existingIndex].price;
    } else {
      const newItem: CartItem = {
        id: 'cart-item-' + Date.now() + Math.random().toString(36).substring(7),
        productId: product.id,
        productName: product.title,
        productSlug: product.slug,
        brand: product.brand,
        image: product.images?.[0]?.url || null,
        variantId: variant?.id || null,
        variantName: variant?.name || null,
        price,
        originalPrice,
        quantity,
        total: price * quantity,
        inStock: true,
        availableStock: variant?.stock || product.inventory?.quantity || 50,
      };
      items.push(newItem);
    }

    saveStoredCartItems(cartKey, items);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary(items),
      },
    };
  }

  if (url.startsWith('/cart/items/') && method === 'put') {
    const itemId = url.replace('/cart/items/', '');
    const { quantity } = body;
    let items = getStoredCartItems(cartKey);

    if (quantity <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      const idx = items.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        items[idx].quantity = quantity;
        items[idx].total = items[idx].price * quantity;
      }
    }

    saveStoredCartItems(cartKey, items);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary(items),
      },
    };
  }

  if (url.startsWith('/cart/items/') && method === 'delete') {
    const itemId = url.replace('/cart/items/', '');
    const items = getStoredCartItems(cartKey).filter((i) => i.id !== itemId);
    saveStoredCartItems(cartKey, items);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary(items),
      },
    };
  }

  if (url === '/cart/clear' && method === 'delete') {
    saveStoredCartItems(cartKey, []);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary([]),
      },
    };
  }

  if (url === '/cart/merge' && method === 'post') {
    const guestCartKey = getCartKey(body.sessionId);
    const guestItems = getStoredCartItems(guestCartKey);
    const userItems = getStoredCartItems(cartKey);

    const merged = [...userItems];
    for (const item of guestItems) {
      const exists = merged.find((i) => i.productId === item.productId && i.variantId === item.variantId);
      if (exists) {
        exists.quantity += item.quantity;
        exists.total = exists.quantity * exists.price;
      } else {
        merged.push(item);
      }
    }

    saveStoredCartItems(cartKey, merged);
    saveStoredCartItems(guestCartKey, []);
    return {
      status: 200,
      data: {
        success: true,
        data: calculateCartSummary(merged),
      },
    };
  }

  // --- WISHLIST ROUTES ---
  if (url === '/wishlist' && method === 'get') {
    const wishlistIds = JSON.parse(localStorage.getItem('apexcart_mock_wishlist') || '[]');
    const items = db.products
      .filter((p) => wishlistIds.includes(p.id))
      .map((p) => ({
        id: 'w-' + p.id,
        productId: p.id,
        createdAt: new Date().toISOString(),
        product: p,
      }));

    return {
      status: 200,
      data: {
        success: true,
        data: items,
      },
    };
  }

  if (url === '/wishlist/toggle' && method === 'post') {
    const { productId } = body;
    let wishlistIds: string[] = JSON.parse(localStorage.getItem('apexcart_mock_wishlist') || '[]');
    const isIn = wishlistIds.includes(productId);

    if (isIn) {
      wishlistIds = wishlistIds.filter((id) => id !== productId);
    } else {
      wishlistIds.push(productId);
    }
    localStorage.setItem('apexcart_mock_wishlist', JSON.stringify(wishlistIds));

    return {
      status: 200,
      data: {
        success: true,
        data: { isInWishlist: !isIn },
      },
    };
  }

  // --- COUPONS ROUTES ---
  if (url === '/coupons/validate' && method === 'post') {
    const { code, cartTotal } = body;
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = db.coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return {
        status: 400,
        data: { success: false, message: 'Invalid or expired coupon code' },
      };
    }

    if (cartTotal < coupon.minOrderValue) {
      return {
        status: 400,
        data: { success: false, message: `Minimum cart value of ₹${coupon.minOrderValue} required for this coupon` },
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return {
      status: 200,
      data: {
        success: true,
        data: {
          code: coupon.code,
          discountAmount,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
      },
    };
  }

  if (url === '/coupons' && method === 'get') {
    return {
      status: 200,
      data: { success: true, data: db.coupons },
    };
  }

  if (url === '/coupons' && method === 'post') {
    const newCoupon = {
      id: 'cpn-' + Date.now(),
      usedCount: 0,
      isActive: true,
      ...body,
    };
    db.coupons.push(newCoupon);
    saveMockDB(db);
    return {
      status: 201,
      data: { success: true, data: newCoupon },
    };
  }

  if (url.startsWith('/coupons/') && method === 'delete') {
    const cpnId = url.replace('/coupons/', '');
    db.coupons = db.coupons.filter((c) => c.id !== cpnId);
    saveMockDB(db);
    return {
      status: 200,
      data: { success: true, message: 'Coupon deleted' },
    };
  }

  // --- ORDERS ROUTES ---
  if (url === '/orders/checkout' && method === 'post') {
    const { shippingAddress, paymentMethod, couponCode, notes } = body;
    const cartItems = getStoredCartItems(cartKey);

    if (cartItems.length === 0) {
      return {
        status: 400,
        data: { success: false, message: 'Cart is empty' },
      };
    }

    const summary = calculateCartSummary(cartItems);
    let discount = 0;
    if (couponCode) {
      const cpn = db.coupons.find((c) => c.code === couponCode.toUpperCase());
      if (cpn) {
        discount = cpn.discountType === 'PERCENTAGE'
          ? Math.min((summary.subtotal * cpn.discountValue) / 100, cpn.maxDiscount || Infinity)
          : cpn.discountValue;
      }
    }

    const total = Math.max(0, summary.estimatedTotal - discount);
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: currentUser?.id || 'guest',
      status: 'CONFIRMED',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      paymentMethod: paymentMethod || 'ONLINE',
      subtotal: summary.subtotal,
      discount,
      shippingFee: summary.shippingFee,
      tax: summary.tax,
      total,
      shippingAddress,
      notes: notes || null,
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
      items: cartItems.map((ci) => ({
        id: 'oi-' + ci.id,
        productId: ci.productId,
        productName: ci.productName,
        variantName: ci.variantName,
        sku: ci.productId,
        price: ci.price,
        quantity: ci.quantity,
        total: ci.total,
        product: {
          id: ci.productId,
          slug: ci.productSlug,
          images: ci.image ? [{ url: ci.image }] : [],
        },
      })),
      user: currentUser
        ? { id: currentUser.id, firstName: currentUser.firstName, lastName: currentUser.lastName, email: currentUser.email }
        : { id: 'guest', firstName: shippingAddress.fullName, lastName: '', email: 'guest@example.com' },
    };

    db.orders.unshift(newOrder);
    saveMockDB(db);

    // Clear cart on successful order
    saveStoredCartItems(cartKey, []);

    return {
      status: 201,
      data: {
        success: true,
        message: 'Order placed successfully',
        data: newOrder,
      },
    };
  }

  if (url === '/orders/my-orders' && method === 'get') {
    const userOrders = db.orders.filter((o) => !currentUser || o.userId === currentUser.id || o.userId === 'guest');
    return {
      status: 200,
      data: {
        success: true,
        data: userOrders,
        pagination: {
          total: userOrders.length,
          page: 1,
          limit: 20,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    };
  }

  if (url === '/orders/admin/all' && method === 'get') {
    let list = [...db.orders];
    if (params.status) {
      list = list.filter((o) => o.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.shippingAddress?.fullName?.toLowerCase().includes(q));
    }

    return {
      status: 200,
      data: {
        success: true,
        data: list,
        pagination: {
          total: list.length,
          page: 1,
          limit: 20,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    };
  }

  if (url.startsWith('/orders/admin/') && url.endsWith('/status') && method === 'patch') {
    const orderId = url.replace('/orders/admin/', '').replace('/status', '');
    const order = db.orders.find((o) => o.id === orderId);
    if (order) {
      if (body.status) order.status = body.status;
      if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
      saveMockDB(db);
    }
    return {
      status: 200,
      data: { success: true, data: order },
    };
  }

  if (url.startsWith('/orders/') && url.endsWith('/cancel') && method === 'post') {
    const orderId = url.replace('/orders/', '').replace('/cancel', '');
    const order = db.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'CANCELLED';
      saveMockDB(db);
    }
    return {
      status: 200,
      data: { success: true, data: order },
    };
  }

  if (url.startsWith('/orders/') && method === 'get') {
    const orderId = url.replace('/orders/', '');
    const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    return {
      status: 200,
      data: {
        success: true,
        data: order || db.orders[0],
      },
    };
  }

  // --- REVIEWS ROUTES ---
  if (url.startsWith('/reviews/product/') && method === 'get') {
    const prodId = url.replace('/reviews/product/', '');
    const productReviews = db.reviews.filter((r) => r.productId === prodId);
    return {
      status: 200,
      data: {
        success: true,
        data: productReviews,
        pagination: { total: productReviews.length, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      },
    };
  }

  if (url === '/reviews' && method === 'post') {
    const newRev = {
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser?.id || 'cust-1',
        firstName: currentUser?.firstName || 'Verified',
        lastName: currentUser?.lastName || 'Shopper',
        avatarUrl: currentUser?.avatarUrl,
      },
      ...body,
    };
    db.reviews.unshift(newRev);
    saveMockDB(db);
    return {
      status: 201,
      data: { success: true, data: newRev },
    };
  }

  if (url === '/reviews/admin/all' && method === 'get') {
    return {
      status: 200,
      data: {
        success: true,
        data: db.reviews,
        pagination: { total: db.reviews.length, page: 1, limit: 50, totalPages: 1, hasNext: false, hasPrev: false },
      },
    };
  }

  // --- ADMIN DASHBOARD STATS ---
  if (url === '/admin/dashboard-stats' && method === 'get') {
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = db.orders.length;
    const totalCustomers = db.users.filter((u) => u.role === 'CUSTOMER').length;
    const totalProducts = db.products.length;
    const pendingOrders = db.orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
    const lowStockProducts = db.products.filter((p) => (p.inventory?.quantity || 0) <= 20).length;

    const salesChart = [
      { date: 'Mon', revenue: Math.round(totalRevenue * 0.12), orders: 4 },
      { date: 'Tue', revenue: Math.round(totalRevenue * 0.18), orders: 7 },
      { date: 'Wed', revenue: Math.round(totalRevenue * 0.14), orders: 5 },
      { date: 'Thu', revenue: Math.round(totalRevenue * 0.22), orders: 9 },
      { date: 'Fri', revenue: Math.round(totalRevenue * 0.16), orders: 6 },
      { date: 'Sat', revenue: Math.round(totalRevenue * 0.25), orders: 11 },
      { date: 'Sun', revenue: Math.round(totalRevenue * 0.20), orders: 8 },
    ];

    return {
      status: 200,
      data: {
        success: true,
        data: {
          metrics: {
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            pendingOrders,
            lowStockProducts,
          },
          recentOrders: db.orders.slice(0, 5),
          recentCustomers: db.users.filter((u) => u.role === 'CUSTOMER').slice(0, 5),
          salesChart,
          lowStockProducts: db.products.filter((p) => (p.inventory?.quantity || 0) <= 20).slice(0, 5),
        },
      },
    };
  }

  if (url === '/admin/customers' && method === 'get') {
    const customers = db.users
      .filter((u) => u.role === 'CUSTOMER')
      .map((c) => ({
        ...c,
        orderCount: db.orders.filter((o) => o.userId === c.id).length,
        totalSpent: db.orders.filter((o) => o.userId === c.id).reduce((sum, o) => sum + (o.total || 0), 0),
      }));

    return {
      status: 200,
      data: {
        success: true,
        data: customers,
        pagination: { total: customers.length, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrev: false },
      },
    };
  }

  // Fallback for unhandled endpoints
  return {
    status: 200,
    data: {
      success: true,
      message: 'Mock handled',
      data: [],
    },
  };
};
