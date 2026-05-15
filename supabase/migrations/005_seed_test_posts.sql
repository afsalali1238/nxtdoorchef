-- Create a temporary function to insert test posts linked to existing chefs
DO $$
DECLARE
  v_sanjeev_id uuid;
  v_amaka_id uuid;
  v_tariq_id uuid;
BEGIN
  -- Get Chef IDs
  SELECT id INTO v_sanjeev_id FROM chefs WHERE name = 'Sanjeev' LIMIT 1;
  SELECT id INTO v_amaka_id FROM chefs WHERE name = 'Amaka' LIMIT 1;
  SELECT id INTO v_tariq_id FROM chefs WHERE name = 'Tariq' LIMIT 1;

  -- Delete existing posts for these chefs to avoid duplicates if re-run
  IF v_sanjeev_id IS NOT NULL THEN
    DELETE FROM posts WHERE chef_id = v_sanjeev_id;
    INSERT INTO posts (chef_id, photo_url, dish_name, cultural_note, quote, cuisine_flag, expires_at)
    VALUES (
      v_sanjeev_id, 
      '/images/dish-1.jpg', 
      'Authentic Chicken Tikka Masala', 
      'A recipe passed down from my grandmother in Punjab.', 
      'Slow cooking is the secret to bringing out the true spices.', 
      '🇮🇳',
      now() + interval '24 hours'
    );
  END IF;

  IF v_amaka_id IS NOT NULL THEN
    DELETE FROM posts WHERE chef_id = v_amaka_id;
    INSERT INTO posts (chef_id, photo_url, dish_name, cultural_note, quote, cuisine_flag, expires_at)
    VALUES (
      v_amaka_id, 
      '/images/dish-2.jpg', 
      'Spicy Jollof Rice', 
      'Made with rich tomatoes and authentic West African spices.', 
      'You haven''t had real Jollof until you''ve had mine!', 
      '🌍',
      now() + interval '24 hours'
    );
  END IF;

  IF v_tariq_id IS NOT NULL THEN
    DELETE FROM posts WHERE chef_id = v_tariq_id;
    INSERT INTO posts (chef_id, photo_url, dish_name, cultural_note, quote, cuisine_flag, expires_at)
    VALUES (
      v_tariq_id, 
      '/images/dish-3.jpg', 
      'Syrian Lamb Mansaf', 
      'Traditional slow-cooked lamb in fermented yogurt sauce.', 
      'Food is how we keep our culture alive here in Dubai.', 
      '🇸🇾',
      now() + interval '24 hours'
    );
  END IF;
END $$;
