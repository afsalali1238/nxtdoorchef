const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting seeding process...");

  // 1. Insert Ugandan cuisine if missing
  console.log("Inserting Ugandan cuisine type...");
  await supabase.from('cuisine_types').upsert(
    { name: 'Ugandan', emoji: '🇺🇬', slug: 'ugandan' },
    { onConflict: 'slug' }
  );

  // 2. Insert Chefs
  console.log("Inserting Chefs...");
  const chefs = [
    {
      name: 'Lakshmi',
      bio: 'Cooking traditional Kerala meals for over 30 years. No shortcuts, just pure love and authenticity.',
      whatsapp: '971500000001',
      cuisine_type: 'South Indian',
      specialty: 'Authentic Kerala home meals, Pazhankanji and Meen Peera',
      area: 'Karama',
      lat: 25.2409,
      lng: 55.3059,
      is_approved: true,
      has_permit: true,
      photo_url: '/images/chefs/chef_lakshmi.png'
    },
    {
      name: 'Karthik',
      bio: 'Bringing the rustic flavors of Kongunadu and rural Tamil Nadu straight to Dubai.',
      whatsapp: '971500000002',
      cuisine_type: 'South Indian',
      specialty: 'Village-style Tamil food, Arisi Paruppu Sadam, Millets',
      area: 'Bur Dubai',
      lat: 25.2582,
      lng: 55.2972,
      is_approved: true,
      has_permit: true,
      photo_url: '/images/chefs/chef_karthik.png'
    },
    {
      name: 'Maria',
      bio: 'Your Tita Maria in Dubai. I cook the comforting Filipino food you miss from home.',
      whatsapp: '971500000003',
      cuisine_type: 'Filipino',
      specialty: 'Home-style Laing, Tortang Talong, and weekend specials',
      area: 'Al Rigga', // Deira area
      lat: 25.2666,
      lng: 55.3166,
      is_approved: true,
      has_permit: true,
      photo_url: '/images/chefs/chef_maria.png'
    },
    {
      name: 'Sarah',
      bio: 'Sharing the rich, earthy flavors of Uganda. Food that brings people together.',
      whatsapp: '971500000004',
      cuisine_type: 'Ugandan',
      specialty: 'Authentic Luwombo and freshly made Matoke with Binyebwa',
      area: 'Deira',
      lat: 25.2697,
      lng: 55.3094,
      is_approved: true,
      has_permit: false,
      photo_url: '/images/chefs/chef_sarah.png'
    }
  ];

  const chefIds = {};
  for (const c of chefs) {
    const { data, error } = await supabase.from('chefs').insert(c).select('id').single();
    if (error) {
      console.error("Error inserting chef", c.name, error);
    } else {
      chefIds[c.name] = data.id;
      console.log(`Inserted Chef ${c.name} with ID ${data.id}`);
    }
  }

  // 3. Insert Dishes
  console.log("Inserting Dishes...");
  const dishes = [
    {
      chef_id: chefIds['Lakshmi'],
      name: 'Pazhankanji',
      description: 'The ultimate Kerala comfort breakfast. Fermented rice gruel served with crushed bird\'s eye chili, small shallots, and spicy pickle. Cooling and highly nutritious.',
      price: 15,
      dietary_tags: ['vegetarian', 'dairy-free'],
      image_url: '/images/dishes/pazhankanji.png'
    },
    {
      chef_id: chefIds['Lakshmi'],
      name: 'Meen Peera',
      description: 'Traditional shredded small fish cooked with grated coconut, dark kokum (kudampuli), and fresh curry leaves. A coastal delicacy rarely found in restaurants.',
      price: 35,
      dietary_tags: ['dairy-free'],
      image_url: '/images/dishes/meen_peera.png'
    },
    {
      chef_id: chefIds['Karthik'],
      name: 'Arisi Paruppu Sadam',
      description: 'A soulful, one-pot dish of rice and dal from the Kongunadu region, topped with melting ghee. Served with crispy papadum.',
      price: 25,
      dietary_tags: ['vegetarian'],
      image_url: '/images/dishes/arisi_paruppu_sadam.png'
    },
    {
      chef_id: chefIds['Karthik'],
      name: 'Kambu Koozh',
      description: 'Cooling pearl millet porridge mixed with fresh buttermilk, served in an earthen pot with raw chopped onions and green chilies. The perfect summer cooler.',
      price: 12,
      dietary_tags: ['vegetarian'],
      image_url: '/images/dishes/kambu_koozh.png'
    },
    {
      chef_id: chefIds['Maria'],
      name: 'Laing',
      description: 'Authentic Bicolano home-style dish. Shredded dried taro leaves slow-cooked to perfection in rich, spicy coconut milk.',
      price: 30,
      dietary_tags: ['dairy-free'],
      image_url: '/images/dishes/laing.png'
    },
    {
      chef_id: chefIds['Maria'],
      name: 'Tortang Talong',
      description: 'A beloved Filipino home classic. Grilled eggplant flattened and fried into a savory omelet. Served with a side of sweet banana ketchup.',
      price: 20,
      dietary_tags: ['vegetarian', 'dairy-free'],
      image_url: '/images/dishes/tortang_talong.png'
    },
    {
      chef_id: chefIds['Sarah'],
      name: 'Chicken Luwombo',
      description: 'A royal Ugandan delicacy. Tender chicken pieces slow-cooked in a rich, earthy peanut sauce, all wrapped and steamed inside a fresh banana leaf.',
      price: 45,
      dietary_tags: ['dairy-free'],
      image_url: '/images/dishes/luwombo.png'
    },
    {
      chef_id: chefIds['Sarah'],
      name: 'Matoke with Binyebwa',
      description: 'Uganda\'s staple comfort food. Steamed and mashed green bananas (matoke) generously covered in a thick, creamy groundnut (peanut) sauce.',
      price: 35,
      dietary_tags: ['vegan', 'vegetarian', 'dairy-free'],
      image_url: '/images/dishes/matoke.png'
    }
  ];

  for (const d of dishes) {
    if (!d.chef_id) continue;
    const { error } = await supabase.from('dishes').insert(d);
    if (error) {
      console.error("Error inserting dish", d.name, error);
    } else {
      console.log(`Inserted Dish ${d.name}`);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
