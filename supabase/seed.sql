-- ==============================================================================
-- Seed Data for Shanti Nivas Heritage Lodge, Jaipur
-- Tenant ID: demo-hotel-jaipur
-- ==============================================================================

-- 1. Create Site
INSERT INTO public.sites (id, name, domain)
VALUES ('demo-hotel-jaipur', 'Shanti Nivas Heritage Lodge', 'shantinivasheritage.com')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Hotel Profile
INSERT INTO public.hotel_profiles (
    site_id,
    name,
    tagline,
    about_heading,
    about_text,
    hero_image_url,
    hero_subtitle,
    phone,
    whatsapp_number,
    email,
    address,
    city,
    state,
    postal_code,
    google_map_embed_url,
    google_map_directions_url,
    check_in_time,
    check_out_time,
    reception_hours,
    seo_title,
    seo_description,
    seo_keywords,
    whatsapp_prefill,
    social_facebook,
    social_instagram
) VALUES (
    'demo-hotel-jaipur',
    'Shanti Nivas Heritage Lodge',
    'Authentic Rajasthani Hospitality & Peaceful Heritage Stay',
    'A Peaceful Heritage Haven in the Pink City',
    'Founded with a mission to offer genuine Indian hospitality at budget-conscious rates, Shanti Nivas Heritage Lodge welcomes pilgrims, backpackers, and families alike. Our property combines traditional Rajasthani architectural jharokhas with modern amenities including high-speed Wi-Fi, clean private bathrooms with 24-hour geyser hot water, and silent air conditioning. Located within 5 minutes walking distance of Hawa Mahal and City Palace, you spend less time in traffic and more time enjoying Jaipur.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    'Stay steps away from Hawa Mahal in clean, air-conditioned comfort. Traditional warmth, safe family environment, and authentic home-style Indian cuisine.',
    '+91 98290 12345',
    '+919829012345',
    'stay@shantinivasheritage.com',
    '42, Heritage Havelis Lane, Near Hawa Mahal, Badi Chaupar, Jaipur, Rajasthan 302002',
    'Jaipur',
    'Rajasthan',
    '302002',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.34!2d75.8267!3d26.9239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db14b1bd3065b%3A0x6b2e1e075841029c!2sHawa%20Mahal!5e0!3m2!1sen!2sin!4v1700000000000',
    'https://maps.google.com/?q=Hawa+Mahal+Jaipur',
    '12:00 PM',
    '11:00 AM',
    '24 Hours Front Desk',
    'Shanti Nivas Heritage Lodge | Best Budget Hotel in Jaipur near Hawa Mahal',
    'Comfortable AC rooms in Jaipur from ₹999/night. Free high-speed Wi-Fi, 24-hr hot water, pure veg kitchen & rooftop view of Pink City. Instant booking on WhatsApp.',
    ARRAY['hotel in jaipur', 'budget hotel jaipur', 'lodge near hawa mahal', 'heritage stay jaipur', 'family lodge jaipur'],
    'Namaste! I found Shanti Nivas Heritage Lodge online and would like to inquire about room availability and pricing.',
    'https://facebook.com/shantinivasheritage',
    'https://instagram.com/shantinivasheritage'
)
ON CONFLICT (site_id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    about_text = EXCLUDED.about_text,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    address = EXCLUDED.address,
    updated_at = NOW();

-- 3. Seed Rooms
INSERT INTO public.rooms (site_id, name, description, price_per_night, image_url, capacity, bed_type, amenities, is_available, is_published, sort_order)
VALUES
(
    'demo-hotel-jaipur',
    'Deluxe Heritage AC Room',
    'Spacious room adorned with traditional Rajasthani wall frescoes, split air conditioning, modern ensuite bathroom with geyser, and LED television.',
    1499.00,
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    '2 Adults',
    '1 King Size Double Bed',
    ARRAY['Air Conditioning', 'Free High-Speed Wi-Fi', 'Geyser Hot Water', 'Flat Screen TV', 'Daily Housekeeping', 'Electric Kettle'],
    true,
    true,
    1
),
(
    'demo-hotel-jaipur',
    'Standard Non-AC Room',
    'Pocket-friendly, squeaky clean room with high-ceiling fan, writing table, private western toilet with 24-hour running hot water, and quiet courtyard view.',
    899.00,
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    '2 Adults',
    '1 Queen Double Bed',
    ARRAY['Ceiling Fan', 'Free High-Speed Wi-Fi', 'Geyser Hot Water', 'Daily Housekeeping', 'Courtyard View'],
    true,
    true,
    2
),
(
    'demo-hotel-jaipur',
    'Royal Family Jharokha Suite',
    'Large interconnected family room featuring a traditional carved wooden jharokha balcony overlooking the Pink City bazaars, seating area, and mini-fridge.',
    2299.00,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    '4 Adults (Family)',
    '2 Queen Beds',
    ARRAY['Air Conditioning', 'Free High-Speed Wi-Fi', 'Geyser Hot Water', 'Private Balcony', 'Mini Refrigerator', 'Tea/Coffee Maker', 'Complimentary Bottled Water'],
    true,
    true,
    3
);

-- 4. Seed Gallery Photos
INSERT INTO public.photos (site_id, url, alt_text, caption, category, is_hero, sort_order)
VALUES
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'Rooftop terrace and traditional arches of Shanti Nivas Heritage Lodge',
    'Rooftop seating area with spectacular views of sunrise over Pink City',
    'Exterior',
    true,
    1
),
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    'Deluxe Heritage Room with traditional wall art',
    'Clean, spacious heritage room with comfortable queen bed',
    'Rooms',
    false,
    2
),
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'Family suite interior with warm lighting and wooden furnishings',
    'Family suite designed for group comfort and privacy',
    'Rooms',
    false,
    3
),
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
    'Traditional Rajasthani inner courtyard and seating',
    'Inner open-air courtyard garden for peaceful evening tea',
    'Courtyard',
    false,
    4
),
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'Reception lobby with cultural artifacts and 24-hr front desk',
    'Welcoming front desk with express check-in assistance',
    'Lobby',
    false,
    5
),
(
    'demo-hotel-jaipur',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    'Rooftop dining space serving pure vegetarian Rajasthani thali',
    'Authentic rooftop pure veg dining overlooking Nahargarh Fort',
    'Dining',
    false,
    6
);

