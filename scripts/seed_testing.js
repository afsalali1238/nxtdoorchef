const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting extended testing seed...");

  // Sync constants.ts changes to DB
  await supabase.from('cuisine_types').upsert(
    { name: 'Ugandan', emoji: '🇺🇬', slug: 'ugandan' },
    { onConflict: 'slug' }
  );

  await supabase.from('dubai_areas').upsert(
    { name: 'Al Rigga', lat: 25.2666, lng: 55.3166 },
    { onConflict: 'name' }
  );

  console.log("Inserting 8 new chefs...");
  
  const chefs = [
    {
      name: 'Ahmad',
      bio: 'Sharing authentic Emirati hospitality and recipes passed down through generations. My kitchen is your home.',
      whatsapp: '971562351238', // USER'S REAL WHATSAPP FOR TESTING
      cuisine_type: 'Emirati',
      specialty: 'Traditional Machboos and slow-cooked Harees',
      area: 'Jumeirah',
      lat: 25.2048,
      lng: 55.2321,
      is_approved: true,
      has_permit: true,
    },
    {
      name: 'Fatima',
      bio: 'Bringing the rich, spiced flavors of Lahore to Dubai. Every dish is made fresh daily with hand-ground spices.',
      whatsapp: '971500000101',
      cuisine_type: 'Pakistani',
      specialty: 'Authentic Lahori Karahi and weekend Halwa Puri',
      area: 'Al Nahda',
      lat: 25.2905,
      lng: 55.3614,
      is_approved: true,
      has_permit: true,
    },
    {
      name: 'Nour',
      bio: 'Authentic Lebanese mezze and grills, just like you would find in the mountains of Lebanon.',
      whatsapp: '971500000102',
      cuisine_type: 'Lebanese',
      specialty: 'Fresh Mezze, Tabbouleh, and Shish Taouk',
      area: 'Dubai Marina',
      lat: 25.0805,
      lng: 55.1403,
      is_approved: true,
      has_permit: false,
    },
    {
      name: 'Mahmoud',
      bio: 'Egyptian street food and hearty home meals. Koshary is my passion.',
      whatsapp: '971500000103',
      cuisine_type: 'Egyptian',
      specialty: 'Classic Koshary and Hawawshi',
      area: 'Business Bay',
      lat: 25.1884,
      lng: 55.2615,
      is_approved: true,
      has_permit: true,
    },
    {
      name: 'Dewi',
      bio: 'Experience the true taste of Indonesia. Spicy, sweet, and perfectly balanced homemade meals.',
      whatsapp: '971500000104',
      cuisine_type: 'Indonesian',
      specialty: 'Nasi Goreng, Satay, and Beef Rendang',
      area: 'JVC',
      lat: 25.0593,
      lng: 55.2106,
      is_approved: true,
      has_permit: true,
    },
    {
      name: 'Tariq',
      bio: 'Syrian home cooking that brings back memories of Damascus. Generous portions and made with love.',
      whatsapp: '971500000105',
      cuisine_type: 'Syrian',
      specialty: 'Fatteh, Kibbeh, and Syrian Shawarma plates',
      area: 'Mirdif',
      lat: 25.2249,
      lng: 55.4169,
      is_approved: true,
      has_permit: false,
    },
    {
      name: 'Amaka',
      bio: 'The vibrant and bold flavors of West Africa. Best Jollof in Dubai, guaranteed!',
      whatsapp: '971500000106',
      cuisine_type: 'West African',
      specialty: 'Spicy Jollof Rice and Egusi Soup',
      area: 'Discovery Gardens',
      lat: 25.0375,
      lng: 55.1565,
      is_approved: true,
      has_permit: true,
    },
    {
      name: 'Sanjeev',
      bio: 'North Indian comfort food. Rich curries, fresh rotis, and the perfect cup of chai.',
      whatsapp: '971500000107',
      cuisine_type: 'North Indian',
      specialty: 'Butter Chicken, Dal Makhani, and stuffed Parathas',
      area: 'Karama',
      lat: 25.2409,
      lng: 55.3059,
      is_approved: true,
      has_permit: true,
    }
  ];

  const chefIds = {};
  for (const c of chefs) {
    const { data, error } = await supabase.from('chefs').insert(c).select('id').single();
    if (error) {
      console.error("Error inserting chef", c.name, error);
    } else {
      chefIds[c.name] = data.id;
      console.log(`Inserted Chef ${c.name}`);
    }
  }

  console.log("Inserting Dishes...");
  const dishes = [
    // Ahmad (Emirati) - user test account
    { chef_id: chefIds['Ahmad'], name: 'Chicken Machboos', description: 'Traditional spiced rice with tender slow-cooked chicken, flavored with dried lime and saffron.', price_aed: 45, dietary_tags: ['halal', 'dairy-free'], cuisine_type: 'Emirati', available_today: true },
    { chef_id: chefIds['Ahmad'], name: 'Lamb Harees', description: 'Slow-cooked wheat and lamb porridge, beaten to a smooth consistency and topped with local ghee.', price_aed: 55, dietary_tags: ['halal'], cuisine_type: 'Emirati', available_today: true },
    { chef_id: chefIds['Ahmad'], name: 'Luqaimat', description: 'Sweet, crispy fried dumplings drizzled with date syrup and sesame seeds.', price_aed: 25, dietary_tags: ['vegetarian'], cuisine_type: 'Emirati', available_today: false },
    { chef_id: chefIds['Ahmad'], name: 'Saloona', description: 'Hearty Emirati vegetable and meat stew served with white rice.', price_aed: 40, dietary_tags: ['halal', 'dairy-free'], cuisine_type: 'Emirati', available_today: true },

    // Fatima (Pakistani)
    { chef_id: chefIds['Fatima'], name: 'Lahori Chicken Karahi', description: 'Spicy chicken cooked in a wok with tomatoes, green chilies, and ginger.', price_aed: 35, dietary_tags: ['halal'], cuisine_type: 'Pakistani', available_today: true },
    { chef_id: chefIds['Fatima'], name: 'Halwa Puri (Weekend Special)', description: 'Traditional Sunday breakfast: 3 fluffy puris, sweet halwa, and spicy chana masala.', price_aed: 20, dietary_tags: ['vegetarian'], cuisine_type: 'Pakistani', available_today: false },
    { chef_id: chefIds['Fatima'], name: 'Beef Nihari', description: 'Slow-cooked beef shank stew, deeply spiced and served with naan.', price_aed: 45, dietary_tags: ['halal'], cuisine_type: 'Pakistani', available_today: true },

    // Nour (Lebanese)
    { chef_id: chefIds['Nour'], name: 'Mixed Mezze Platter', description: 'Hummus, moutabal, tabbouleh, and fresh pita bread.', price_aed: 40, dietary_tags: ['vegetarian', 'vegan'], cuisine_type: 'Lebanese', available_today: true },
    { chef_id: chefIds['Nour'], name: 'Shish Taouk Plate', description: 'Marinated chicken skewers grilled to perfection, served with garlic paste and fries.', price_aed: 45, dietary_tags: ['halal'], cuisine_type: 'Lebanese', available_today: true },
    { chef_id: chefIds['Nour'], name: 'Kibbeh Nayyeh', description: 'Traditional raw meat dish, strictly for pre-order only.', price_aed: 60, dietary_tags: ['halal'], cuisine_type: 'Lebanese', available_today: false },

    // Mahmoud (Egyptian)
    { chef_id: chefIds['Mahmoud'], name: 'Classic Koshary', description: 'Egypt\'s national dish. Mix of rice, macaroni, and lentils topped with a spiced tomato sauce and crispy onions.', price_aed: 25, dietary_tags: ['vegetarian', 'vegan'], cuisine_type: 'Egyptian', available_today: true },
    { chef_id: chefIds['Mahmoud'], name: 'Alexandrian Hawawshi', description: 'Spiced minced meat stuffed in crispy baladi bread.', price_aed: 30, dietary_tags: ['halal'], cuisine_type: 'Egyptian', available_today: true },
    { chef_id: chefIds['Mahmoud'], name: 'Fiteer Meshaltet', description: 'Egyptian layered pastry, served with honey and old cheese.', price_aed: 35, dietary_tags: ['vegetarian'], cuisine_type: 'Egyptian', available_today: false },

    // Dewi (Indonesian)
    { chef_id: chefIds['Dewi'], name: 'Beef Rendang', description: 'Tender beef slow-cooked in coconut milk and rich spices until caramelized.', price_aed: 50, dietary_tags: ['halal', 'dairy-free'], cuisine_type: 'Indonesian', available_today: true },
    { chef_id: chefIds['Dewi'], name: 'Nasi Goreng Special', description: 'Indonesian fried rice topped with a fried egg, served with chicken satay and prawn crackers.', price_aed: 35, dietary_tags: ['halal'], cuisine_type: 'Indonesian', available_today: true },
    { chef_id: chefIds['Dewi'], name: 'Gado Gado', description: 'Traditional salad of slightly boiled vegetables, hard-boiled eggs, and tofu, served with a peanut sauce dressing.', price_aed: 28, dietary_tags: ['vegetarian'], cuisine_type: 'Indonesian', available_today: true },

    // Tariq (Syrian)
    { chef_id: chefIds['Tariq'], name: 'Chicken Fatteh', description: 'Layered dish of crispy pita, rice, shredded chicken, and warm garlic yogurt topped with toasted nuts.', price_aed: 40, dietary_tags: ['halal'], cuisine_type: 'Syrian', available_today: true },
    { chef_id: chefIds['Tariq'], name: 'Fried Kibbeh', description: 'Crispy bulgur shells stuffed with spiced minced meat and pine nuts. (6 pieces)', price_aed: 30, dietary_tags: ['halal'], cuisine_type: 'Syrian', available_today: true },
    { chef_id: chefIds['Tariq'], name: 'Yalangi', description: 'Vegetarian vine leaves stuffed with rice, tomatoes, and parsley, cooked in olive oil and lemon.', price_aed: 35, dietary_tags: ['vegetarian', 'vegan'], cuisine_type: 'Syrian', available_today: false },

    // Amaka (West African)
    { chef_id: chefIds['Amaka'], name: 'Party Jollof Rice with Chicken', description: 'Smoky, spicy tomato rice served with fried plantains and seasoned grilled chicken.', price_aed: 45, dietary_tags: ['halal', 'dairy-free'], cuisine_type: 'West African', available_today: true },
    { chef_id: chefIds['Amaka'], name: 'Egusi Soup & Pounded Yam', description: 'Rich melon seed soup cooked with spinach and assorted meats, served with smooth pounded yam.', price_aed: 55, dietary_tags: ['halal'], cuisine_type: 'West African', available_today: true },
    { chef_id: chefIds['Amaka'], name: 'Suya Skewers', description: 'Spicy peanut-rubbed grilled beef skewers. Contains nuts.', price_aed: 30, dietary_tags: ['halal', 'dairy-free'], cuisine_type: 'West African', available_today: false },

    // Sanjeev (North Indian)
    { chef_id: chefIds['Sanjeev'], name: 'Delhi Butter Chicken', description: 'Tender tandoori chicken simmered in a rich, creamy tomato gravy.', price_aed: 40, dietary_tags: ['halal'], cuisine_type: 'North Indian', available_today: true },
    { chef_id: chefIds['Sanjeev'], name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter and cream. Served with 2 rotis.', price_aed: 30, dietary_tags: ['vegetarian'], cuisine_type: 'North Indian', available_today: true },
    { chef_id: chefIds['Sanjeev'], name: 'Aloo Paratha', description: 'Whole wheat flatbread stuffed with spiced potatoes. Served with fresh curd and pickle.', price_aed: 15, dietary_tags: ['vegetarian'], cuisine_type: 'North Indian', available_today: false },
    { chef_id: chefIds['Sanjeev'], name: 'Paneer Tikka Masala', description: 'Marinated cottage cheese cubes grilled and served in a spiced onion-tomato gravy.', price_aed: 38, dietary_tags: ['vegetarian'], cuisine_type: 'North Indian', available_today: true },
  ];

  for (const d of dishes) {
    if (!d.chef_id) continue;
    const { error } = await supabase.from('dishes').insert(d);
    if (error) {
      console.error("Error inserting dish", d.name, error);
    } else {
      console.log(`Inserted Dish ${d.name} (${d.available_today ? 'Available' : 'Unavailable'})`);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
