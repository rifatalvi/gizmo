/**
 * Seed script — populates the "products" collection in MongoDB with sample data.
 *
 * Usage:
 *   node scripts/seed-products.js
 *
 * Requires MONGODB_URL to be available as an environment variable,
 * or edit the MONGODB_URL const below directly.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient } = require("mongodb");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

// Load .env manually since this is a plain Node script
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    const envPath = path.join(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
        fs.readFileSync(envPath, "utf-8")
            .split("\n")
            .forEach((line) => {
                const [key, ...vals] = line.split("=");
                if (key && vals.length) process.env[key.trim()] = vals.join("=").trim();
            });
    }
} catch { /* ignore */ }

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";

const PRODUCTS = [
    {
        name: "MacBook Pro 14\" M3 Pro",
        slug: "macbook-pro-14-m3-pro",
        description: "The ultimate professional laptop with Apple M3 Pro chip, Liquid Retina XDR display, and up to 22 hours battery life.",
        price: 1999,
        originalPrice: 2199,
        category: "laptops",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
        rating: 4.9,
        reviewCount: 1243,
        stock: 45,
        tags: ["apple", "macbook", "laptop", "m3", "pro"],
        featured: true,
        deal: true,
        discountPercent: 9,
        specs: { Chip: "Apple M3 Pro", RAM: "18GB", Storage: "512GB SSD", Display: "14.2\" Retina XDR", Battery: "Up to 22hrs" },
        createdAt: new Date("2024-11-01"),
    },
    {
        name: "Dell XPS 15 OLED",
        slug: "dell-xps-15-oled",
        description: "Stunning 3.5K OLED touchscreen, Intel Core i9, RTX 4070, and sleek CNC aluminum design.",
        price: 2299,
        originalPrice: 2499,
        category: "laptops",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 876,
        stock: 28,
        tags: ["dell", "xps", "oled", "laptop"],
        featured: true,
        deal: true,
        discountPercent: 8,
        specs: { CPU: "Intel Core i9-13900H", RAM: "32GB DDR5", Storage: "1TB NVMe SSD", GPU: "NVIDIA RTX 4070", Display: "15.6\" 3.5K OLED" },
        createdAt: new Date("2024-10-15"),
    },
    {
        name: "ASUS ROG Zephyrus G14",
        slug: "asus-rog-zephyrus-g14",
        description: "Compact gaming powerhouse with AMD Ryzen 9, RTX 4060, AniMe Matrix LED lid, and 120Hz display.",
        price: 1499,
        originalPrice: 1699,
        category: "laptops",
        brand: "ASUS",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 654,
        stock: 19,
        tags: ["asus", "rog", "gaming", "laptop"],
        featured: false,
        deal: true,
        discountPercent: 12,
        specs: { CPU: "AMD Ryzen 9 7940HS", RAM: "16GB DDR5", Storage: "1TB NVMe", GPU: "NVIDIA RTX 4060", Display: "14\" 2560x1600 120Hz" },
        createdAt: new Date("2024-09-20"),
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "The pinnacle of Android smartphones with Snapdragon 8 Gen 3, 200MP camera, S Pen, and 6.8\" Dynamic AMOLED.",
        price: 1199,
        originalPrice: 1299,
        category: "phones",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 2345,
        stock: 72,
        tags: ["samsung", "galaxy", "android", "smartphone"],
        featured: true,
        deal: false,
        specs: { CPU: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Camera: "200MP + 12MP + 10MP + 50MP", Battery: "5000mAh" },
        createdAt: new Date("2024-11-10"),
    },
    {
        name: "iPhone 16 Pro Max",
        slug: "iphone-16-pro-max",
        description: "Apple's most advanced iPhone with A18 Pro chip, 5x optical zoom, titanium design, and 4K 120fps video.",
        price: 1099,
        originalPrice: 1199,
        category: "phones",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?w=800&auto=format&fit=crop",
        rating: 4.9,
        reviewCount: 3120,
        stock: 89,
        tags: ["apple", "iphone", "ios", "smartphone"],
        featured: true,
        deal: true,
        discountPercent: 8,
        specs: { Chip: "Apple A18 Pro", RAM: "8GB", Storage: "256GB", Camera: "48MP ProRAW + 12MP + 48MP", Battery: "4422mAh" },
        createdAt: new Date("2024-09-15"),
    },
    {
        name: "Google Pixel 9 Pro",
        slug: "google-pixel-9-pro",
        description: "Google's flagship with Tensor G4 chip, 50MP triple camera, 7 years of OS updates, and premium matte finish.",
        price: 999,
        originalPrice: 1099,
        category: "phones",
        brand: "Google",
        image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 987,
        stock: 34,
        tags: ["google", "pixel", "android", "smartphone"],
        featured: false,
        deal: true,
        discountPercent: 9,
        specs: { Chip: "Google Tensor G4", RAM: "16GB", Storage: "128GB", Camera: "50MP + 48MP + 48MP", Battery: "4700mAh" },
        createdAt: new Date("2024-08-15"),
    },
    {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        description: "Industry-leading noise cancellation, 30-hour battery, and exceptional sound quality with LDAC support.",
        price: 349,
        originalPrice: 399,
        category: "audio",
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 4567,
        stock: 120,
        tags: ["sony", "headphones", "anc", "wireless"],
        featured: true,
        deal: true,
        discountPercent: 13,
        specs: { "Driver Size": "30mm", "Frequency": "4Hz–40kHz", "Battery": "30 hours ANC on", "Weight": "250g", "Connectivity": "Bluetooth 5.2, 3.5mm" },
        createdAt: new Date("2024-07-01"),
    },
    {
        name: "AirPods Pro 2nd Gen",
        slug: "airpods-pro-2nd-gen",
        description: "H2 chip, Adaptive Transparency, Personalized Spatial Audio, and 6 hours ANC listening time.",
        price: 249,
        originalPrice: 279,
        category: "audio",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 6789,
        stock: 200,
        tags: ["apple", "airpods", "earbuds", "anc", "wireless"],
        featured: true,
        deal: false,
        specs: { Chip: "Apple H2", "ANC Battery": "6hrs", "Case Battery": "30hrs total", Charging: "MagSafe / USB-C / Qi", Water: "IPX4" },
        createdAt: new Date("2024-06-01"),
    },
    {
        name: "Bose QuietComfort 45",
        slug: "bose-quietcomfort-45",
        description: "Legendary Bose noise cancellation with a comfortable design and 24-hour battery life.",
        price: 279,
        originalPrice: 329,
        category: "audio",
        brand: "Bose",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 3210,
        stock: 67,
        tags: ["bose", "headphones", "anc", "wireless"],
        featured: false,
        deal: true,
        discountPercent: 15,
        specs: { "Driver Size": "40mm", "Battery": "24hrs ANC", "Modes": "Quiet, Aware, Off", Weight: "238g", Connectivity: "Bluetooth 5.1, 2.5mm" },
        createdAt: new Date("2024-05-01"),
    },
    {
        name: "PlayStation 5 Slim",
        slug: "playstation-5-slim",
        description: "The next generation of gaming — ultra-high-speed SSD, 4K 120fps, ray tracing, and DualSense controller.",
        price: 449,
        originalPrice: 499,
        category: "gaming",
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop",
        rating: 4.9,
        reviewCount: 8912,
        stock: 55,
        tags: ["sony", "playstation", "ps5", "console", "gaming"],
        featured: true,
        deal: true,
        discountPercent: 10,
        specs: { CPU: "AMD Zen 2 8-core 3.5GHz", GPU: "AMD RDNA 2 10.28 TFLOPs", RAM: "16GB GDDR6", Storage: "1TB Custom NVMe SSD", "Max Resolution": "8K / 4K@120fps" },
        createdAt: new Date("2024-10-01"),
    },
    {
        name: "Xbox Series X",
        slug: "xbox-series-x",
        description: "The most powerful Xbox ever — 12 teraflops, 4K gaming at 60fps up to 120fps, and 1TB NVMe SSD.",
        price: 499,
        category: "gaming",
        brand: "Microsoft",
        image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 6234,
        stock: 43,
        tags: ["xbox", "microsoft", "console", "gaming"],
        featured: true,
        deal: false,
        specs: { CPU: "AMD Zen 2 8-core 3.8GHz", GPU: "AMD RDNA 2 12 TFLOPs", RAM: "16GB GDDR6", Storage: "1TB NVMe SSD", "Max Resolution": "4K@120fps" },
        createdAt: new Date("2024-03-01"),
    },
    {
        name: "Nintendo Switch OLED",
        slug: "nintendo-switch-oled",
        description: "Play anywhere with a vivid 7\" OLED screen, enhanced audio, and a wide adjustable stand.",
        price: 349,
        category: "gaming",
        brand: "Nintendo",
        image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 11234,
        stock: 98,
        tags: ["nintendo", "switch", "oled", "handheld", "gaming"],
        featured: false,
        deal: false,
        specs: { Display: "7\" OLED 1280x720", Storage: "64GB", Battery: "4.5–9 hours", Ports: "USB-C, 3.5mm", "Dock": "Wired LAN port" },
        createdAt: new Date("2024-02-01"),
    },
    {
        name: "LG UltraGear 27\" 4K 144Hz",
        slug: "lg-ultragear-27-4k-144hz",
        description: "Nano IPS 4K 144Hz gaming monitor with 1ms GTG response time, G-Sync Compatible, and HDR600.",
        price: 699,
        originalPrice: 849,
        category: "monitors",
        brand: "LG",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 1876,
        stock: 31,
        tags: ["lg", "monitor", "gaming", "4k", "144hz"],
        featured: true,
        deal: true,
        discountPercent: 18,
        specs: { Panel: "Nano IPS", Resolution: "3840x2160 (4K)", "Refresh Rate": "144Hz", "Response Time": "1ms GTG", HDR: "VESA DisplayHDR 600" },
        createdAt: new Date("2024-08-01"),
    },
    {
        name: "Samsung 32\" Odyssey Neo G8",
        slug: "samsung-odyssey-neo-g8",
        description: "Curved 4K 240Hz Mini LED gaming monitor with Quantum HDR 2000 and ultra-thin bezels.",
        price: 849,
        originalPrice: 999,
        category: "monitors",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 987,
        stock: 22,
        tags: ["samsung", "monitor", "gaming", "neo", "mini-led"],
        featured: false,
        deal: true,
        discountPercent: 15,
        specs: { Panel: "VA Mini LED", Resolution: "3840x2160", "Refresh Rate": "240Hz", HDR: "Quantum HDR 2000", Curve: "1000R" },
        createdAt: new Date("2024-07-15"),
    },
    {
        name: "Logitech MX Master 3S",
        slug: "logitech-mx-master-3s",
        description: "Advanced wireless mouse with MagSpeed scroll, 8K DPI sensor, and customizable buttons for productivity.",
        price: 99,
        originalPrice: 119,
        category: "accessories",
        brand: "Logitech",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 5432,
        stock: 145,
        tags: ["logitech", "mouse", "wireless", "mx", "accessories"],
        featured: true,
        deal: true,
        discountPercent: 17,
        specs: { Sensor: "8000 DPI Darkfield", Battery: "70 days", Connectivity: "Bluetooth / Logi Bolt USB", Buttons: "7 programmable", Weight: "141g" },
        createdAt: new Date("2024-04-01"),
    },
    {
        name: "Keychron K2 Pro Mechanical Keyboard",
        slug: "keychron-k2-pro",
        description: "75% layout wireless mechanical keyboard with hot-swappable switches, RGB backlight, and Mac/Windows support.",
        price: 99,
        originalPrice: 119,
        category: "accessories",
        brand: "Keychron",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 3241,
        stock: 78,
        tags: ["keyboard", "mechanical", "wireless", "keychron", "accessories"],
        featured: false,
        deal: true,
        discountPercent: 17,
        specs: { Layout: "75% (84 keys)", Switches: "Hot-swappable", Connectivity: "Bluetooth 5.1 / USB-C", Battery: "4000mAh", Backlight: "RGB South-facing" },
        createdAt: new Date("2024-01-01"),
    },
];