-- 5. Seed Amenities
INSERT INTO public.amenities (site_id, name, icon, description, sort_order)
VALUES
('demo-hotel-jaipur', 'High-Speed Wi-Fi', 'wifi', 'Reliable fibre broadband throughout the lodge and rooms', 1),
('demo-hotel-jaipur', '24/7 Hot Water', 'shower-head', 'Individual instantaneous & solar geysers in every bathroom', 2),
('demo-hotel-jaipur', 'Silent Air Conditioning', 'snowflake', 'Modern split AC units with backup invertor power', 3),
('demo-hotel-jaipur', 'Rooftop Terrace', 'coffee', 'Panoramic view of Hawa Mahal and Old City skyline', 4),
('demo-hotel-jaipur', 'Pure Veg Kitchen', 'utensils', 'Fresh, homemade breakfast, tea and pure vegetarian thalis', 5),
('demo-hotel-jaipur', 'Luggage Storage', 'shield-check', 'Secure cloakroom before check-in and after checkout', 6),
('demo-hotel-jaipur', '24-Hour Reception', 'clock', 'Helpful family-operated desk to assist arrivals at any hour', 7),
('demo-hotel-jaipur', 'Local Travel Desk', 'map-pin', 'Direct auto-rickshaw & cab bookings at transparent government rates', 8);

-- 6. Seed FAQs (for Local SEO and FAQPage Schema)
INSERT INTO public.faqs (site_id, question, answer, sort_order)
VALUES
(
    'demo-hotel-jaipur',
    'How far is Shanti Nivas Heritage Lodge from Hawa Mahal?',
    'We are located just 400 metres away from Hawa Mahal, approximately a 4 to 5 minute relaxed walk through the famous Badi Chaupar bazaar.',
    1
),
(
    'demo-hotel-jaipur',
    'How can I book a room at Shanti Nivas without credit cards?',
    'You can book directly via WhatsApp or phone call. We confirm bookings with zero commission and accept UPI (Google Pay, PhonePe, Paytm), cash, or net banking upon check-in.',
    2
),
(
    'demo-hotel-jaipur',
    'What are the standard check-in and check-out timings?',
    'Standard check-in is from 12:00 PM onwards and check-out is by 11:00 AM. Early check-in or late checkout is gladly accommodated subject to room availability.',
    3
),
(
    'demo-hotel-jaipur',
    'Is parking available at the property?',
    'We provide safe 2-wheeler parking inside our gated courtyard and have reserved 4-wheeler parking space located 80 metres from the entrance.',
    4
),
(
    'demo-hotel-jaipur',
    'Are unmarried couples and solo female travelers allowed?',
    'Yes, all bona fide adult guests presenting valid government photo ID (Aadhaar Card, Passport, Voter ID or Driving Licence) are warmly welcome. We pride ourselves on a safe, respectful environment.',
    5
);
