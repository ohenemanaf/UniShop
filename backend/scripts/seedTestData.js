/**
 * Realistic test data for UniShop (Ghana campus marketplace).
 *
 *   npm run seed:test             (re)create the test data set
 *   npm run seed:test -- --remove delete only the test data
 *
 * Safe to run on the shared demo database: it never touches existing rows. Everything it
 * creates is tagged and removed by the same tags:
 *   users     email ends with @unishop.test   (ids start with test-u- / test-s-)
 *   products  id starts with test-p-          (SKUs start with TST-)
 *   contact   email ends with @unishop.test
 * Orders, reviews, wishlists, addresses, payouts, tickets and seller applications all belong to
 * test users, so removing the test users and products removes them too.
 *
 * The data is deterministic (seeded random numbers) and dated relative to today, so the
 * 7/30/90-day analytics always have something to show. Every test account's password is
 * Test@12345.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

const TEST_DOMAIN = 'unishop.test';
const PASSWORD = 'Test@12345';
const REMOVE_ONLY = process.argv.includes('--remove');

// ── Deterministic randomness ───────────────────────────────────────────────
let rngState = 20261112;
const rand = () => { rngState |= 0; rngState = (rngState + 0x6D2B79F5) | 0; let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = list => list[Math.floor(rand() * list.length)];
const chance = p => rand() < p;
const weighted = entries => { const total = entries.reduce((s, [, w]) => s + w, 0); let r = rand() * total; for (const [v, w] of entries) { if ((r -= w) <= 0) return v; } return entries[0][0]; };
const hex = n => Array.from({ length: n }, () => Math.floor(rand() * 16).toString(16)).join('');
const uuid = () => `${hex(8)}-${hex(4)}-4${hex(3)}-${pick(['8', '9', 'a', 'b'])}${hex(3)}-${hex(12)}`;
const money = n => Math.round(n * 100) / 100;
const NOW = new Date();
const daysAgo = (d, hour = int(8, 22)) => { const t = new Date(NOW); t.setDate(t.getDate() - d); t.setHours(hour, int(0, 59), int(0, 59), 0); return t; };
const addHours = (date, h) => { const t = new Date(date.getTime() + h * 3600 * 1000); return t > NOW ? new Date(NOW) : t; };
const img = id => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

// ── Places (universities, halls, GhanaPost-style codes) ────────────────────
const CAMPUSES = [
  { uni: 'University of Ghana', city: 'Legon, Accra', region: 'Greater Accra', code: 'GA', halls: ['Commonwealth Hall', 'Akuafo Hall', 'Legon Hall', 'Volta Hall', 'Mensah Sarbah Hall', 'Jean Nelson Aka Hall', 'Elizabeth Sey Hall'] },
  { uni: 'KNUST', city: 'Kumasi', region: 'Ashanti', code: 'AK', halls: ['Unity Hall', 'University Hall (Katanga)', 'Queens Hall', 'Republic Hall', 'Africa Hall', 'Independence Hall'] },
  { uni: 'University of Cape Coast', city: 'Cape Coast', region: 'Central', code: 'CP', halls: ['Atlantic Hall', 'Oguaa Hall', 'Casely Hayford Hall', 'Valco Hall', 'Kwame Nkrumah Hall'] },
  { uni: 'UPSA', city: 'East Legon, Accra', region: 'Greater Accra', code: 'GA', halls: ['UPSA Hostel Block A', 'UPSA Hostel Block B'] },
  { uni: 'Ashesi University', city: 'Berekuso', region: 'Eastern', code: 'EP', halls: ['Hosanna Hostel', 'Charlotte Hostel', 'Dufie Hostel'] },
  { uni: 'University of Education, Winneba', city: 'Winneba', region: 'Central', code: 'CP', halls: ['Aggrey Hall', 'Simpson Hall', 'Ghartey Hall'] },
  { uni: 'University for Development Studies', city: 'Tamale', region: 'Northern', code: 'NP', halls: ['Nyankpala Hostel', 'Main Campus Hostel'] },
  { uni: 'GCTU', city: 'Tesano, Accra', region: 'Greater Accra', code: 'GA', halls: ['GCTU Hostel', 'Tesano Annex'] },
];
const HOME_AREAS = [['Madina', 'Greater Accra', 'GA'], ['Dansoman', 'Greater Accra', 'GA'], ['Tema Community 18', 'Greater Accra', 'GE'], ['Kasoa', 'Central', 'CX'], ['Asokwa, Kumasi', 'Ashanti', 'AK'], ['Takoradi', 'Western', 'WS'], ['Ho', 'Volta', 'VH'], ['Sunyani', 'Bono', 'BS'], ['Koforidua', 'Eastern', 'EN']];
const gps = code => `${code}-${int(100, 999)}-${int(1000, 9999)}`;
const PREFIXES = { MTN: ['024', '054', '055', '059', '053', '025'], Telecel: ['020', '050'], AT: ['026', '027', '056', '057'] };
const phoneFor = network => `${pick(PREFIXES[network])}${int(1000000, 9999999)}`;

// ── People ──────────────────────────────────────────────────────────────────
const FIRST = ['Ama', 'Kwame', 'Akosua', 'Kofi', 'Efua', 'Yaw', 'Adwoa', 'Kwabena', 'Abena', 'Kojo', 'Esi', 'Kwaku', 'Afia', 'Yaa', 'Kwesi', 'Akua', 'Nana', 'Selorm', 'Elikem', 'Mawuli', 'Delali', 'Dzifa', 'Fafa', 'Edem', 'Naa', 'Nii', 'Korkor', 'Lamisi', 'Fuseini', 'Abdul-Rahman', 'Zainab', 'Mohammed', 'Gifty', 'Prince', 'Bernice', 'Emmanuel', 'Priscilla', 'Daniel', 'Felicia', 'Samuel', 'Jemima', 'Isaac'];
const LAST = ['Mensah', 'Owusu', 'Boateng', 'Asante', 'Osei', 'Agyeman', 'Appiah', 'Darko', 'Ofori', 'Amoah', 'Antwi', 'Quaye', 'Tetteh', 'Addo', 'Lamptey', 'Kpodo', 'Agbeko', 'Dogbe', 'Ahiadzro', 'Issah', 'Alhassan', 'Abubakar', 'Sarpong', 'Frimpong', 'Nyarko', 'Acquah', 'Baidoo', 'Eshun', 'Arthur', 'Annan'];

const SELLERS = [
  { id: 'test-s-01', name: 'Legon Gadgets Hub', email: 'legon.gadgets@unishop.test', network: 'MTN', avatar: '1511707171634-5f897ff02aa9', created: 160 },
  { id: 'test-s-02', name: 'Kumasi Kicks', email: 'kumasi.kicks@unishop.test', network: 'MTN', avatar: '1600185365926-3a2ce3cdb9eb', created: 150 },
  { id: 'test-s-03', name: 'Glow by Adwoa', email: 'glow.adwoa@unishop.test', network: 'Telecel', avatar: '1556228578-8c89e6adf883', created: 140 },
  { id: 'test-s-04', name: 'Hall 7 Sports', email: 'hall7.sports@unishop.test', network: 'AT', avatar: '1579952363873-27f3bade9f55', created: 130 },
];
// Existing demo sellers also get a few test listings so their dashboards have data.
const EXISTING_SELLERS = ['user-seller-1', 'user-seller-2', 'user-seller-3', 'user-seller-4', 'user-seller-5'];

// ── Catalogue: name, category, seller, brand, photo, variants [name, price, compare, stock, attributes] ──
const PRODUCTS = [
  ['Dell Latitude 7490 (UK used)', 'laptops', 'test-s-01', 'Dell', '1588872657578-7efd1f1555ed', 'Business-grade 14" laptop, Core i5 8th gen, backlit keyboard. Battery health above 85%, comes with charger and 3-month shop warranty.', [['i5 / 8GB / 256GB SSD', 3800, 4300, 6, { ram: '8GB', storage: '256GB SSD' }], ['i5 / 16GB / 512GB SSD', 4600, 5200, 3, { ram: '16GB', storage: '512GB SSD' }]]],
  ['HP EliteBook 840 G5 (UK used)', 'laptops', 'user-seller-1', 'HP', '1496181133206-80ce9b88a853', 'Slim aluminium 14" laptop that handles assignments, Zoom and light design work. Full HD screen, fingerprint reader.', [['i5 / 8GB / 256GB SSD', 4200, 4700, 5, { ram: '8GB', storage: '256GB SSD' }], ['i7 / 16GB / 512GB SSD', 5400, null, 2, { ram: '16GB', storage: '512GB SSD' }]]],
  ['MacBook Air M1 (Refurbished)', 'laptops', 'test-s-01', 'Apple', '1611186871348-b1ce696e52c9', 'Silent, fanless and all-day battery. Refurbished with a new battery cycle count under 50. Space Grey.', [['8GB / 256GB', 7900, 8800, 4, { ram: '8GB', storage: '256GB' }], ['16GB / 512GB', 9800, null, 1, { ram: '16GB', storage: '512GB' }]]],
  ['iPhone 11 Pro 64GB (UK used)', 'mobiles', 'test-s-01', 'Apple', '1592750475338-74b7b21085ab', 'Triple camera, 88% battery health, Face ID working. No scratches on the screen.', [['64GB · Midnight Green', 4900, 5600, 3, { storage: '64GB', color: 'Midnight Green' }], ['256GB · Space Grey', 5800, null, 2, { storage: '256GB', color: 'Space Grey' }]]],
  ['Samsung Galaxy A15 128GB', 'mobiles', 'user-seller-1', 'Samsung', '1511707171634-5f897ff02aa9', 'Brand new, sealed in box with one-year warranty. Super AMOLED display and 5000mAh battery.', [['128GB · Blue Black', 2350, 2600, 14, { storage: '128GB', color: 'Blue Black' }], ['128GB · Light Blue', 2350, 2600, 9, { storage: '128GB', color: 'Light Blue' }]]],
  ['Redmi Note 13 128GB', 'mobiles', 'test-s-01', 'Xiaomi', '1609091839311-d5365f9ff1c5', 'Brand new with 33W fast charger in the box. 108MP camera, dual SIM.', [['6GB / 128GB', 2600, 2900, 11, { ram: '6GB', storage: '128GB' }], ['8GB / 256GB', 3100, null, 5, { ram: '8GB', storage: '256GB' }]]],
  ['iPhone XR 64GB (UK used)', 'mobiles', 'test-s-01', 'Apple', '1556656793-08538906a9f8', 'Clean UK-used unit, battery health 84%. Comes with a free case and screen protector.', [['64GB · Black', 2800, 3200, 4, { storage: '64GB', color: 'Black' }], ['64GB · White', 2800, 3200, 2, { storage: '64GB', color: 'White' }]]],
  ['Oraimo FreePods 4 Wireless Earbuds', 'headphones', 'user-seller-1', 'Oraimo', '1590658268037-6bf12165a8df', 'Active noise cancellation and 35 hours of playtime with the case. Great for the library and trotro rides.', [['Black', 420, 499, 25, { color: 'Black' }], ['White', 420, 499, 18, { color: 'White' }]]],
  ['Wired Over-Ear Study Headphones', 'headphones', 'test-s-01', 'Generic', '1583394838336-acd977736f90', 'Comfortable padded headphones with a 1.5m cable and in-line mic. Works with laptops and phones.', [['Black', 180, null, 30, { color: 'Black' }]]],
  ['Bluetooth Earbuds with Charging Case', 'headphones', 'user-seller-2', 'Generic', '1606220588913-b3aacb4d2f46', 'Budget earbuds with touch controls and up to 20 hours with the case.', [['Black', 260, 320, 22, { color: 'Black' }]]],
  ['JBL Flip 5 Portable Speaker', 'electronics', 'user-seller-1', 'JBL', '1608043152269-423dbba4e7e1', 'Waterproof Bluetooth speaker with 12 hours of playtime. Perfect for hall week and room parties.', [['Black', 1150, 1350, 7, { color: 'Black' }], ['Blue', 1150, 1350, 4, { color: 'Blue' }]]],
  ['Logitech G305 Wireless Mouse', 'electronics', 'test-s-01', 'Logitech', '1527814050087-3793815479db', 'Lightweight wireless mouse with one-year battery life on a single AA.', [['White', 390, 450, 16, { color: 'White' }], ['Black', 390, 450, 12, { color: 'Black' }]]],
  ['Wireless Optical Mouse', 'electronics', 'user-seller-2', 'Generic', '1527864550417-7fd91fc51a46', 'Plug-and-play USB receiver, quiet clicks. Good enough for any lab computer.', [['Grey', 85, 110, 40, { color: 'Grey' }]]],
  ['Xbox Wireless Controller', 'electronics', 'test-s-01', 'Microsoft', '1600080972464-8e5f35f63d08', 'Works with Xbox, PC and Android. Batteries included.', [['Robot White', 780, 850, 6, { color: 'White' }]]],
  ['Nikon D5300 DSLR with 18-55mm Lens', 'electronics', 'user-seller-1', 'Nikon', '1564466809058-bf4114d55352', 'Lightly used, shutter count around 9,000. Ideal for photography students and event coverage.', [['Body + 18-55mm', 5400, 6200, 2, { kit: '18-55mm' }]]],
  ['Polaroid OneStep+ Instant Camera', 'electronics', 'test-s-01', 'Polaroid', '1526170375885-4d8ecf77b99f', 'Print photos instantly at hall events and birthdays. Film sold separately.', [['White', 1450, 1600, 3, { color: 'White' }]]],
  ['Apple Watch Series 6 44mm (UK used)', 'electronics', 'test-s-01', 'Apple', '1546868871-7041f2a55e12', 'Battery health 87%, GPS model. Comes with original sport band and charger.', [['44mm · Space Grey', 1900, 2300, 3, { size: '44mm' }]]],
  ['27-inch Gaming Monitor 144Hz', 'electronics', 'user-seller-1', 'Generic', '1625842268584-8f3296236761', 'IPS panel, 1ms response time, HDMI and DisplayPort. Doubles as a second screen for coding.', [['27" · 144Hz', 2900, 3300, 3, { size: '27"' }]]],
  ['Engineering Mathematics, 8th Edition (K.A. Stroud)', 'books', 'user-seller-4', 'Palgrave', '1497633762265-9d179a990aa6', 'The Level 100 and 200 maths staple. Clean copy with no highlighting.', [['Paperback', 320, 380, 12, { format: 'Paperback' }], ['Used · good', 190, null, 6, { format: 'Used' }]]],
  ['Milk and Honey by Rupi Kaur', 'books', 'user-seller-4', 'Andrews McMeel', '1544947950-fa07a98d237f', 'Poetry collection. New paperback.', [['Paperback', 140, 165, 15, { format: 'Paperback' }]]],
  ['How Innovation Works by Matt Ridley', 'books', 'user-seller-4', 'Harper', '1589829085413-56de8ae18c73', 'Popular non-fiction on how ideas become products. New paperback.', [['Paperback', 180, null, 9, { format: 'Paperback' }]]],
  ['Startup and Business Reading Bundle (5 books)', 'books', 'user-seller-4', 'Mixed', '1512820790803-83ca734da794', 'Zero to One, The Lean Startup and three more favourites from the entrepreneurship club. Lightly used.', [['5-book bundle', 520, 700, 4, { format: 'Bundle' }]]],
  ['Level 100 Business Textbook Bundle (used)', 'books', 'user-seller-4', 'Mixed', '1495446815901-a7297e633e8d', 'Principles of Accounting, Micro-economics and Business Maths. Some pencil notes inside.', [['3-book bundle', 380, null, 5, { format: 'Bundle' }]]],
  ['A5 Spiral Lecture Notebooks (Pack of 5)', 'stationery', 'user-seller-2', 'Campus Essentials', '1531346878377-a5be20888e57', '120 ruled pages each, sturdy covers. Enough for a full semester.', [['Pack of 5', 65, 80, 60, { pack: 5 }]]],
  ['Stationery Starter Kit', 'stationery', 'user-seller-2', 'Campus Essentials', '1456735190827-d1262f71b8a3', 'Pens, highlighters, sticky notes, ruler and a pencil case. Everything for the first week of lectures.', [['Standard kit', 95, 120, 35, { kit: 'Standard' }]]],
  ['Nike Air Max 90 (Infrared)', 'men', 'test-s-02', 'Nike', '1600185365926-3a2ce3cdb9eb', 'Original pair, new in box. Cushioned and easy to style for class or church.', [['EU 41', 1250, 1450, 2, { size: '41' }], ['EU 42', 1250, 1450, 3, { size: '42' }], ['EU 43', 1250, 1450, 2, { size: '43' }], ['EU 44', 1250, 1450, 1, { size: '44' }]]],
  ['Nike Air Force 1 Low (Wheat)', 'men', 'test-s-02', 'Nike', '1549298916-b41d501d3772', 'Classic AF1 in wheat suede. New in box.', [['EU 42', 1350, null, 2, { size: '42' }], ['EU 43', 1350, null, 2, { size: '43' }], ['EU 44', 1350, null, 0, { size: '44' }]]],
  ["Nike Air Force 1 '07 Pastel", 'women', 'test-s-02', 'Nike', '1595950653106-6c9ebd614d3a', 'Soft pastel colourway. New in box.', [['EU 37', 1100, 1250, 2, { size: '37' }], ['EU 38', 1100, 1250, 3, { size: '38' }], ['EU 39', 1100, 1250, 1, { size: '39' }]]],
  ['Campus Running Sneakers', 'men', 'test-s-02', 'Generic', '1491553895911-0055eca6402d', 'Light breathable runners for morning jogs around campus.', [['EU 41', 650, 780, 6, { size: '41' }], ['EU 42', 650, 780, 8, { size: '42' }], ['EU 43', 650, 780, 5, { size: '43' }]]],
  ['Classic Wayfarer Sunglasses', 'fashion', 'user-seller-3', 'StyleHub', '1572635196237-14b3f281503f', 'UV400 protection with a sturdy hard case.', [['Black', 150, 190, 24, { color: 'Black' }]]],
  ['Minimalist Analog Watch', 'fashion', 'user-seller-3', 'StyleHub', '1523275335684-37898b6baf30', 'Clean white dial with a silicone strap. Water-resistant for everyday wear.', [['White', 320, 380, 10, { color: 'White' }]]],
  ['Heavyweight Plain T-shirt (White)', 'men', 'user-seller-3', 'StyleHub', '1521572163474-6864f9cf17ab', '220gsm cotton, does not go see-through after washing.', [['S', 95, null, 20, { size: 'S' }], ['M', 95, null, 30, { size: 'M' }], ['L', 95, null, 25, { size: 'L' }], ['XL', 95, null, 12, { size: 'XL' }]]],
  ['"Original" Graphic Tee', 'men', 'user-seller-3', 'StyleHub', '1576566588028-4147f3842f27', 'Soft cotton tee with a bold front print.', [['M', 120, 150, 14, { size: 'M' }], ['L', 120, 150, 10, { size: 'L' }]]],
  ['Black Logo Tee', 'men', 'test-s-02', 'Kumasi Kicks', '1618354691373-d851c5c3a990', 'Everyday black tee with a small chest logo.', [['M', 110, null, 18, { size: 'M' }], ['L', 110, null, 16, { size: 'L' }], ['XL', 110, null, 8, { size: 'XL' }]]],
  ["Women's Graphic Crop Tee", 'women', 'user-seller-3', 'StyleHub', '1503342217505-b0a15ec3261c', 'Relaxed crop fit, pairs well with high-waist jeans.', [['S', 100, 130, 12, { size: 'S' }], ['M', 100, 130, 15, { size: 'M' }]]],
  ['Crochet Knit Poncho Top', 'women', 'user-seller-3', 'StyleHub', '1434389677669-e08b4cac3105', 'Handmade crochet layer for beach trips and evening events.', [['One size', 180, null, 7, { size: 'One size' }]]],
  ['Structured Red Handbag', 'women', 'user-seller-3', 'StyleHub', '1584917865442-de89df76afd3', 'Faux leather top-handle bag with a detachable strap.', [['Red', 380, 450, 5, { color: 'Red' }]]],
  ['Black Laptop Tote Bag', 'women', 'user-seller-3', 'StyleHub', '1614179689702-355944cd0918', 'Fits a 14" laptop, with an inner zip pocket for your phone and keys.', [['Black', 260, 300, 9, { color: 'Black' }]]],
  ['Reusable Kraft Shopping Bag', 'home-living', 'user-seller-2', 'Campus Essentials', '1544816155-12df9643f363', 'Strong reusable bag for market runs.', [['Single', 25, null, 80, {}]]],
  ['Navy Daypack Backpack', 'fashion', 'user-seller-2', 'Campus Essentials', '1553062407-98eeb64c6a62', 'Padded 15.6" laptop sleeve and a bottle pocket. Light enough for daily lectures.', [['Navy', 280, 340, 15, { color: 'Navy' }]]],
  ['Vintage Leather Backpack', 'fashion', 'user-seller-3', 'StyleHub', '1622560480605-d83c853bc5c3', 'Genuine leather in tan brown. Ages beautifully.', [['Brown', 450, 520, 4, { color: 'Brown' }]]],
  ['Hostel Bedding Set (Sheet + 2 Pillowcases)', 'home-living', 'user-seller-5', 'HomeBliss', '1522771739844-6a9f6d5f14af', 'Fits standard hostel 4.5ft beds. Soft brushed cotton.', [['Single · Grey', 350, 420, 12, { size: 'Single' }], ['Double · White', 420, 480, 6, { size: 'Double' }]]],
  ['Mustard Accent Chair', 'home-living', 'user-seller-5', 'HomeBliss', '1586023492125-27b2c045efd7', 'Compact reading chair for off-campus apartments.', [['Mustard', 1400, 1650, 2, { color: 'Mustard' }]]],
  ['Ceramic Mug Set (4 pcs)', 'home-living', 'user-seller-5', 'HomeBliss', '1610701596007-11502861dcfa', 'Stoneware mugs for tea, Milo and late-night coffee.', [['Cream', 140, 170, 18, { color: 'Cream' }]]],
  ['Upholstered Study Chair', 'home-living', 'user-seller-5', 'HomeBliss', '1598300042247-d088f8ab3a91', 'Comfortable padded seat for long study nights.', [['Grey', 520, 600, 5, { color: 'Grey' }]]],
  ['Woven Area Rug 120x170cm', 'home-living', 'user-seller-5', 'HomeBliss', '1600166898405-da9535204843', 'Low-pile rug that makes a hostel room feel like home.', [['Beige', 380, 450, 4, { color: 'Beige' }]]],
  ['Gentle Foaming Facial Cleanser 150ml', 'beauty', 'test-s-03', 'Glow by Adwoa', '1620916566398-39f1143ab7be', 'Soap-free cleanser for oily and combination skin in the heat.', [['150ml', 85, 100, 30, { size: '150ml' }]]],
  ['Hydrating Skincare Duo', 'beauty', 'test-s-03', 'Glow by Adwoa', '1571781926291-c477ebfd024b', 'Moisturiser and serum with hyaluronic acid.', [['Duo', 160, 190, 16, { size: 'Duo' }]]],
  ['Daily Sunscreen SPF 50', 'beauty', 'test-s-03', 'Glow by Adwoa', '1556228578-8c89e6adf883', 'Lightweight, no white cast on dark skin.', [['50ml', 120, null, 22, { size: '50ml' }]]],
  ['Shea Body Lotion Trio', 'beauty', 'test-s-03', 'Glow by Adwoa', '1631729371254-42c2892f0e6e', 'Made with Ghanaian shea butter. Unscented, cocoa and coconut.', [['3 x 250ml', 150, 180, 14, { size: '3 x 250ml' }]]],
  ['Natural Hair and Body Oil', 'beauty', 'test-s-03', 'Glow by Adwoa', '1611930022073-b7a4ba5fcccd', 'Blend of coconut, castor and moringa oils.', [['100ml', 95, null, 20, { size: '100ml' }]]],
  ['Size 5 Training Football', 'sports', 'test-s-04', 'Hall 7 Sports', '1579952363873-27f3bade9f55', 'Durable ball for hall league and inter-hall matches.', [['Size 5', 180, 220, 20, { size: '5' }]]],
  ['Home Workout Exercise Mat 10mm', 'sports', 'test-s-04', 'Hall 7 Sports', '1571019613454-1cb2f99b2d8b', 'Thick cushioned mat with a carry strap.', [['Purple', 160, 190, 15, { color: 'Purple' }], ['Black', 160, 190, 10, { color: 'Black' }]]],
];

// ── Review text by category and mood ───────────────────────────────────────
const REVIEWS = {
  good: [['Exactly as described', 'Item came exactly as shown in the pictures. Delivery to my hall was quick.'], ['Worth every pesewa', 'Good quality for the price. Would buy from this seller again.'], ['Very happy', 'Arrived well packaged and the seller kept me updated on WhatsApp.'], ['Recommended', 'My roommate saw mine and ordered one too.'], ['Great value', 'Cheaper than what I saw at Accra Mall and the quality is the same.'], ['Fast delivery', 'Ordered in the morning and got it before my evening lecture.']],
  ok: [['Okay overall', 'Does the job, but the packaging could be better.'], ['Decent', 'Good item but delivery took longer than expected because of the long weekend.'], ['Fine for the price', 'Not premium, but fine for campus use.']],
  bad: [['Not what I expected', 'The colour was slightly different from the picture. Seller offered an exchange.'], ['Delivery delays', 'Took over a week to arrive. The item itself is fine.'], ['Had issues', 'Stopped working properly after two weeks. Waiting on the seller to replace it.']],
  electronics: [['Battery is solid', 'Battery easily lasts a full day of lectures.'], ['Works perfectly', 'Tested everything the day it arrived and it all works.']],
  books: [['Clean copy', 'No highlighting at all, saved me a lot compared to the bookshop.'], ['Helpful for exams', 'Got me through mid-sems.']],
  fashion: [['True to size', 'Fits perfectly, I ordered my usual size.'], ['Looks great', 'Got compliments at church on Sunday.']],
  beauty: [['Skin feels great', 'Using it for two weeks and my skin is clearer.'], ['Gentle', 'Does not irritate my sensitive skin.']],
  sports: [['Good quality', 'We used it for hall week and it held up well.']],
};
const CATEGORY_GROUP = { laptops: 'electronics', mobiles: 'electronics', headphones: 'electronics', electronics: 'electronics', books: 'books', stationery: 'books', men: 'fashion', women: 'fashion', fashion: 'fashion', beauty: 'beauty', sports: 'sports', 'home-living': 'good' };
const NOTES = ["Please call when you get to the porters' lodge.", 'Deliver after 4pm, I have lectures in the morning.', 'Leave it with the hall secretary if I am not around.', 'Gift for my sister, please wrap it if possible.', 'I am in Room B12, second floor.', 'Kindly confirm the size before sending.'];
const TICKETS = [
  ['Order not delivered yet', 'My order was marked as shipped three days ago but I have not received it. I am in Commonwealth Hall.', 'Sorry about the delay. The courier had a backlog over the weekend; your parcel is out for delivery today.'],
  ['Wrong size received', 'I ordered EU 42 but got EU 41. How do I exchange it?', 'Please keep the original box. We have arranged a pickup and will bring EU 42 when we collect it.'],
  ['MoMo deducted but order pending', 'Money left my MTN MoMo wallet but the order still shows pending payment.', null],
  ['How do I become a seller?', 'I make handmade bead bracelets. Can I sell on UniShop?', 'Yes! Open Account settings and choose Become a seller. Our team reviews applications within two working days.'],
  ['Refund request', 'The earbuds I bought stopped charging after a week. I would like a refund.', 'We have approved your refund. It will reach your MoMo wallet within 3 working days.'],
  ['Change delivery address', 'I moved from Volta Hall to an off-campus hostel. Can I change the address on my order?', null],
  ['Promo code not working', 'NEWTERM says it is invalid at checkout.', 'NEWTERM was valid until the end of the first week of semester. Try STUDY15 instead.'],
  ['Seller not responding', 'I sent the seller two messages about my order and they have not replied.', null],
];
const CONTACTS = [
  ['Mrs. Comfort Asante', 'comfort.asante@unishop.test', 'Hello, my daughter is starting at KNUST this semester. Do you deliver to Kumasi and can I pay on her behalf?', 'RESOLVED'],
  ['Kwesi Arthur', 'kwesi.arthur@unishop.test', 'I run a small printing business near Legon. Do you partner with campus businesses for bulk orders?', 'READ'],
  ['Esi Baidoo', 'esi.baidoo@unishop.test', 'Is there a way to get an invoice with my school name on it for reimbursement?', 'NEW'],
  ['Samuel Nyarko', 'samuel.nyarko@unishop.test', 'Your site is very easy to use. Please add more stationery for engineering students (drawing sets etc.).', 'NEW'],
  ['Felicia Eshun', 'felicia.eshun@unishop.test', 'I was charged twice for one order on MoMo. Order number starts with 5A. Please help.', 'READ'],
  ['Hall JCR, Akuafo Hall', 'jcr.akuafo@unishop.test', 'We would like to discuss sponsorship for our hall week. Who can we talk to?', 'NEW'],
];

async function removeTestData(conn) {
  const like = `%@${TEST_DOMAIN}`;
  const [[{ n: orders }]] = await conn.query("SELECT COUNT(*) n FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)", [like]);
  await conn.query("DELETE FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)", [like]);
  const [p] = await conn.query("DELETE FROM products WHERE id LIKE 'test-p-%'");
  const [u] = await conn.query('DELETE FROM users WHERE email LIKE ?', [like]);
  const [c] = await conn.query('DELETE FROM contact_messages WHERE email LIKE ?', [like]);
  return { orders, products: p.affectedRows, users: u.affectedRows, contactMessages: c.affectedRows };
}

async function insertMany(conn, table, columns, rows) {
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    await conn.query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES ?`, [chunk]);
  }
}

async function seed(conn) {
  const hash = await bcrypt.hash(PASSWORD, 10);
  const [cats] = await conn.query('SELECT id, slug FROM categories');
  const catId = Object.fromEntries(cats.map(c => [c.slug, c.id]));
  const [existing] = await conn.query('SELECT id FROM users WHERE id IN (?)', [EXISTING_SELLERS]);
  const existingSellers = new Set(existing.map(r => r.id));

  // Sellers
  const userRows = SELLERS.map(s => [s.id, s.name, s.email, hash, 'seller', img(s.avatar), phoneFor(s.network), daysAgo(s.created)]);

  // Buyers: students across campuses
  const buyers = [];
  const usedEmails = new Set();
  while (buyers.length < 42) {
    const first = pick(FIRST); const last = pick(LAST);
    const email = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, '') + `@${TEST_DOMAIN}`;
    if (usedEmails.has(email)) continue;
    usedEmails.add(email);
    const campus = pick(CAMPUSES);
    const network = weighted([['MTN', 6], ['Telecel', 2], ['AT', 2]]);
    buyers.push({ id: `test-u-${String(buyers.length + 1).padStart(3, '0')}`, name: `${first} ${last}`, email, campus, network, phone: phoneFor(network), joined: int(20, 200), weight: weighted([[1, 5], [3, 3], [6, 1]]) });
  }
  for (const b of buyers) userRows.push([b.id, b.name, b.email, hash, 'customer', null, b.phone, daysAgo(b.joined)]);
  await insertMany(conn, 'users', ['id', 'name', 'email', 'password_hash', 'role', 'avatar_url', 'phone', 'created_at'], userRows);

  // Addresses: hall room (default) and sometimes a home address
  const addressRows = [];
  for (const b of buyers) {
    const hall = pick(b.campus.halls);
    b.address = { line1: `${hall}, Room ${pick(['A', 'B', 'C', 'D'])}${int(1, 4)}${int(10, 48)}`, line2: b.campus.uni, city: b.campus.city, state: b.campus.region, zip: gps(b.campus.code) };
    addressRows.push([b.id, 'Hall', b.address.line1, b.address.line2, b.address.city, b.address.state, b.address.zip, 'Ghana', 1]);
    if (chance(0.45)) { const [area, region, code] = pick(HOME_AREAS); addressRows.push([b.id, 'Home', `House No. ${int(2, 60)}, ${pick(['Mango', 'Palm', 'Liberation', 'Church', 'Station'])} Street`, null, area, region, gps(code), 'Ghana', 0]); }
  }
  await insertMany(conn, 'addresses', ['user_id', 'label', 'line1', 'line2', 'city', 'state', 'zip', 'country', 'is_default'], addressRows);

  // Products, variants, inventory
  const productRows = []; const variantRows = []; const inventoryRows = []; const variants = [];
  PRODUCTS.forEach(([name, cat, sellerId, brand, photo, description, vars], i) => {
    const id = `test-p-${String(i + 1).padStart(3, '0')}`;
    const seller = sellerId.startsWith('test-') || existingSellers.has(sellerId) ? sellerId : SELLERS[0].id;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + `-${id.slice(-3)}`;
    const created = daysAgo(int(100, 170));
    productRows.push([id, name, slug, description, catId[cat] || null, seller, brand, img(photo), [cat, brand.toLowerCase(), 'campus'].join(','), 1, created]);
    vars.forEach(([vName, price, compare, stock, attrs], j) => {
      const sku = `TST-${String(i + 1).padStart(3, '0')}-${j + 1}`;
      variantRows.push([sku, id, vName, price, compare, null, JSON.stringify(attrs), 1, created]);
      inventoryRows.push([sku, stock, 0]);
      variants.push({ sku, productId: id, productName: name, variantName: vName, price, stock, seller, cat, image: img(photo) });
    });
  });
  await insertMany(conn, 'products', ['id', 'name', 'slug', 'description', 'category_id', 'seller_id', 'brand', 'image_url', 'tags', 'is_active', 'created_at'], productRows);
  await insertMany(conn, 'product_variants', ['sku', 'product_id', 'name', 'price', 'compare_price', 'image_url', 'attributes', 'is_active', 'created_at'], variantRows);
  await insertMany(conn, 'inventory', ['sku', 'stock', 'reserved'], inventoryRows);

  // Orders over the last ~120 days, busiest at the start of semester and in the last two weeks
  const orderRows = []; const itemRows = []; const reserved = {}; const delivered = []; const earnings = {};
  const buyerPool = buyers.flatMap(b => Array(b.weight).fill(b));
  const sellable = variants.filter(v => v.stock > 0);
  for (let n = 0; n < 190; n++) {
    const age = weighted([['recent', 3], ['semester', 3], ['any', 4]]);
    const days = age === 'recent' ? int(0, 14) : age === 'semester' ? int(68, 92) : int(0, 120);
    const created = daysAgo(days);
    const buyer = pick(buyerPool);
    const count = weighted([[1, 6], [2, 3], [3, 1]]);
    const lines = [];
    while (lines.length < count) { const v = pick(sellable); if (!lines.some(l => l.sku === v.sku)) lines.push({ ...v, quantity: v.price < 150 && chance(0.35) ? 2 : 1 }); }
    const subtotal = money(lines.reduce((s, l) => s + l.price * l.quantity, 0));
    const promo = chance(0.12) ? (days >= 68 && days <= 92 ? ['NEWTERM', 25] : pick([['WELCOME10', 10], ['STUDY15', 15], ['CAMPUS20', 20]])) : null;
    const discount = promo ? money(subtotal * promo[1] / 100) : 0;
    const shipping = subtotal >= 500 ? 0 : 15;
    const total = money(subtotal - discount + shipping);

    let status;
    if (days < 2) status = weighted([['PENDING', 4], ['CONFIRMED', 6]]);
    else if (days < 5) status = weighted([['CONFIRMED', 2], ['PROCESSING', 4], ['SHIPPED', 4]]);
    else if (days < 10) status = weighted([['SHIPPED', 4], ['DELIVERED', 6]]);
    else status = weighted([['DELIVERED', 85], ['CANCELLED', 9], ['REFUNDED', 6]]);
    const payment = status === 'PENDING' ? weighted([['PENDING', 1], ['PAID', 1]]) : status === 'CANCELLED' ? weighted([['FAILED', 3], ['REFUNDED', 2]]) : status === 'REFUNDED' ? 'REFUNDED' : 'PAID';
    const method = weighted([['momo_mtn', 55], ['momo_voda', 14], ['momo_at', 9], ['card', 22]]);
    const id = uuid();
    const updated = addHours(created, status === 'DELIVERED' ? int(30, 120) : status === 'PENDING' ? 0 : int(2, 48));
    const notes = [promo && `Promo ${promo[0]} applied.`, chance(0.25) && pick(NOTES)].filter(Boolean).join(' ') || null;
    orderRows.push([id, buyer.id, status, buyer.address.line1, buyer.address.line2, buyer.address.city, buyer.address.state, buyer.address.zip, 'Ghana', subtotal, shipping, discount, total, method, payment, notes, created, updated]);

    const fulfil = { PENDING: 'PENDING', CONFIRMED: 'PENDING', PROCESSING: 'PROCESSING', SHIPPED: 'SHIPPED', DELIVERED: 'DELIVERED', CANCELLED: 'CANCELLED', REFUNDED: 'CANCELLED' }[status];
    for (const l of lines) {
      const shipped = fulfil === 'SHIPPED' || fulfil === 'DELIVERED';
      const carrier = shipped ? pick(['UniShop Campus Courier', 'Ghana Post EMS', 'Yango Delivery']) : null;
      const tracking = shipped ? (carrier === 'Ghana Post EMS' ? `EE${int(100000000, 999999999)}GH` : `US${int(10000000, 99999999)}`) : null;
      itemRows.push([id, l.sku, l.productName, l.variantName, l.quantity, l.price, l.image, l.seller, fulfil, tracking, carrier]);
      if (status === 'PENDING' && payment === 'PENDING') reserved[l.sku] = (reserved[l.sku] || 0) + l.quantity;
      if (fulfil === 'DELIVERED' && payment === 'PAID') {
        delivered.push({ buyer, line: l, date: updated });
        earnings[l.seller] = (earnings[l.seller] || 0) + l.price * l.quantity;
      }
    }
  }
  await insertMany(conn, 'orders', ['id', 'user_id', 'status', 'shipping_line1', 'shipping_line2', 'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'subtotal', 'shipping_fee', 'discount', 'total', 'payment_method', 'payment_status', 'notes', 'created_at', 'updated_at'], orderRows);
  await insertMany(conn, 'order_items', ['order_id', 'sku', 'product_name', 'variant_name', 'quantity', 'price_at_purchase', 'image_url', 'seller_id', 'fulfillment_status', 'tracking_number', 'carrier'], itemRows);
  for (const [sku, qty] of Object.entries(reserved)) await conn.query('UPDATE inventory SET reserved = LEAST(stock, ?) WHERE sku = ?', [qty, sku]);

  // Verified reviews from buyers who received the item
  const reviewRows = []; const reviewed = new Set();
  for (const { buyer, line, date } of delivered) {
    const key = `${line.productId}|${buyer.id}`;
    if (reviewed.has(key) || !chance(0.6)) continue;
    reviewed.add(key);
    const rating = weighted([[5, 50], [4, 30], [3, 11], [2, 6], [1, 3]]);
    const pool = rating >= 4 ? [...REVIEWS.good, ...(REVIEWS[CATEGORY_GROUP[line.cat]] || [])] : rating === 3 ? REVIEWS.ok : REVIEWS.bad;
    const [title, body] = pick(pool);
    reviewRows.push([line.productId, buyer.id, rating, title, body, 1, addHours(date, int(24, 24 * 12))]);
  }
  await insertMany(conn, 'reviews', ['product_id', 'user_id', 'rating', 'title', 'body', 'is_verified', 'created_at'], reviewRows);
  await conn.query(`UPDATE products p SET
      review_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id),
      avg_rating = COALESCE((SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.product_id = p.id), 0)
    WHERE p.id LIKE 'test-p-%'`);

  // Wishlists
  const wishRows = []; const wished = new Set();
  for (const b of buyers) {
    for (let k = int(0, 5); k > 0; k--) {
      const p = pick(productRows)[0]; const key = `${b.id}|${p}`;
      if (!wished.has(key)) { wished.add(key); wishRows.push([b.id, p, daysAgo(int(0, 60))]); }
    }
  }
  await insertMany(conn, 'wishlist', ['user_id', 'product_id', 'added_at'], wishRows);

  // Payouts for the test sellers (withdrawals never exceed what they earned)
  const payoutRows = [];
  SELLERS.forEach((s, i) => {
    const earned = earnings[s.id] || 0;
    const details = `${s.network === 'MTN' ? 'MTN MoMo' : s.network === 'Telecel' ? 'Telecel Cash' : 'AT Money'}\nAccount name: ${s.name}\nNumber: ${phoneFor(s.network)}`;
    let left = earned * 0.85;
    for (const d of [75, 45, 20]) {
      const amount = money(Math.min(left, earned * pick([0.2, 0.25, 0.3])));
      if (amount < 50) break;
      left -= amount;
      payoutRows.push([s.id, amount, 'PROCESSED', details, daysAgo(d - 2), daysAgo(d)]);
    }
    if (i === 0 && left > 100) payoutRows.push([s.id, money(Math.min(left, 900)), 'PENDING', details, null, daysAgo(1)]);
    if (i === 2) payoutRows.push([s.id, 150, 'REJECTED', `${details}\n(Account name did not match the registered MoMo name.)`, daysAgo(30), daysAgo(32)]);
  });
  if (payoutRows.length) await insertMany(conn, 'payouts', ['seller_id', 'amount', 'status', 'bank_details', 'processed_at', 'created_at'], payoutRows);

  // Seller applications from students: approved, rejected and waiting
  const applicants = buyers.slice(0, 5);
  const appRows = [
    [applicants[0].id, 'Beads by Nana', 'Handmade waist beads and bracelets made in my hall room.', 'Fashion', applicants[0].phone, 'PENDING', null, daysAgo(2)],
    [applicants[1].id, 'Legon Print Hub', 'Printing, binding and lamination for assignments and project work.', 'Stationery', applicants[1].phone, 'PENDING', null, daysAgo(4)],
    [applicants[2].id, 'Sweet Bites by Esi', 'Homemade chin-chin, meat pies and cakes.', 'Home & Living', applicants[2].phone, 'REJECTED', 'Food items need an FDA certificate before we can list them. Please reapply with the certificate.', daysAgo(20)],
    [applicants[3].id, 'Thrift Corner GH', 'Quality second-hand clothes and sneakers from Kantamanto.', 'Fashion', applicants[3].phone, 'PENDING', null, daysAgo(1)],
  ];
  await insertMany(conn, 'seller_applications', ['user_id', 'store_name', 'description', 'category', 'phone', 'status', 'admin_note', 'created_at'], appRows);

  // Support tickets, contact messages and a couple of live chats
  const ticketRows = TICKETS.map(([subject, message, reply], i) => {
    const b = buyers[(i * 5 + 3) % buyers.length];
    const status = reply ? pick(['RESOLVED', 'CLOSED', 'IN_PROGRESS']) : 'OPEN';
    const created = daysAgo(int(0, 40));
    return [b.id, subject, message, status, reply, created, addHours(created, reply ? int(2, 30) : 0)];
  });
  await insertMany(conn, 'support_tickets', ['user_id', 'subject', 'message', 'status', 'admin_reply', 'created_at', 'updated_at'], ticketRows);
  await insertMany(conn, 'contact_messages', ['name', 'email', 'message', 'status', 'created_at'], CONTACTS.map(([name, email, message, status]) => [name, email, message, status, daysAgo(int(0, 25))]));
  const chatter = buyers[7]; const t0 = daysAgo(0, 10);
  await insertMany(conn, 'chat_messages', ['user_id', 'sender_type', 'message', 'created_at'], [
    [chatter.id, 'user', 'Hi, do you deliver to Akuafo Hall on weekends?', t0],
    [chatter.id, 'admin', 'Hello! Yes, campus deliveries run on Saturdays from 9am to 3pm.', addHours(t0, 0.1)],
    [chatter.id, 'user', 'Great, thank you!', addHours(t0, 0.15)],
  ]);

  return { sellers: SELLERS.length, buyers: buyers.length, addresses: addressRows.length, products: productRows.length, variants: variantRows.length, orders: orderRows.length, orderItems: itemRows.length, reviews: reviewRows.length, wishlist: wishRows.length, payouts: payoutRows.length, sellerApplications: appRows.length, supportTickets: ticketRows.length, contactMessages: CONTACTS.length };
}

(async () => {
  if (process.env.NODE_ENV === 'production') { console.error('Refusing to seed test data with NODE_ENV=production.'); process.exit(1); }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const removed = await removeTestData(conn);
    console.log('Removed previous test data:', removed);
    if (!REMOVE_ONLY) {
      const created = await seed(conn);
      console.log('Created test data:', created);
      console.log(`Test accounts use the password ${PASSWORD} (emails end with @${TEST_DOMAIN}).`);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error('Seeding failed, nothing was changed:', err.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await db.end();
  }
})();
