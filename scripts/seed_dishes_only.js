const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Fetching chefs...");
  const { data: chefs, error } = await supabase.from('chefs').select('id, name');
  if (error) throw error;

  const chefIds = {};
  for (const c of chefs) {
    chefIds[c.name] = c.id;
  }

  console.log("Inserting Dishes...");
  const dishes = [
    {
      chef_id: chefIds['Lakshmi'],
      name: 'Pazhankanji',
      description: 'The ultimate Kerala comfort breakfast. Fermented rice gruel served with crushed bird\'s eye chili, small shallots, and spicy pickle. Cooling and highly nutritious.',
      price_aed: 15,
      dietary_tags: ['vegetarian', 'dairy-free'],
      cuisine_type: 'South Indian',
      image_url: '/images/dishes/pazhankanji.png'
    },
    {
      chef_id: chefIds['Lakshmi'],
      name: 'Meen Peera',
      description: 'Traditional shredded small fish cooked with grated coconut, dark kokum (kudampuli), and fresh curry leaves. A coastal delicacy rarely found in restaurants.',
      price_aed: 35,
      dietary_tags: ['dairy-free'],
      cuisine_type: 'South Indian',
      image_url: '/images/dishes/meen_peera.png'
    },
    {
      chef_id: chefIds['Karthik'],
      name: 'Arisi Paruppu Sadam',
      description: 'A soulful, one-pot dish of rice and dal from the Kongunadu region, topped with melting ghee. Served with crispy papadum.',
      price_aed: 25,
      dietary_tags: ['vegetarian'],
      cuisine_type: 'South Indian',
      image_url: '/images/dishes/arisi_paruppu_sadam.png'
    },
    {
      chef_id: chefIds['Karthik'],
      name: 'Kambu Koozh',
      description: 'Cooling pearl millet porridge mixed with fresh buttermilk, served in an earthen pot with raw chopped onions and green chilies. The perfect summer cooler.',
      price_aed: 12,
      dietary_tags: ['vegetarian'],
      cuisine_type: 'South Indian',
      image_url: '/images/dishes/kambu_koozh.png'
    },
    {
      chef_id: chefIds['Maria'],
      name: 'Laing',
      description: 'Authentic Bicolano home-style dish. Shredded dried taro leaves slow-cooked to perfection in rich, spicy coconut milk.',
      price_aed: 30,
      dietary_tags: ['dairy-free'],
      cuisine_type: 'Filipino',
      image_url: '/images/dishes/laing.png'
    },
    {
      chef_id: chefIds['Maria'],
      name: 'Tortang Talong',
      description: 'A beloved Filipino home classic. Grilled eggplant flattened and fried into a savory omelet. Served with a side of sweet banana ketchup.',
      price_aed: 20,
      dietary_tags: ['vegetarian', 'dairy-free'],
      cuisine_type: 'Filipino',
      image_url: '/images/dishes/tortang_talong.png'
    },
    {
      chef_id: chefIds['Sarah'],
      name: 'Chicken Luwombo',
      description: 'A royal Ugandan delicacy. Tender chicken pieces slow-cooked in a rich, earthy peanut sauce, all wrapped and steamed inside a fresh banana leaf.',
      price_aed: 45,
      dietary_tags: ['dairy-free'],
      cuisine_type: 'Ugandan',
      image_url: '/images/dishes/luwombo.png'
    },
    {
      chef_id: chefIds['Sarah'],
      name: 'Matoke with Binyebwa',
      description: 'Uganda\'s staple comfort food. Steamed and mashed green bananas (matoke) generously covered in a thick, creamy groundnut (peanut) sauce.',
      price_aed: 35,
      dietary_tags: ['vegan', 'vegetarian', 'dairy-free'],
      cuisine_type: 'Ugandan',
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