async function seed() {
    const client = new MongoClient(MONGODB_URL);
    try {
        await client.connect();
        console.log("✅  Connected to MongoDB");

        const db = client.db("gizmo");
        const col = db.collection("products");

        // Drop old products and re-insert (idempotent)
        const existing = await col.countDocuments();
        if (existing > 0) {
            console.log(`⚠️  Found ${existing} existing products. Dropping and re-seeding…`);
            await col.deleteMany({});
        }

        const result = await col.insertMany(PRODUCTS);
        console.log(`🎉  Inserted ${result.insertedCount} products into the "products" collection.`);

        // Drop any existing text index before creating new one
        try { await col.dropIndex("name_text_brand_text_tags_text"); } catch { /* ignore */ }
        try { await col.dropIndex("name_text_description_text_brand_text_tags_text"); } catch { /* ignore */ }

        // Create indexes for fast search & filtering
        await col.createIndex({ name: "text", description: "text", brand: "text", tags: "text" });
        await col.createIndex({ category: 1 });
        await col.createIndex({ price: 1 });
        await col.createIndex({ rating: -1 });
        await col.createIndex({ createdAt: -1 });
        await col.createIndex({ featured: 1 });
        await col.createIndex({ deal: 1 });
        console.log("📁  Indexes created.");
    } finally {
        await client.close();
        console.log("🔌  Disconnected.");
    }
}

seed().catch(console.error);
