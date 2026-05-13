const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPosts() {
  console.log("Seeding daily posts...");

  // Get all active approved chefs
  const { data: chefs, error: chefsError } = await supabase
    .from('chefs')
    .select('id, name')
    .eq('is_approved', true)
    .eq('is_active', true);

  if (chefsError) {
    console.error("Error fetching chefs:", chefsError);
    return;
  }

  console.log(`Found ${chefs.length} approved chefs:`, chefs.map(c => c.name).join(', '));

  const posts = [
    {
      chefName: 'Ahmad',
      photo_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
      dish_name: 'Chicken Machboos',
      cultural_note: 'This is the dish my grandmother made every Friday. The smell of cardamom takes me back to her kitchen in Al Ain.',
    },
    {
      chefName: 'Fatima',
      photo_url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=600&auto=format&fit=crop',
      dish_name: 'Halwa Puri',
      cultural_note: 'In Pakistan, Sunday mornings mean Halwa Puri. My mother taught me the exact ratio of semolina to ghee.',
    },
    {
      chefName: 'Nour',
      photo_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=600&auto=format&fit=crop',
      dish_name: 'Warak Enab (Vine Leaves)',
      cultural_note: 'Rolling vine leaves is meditation. In Syria, we do it together as a family, passing stories across generations.',
    },
    {
      chefName: 'Sanjeev',
      photo_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop',
      dish_name: 'Butter Chicken',
      cultural_note: 'The secret is finishing with Kasuri Methi. This is how my father made it in our dhaba in Amritsar.',
    }
  ];

  for (const p of posts) {
    const chef = chefs.find(c => c.name === p.chefName);
    if (!chef) {
      console.log(`Chef "${p.chefName}" not found — skipping`);
      continue;
    }

    const { error } = await supabase.from('posts').insert({
      chef_id: chef.id,
      photo_url: p.photo_url,
      dish_name: p.dish_name,
      cultural_note: p.cultural_note,
    });

    if (error) {
      console.error(`Error inserting post for ${p.chefName}:`, error);
    } else {
      console.log(`✓ Posted "${p.dish_name}" by ${p.chefName}`);
    }
  }

  console.log("\nPost seeding complete!");
}

seedPosts().catch(console.error);
