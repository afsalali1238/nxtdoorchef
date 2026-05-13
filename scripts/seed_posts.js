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

  const posts = [
    {
      chefName: 'Ahmad',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop', // generic food
      caption: 'Just finished a big pot of Machboos. The smell of cardamom is filling the whole house! 🥘',
    },
    {
      chefName: 'Fatima',
      image_url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=600&auto=format&fit=crop',
      caption: 'Fresh Halwa Puri ready for the weekend! Come by and say hello. 🍞',
    },
    {
      chefName: 'Nour',
      image_url: 'https://images.unsplash.com/photo-1548943487-a2e4d43b4851?q=80&w=600&auto=format&fit=crop',
      caption: 'Rolling fresh vine leaves today. It takes time, but it’s so worth it.',
    },
    {
      chefName: 'Sanjeev',
      image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop',
      caption: 'Butter chicken simmering. The secret is finishing it with Kasuri Methi. 🍛',
    }
  ];

  for (const p of posts) {
    const chef = chefs.find(c => c.name === p.chefName);
    if (!chef) continue;

    const { error } = await supabase.from('posts').insert({
      chef_id: chef.id,
      image_url: p.image_url,
      caption: p.caption,
    });

    if (error) {
      console.error(`Error inserting post for ${p.chefName}:`, error);
    } else {
      console.log(`Inserted post for ${p.chefName}`);
    }
  }

  console.log("Post seeding complete!");
}

seedPosts().catch(console.error);
