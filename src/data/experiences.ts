export interface ExperienceHighlight {
  title: string;
  description: string;
  icon?: string;
}

export interface ExperienceItineraryDay {
  day: string;
  title: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface ExperienceGuide {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ExperienceGalleryItem {
  url: string;
  caption: string;
  category?: string;
}

export interface ExperienceTestimonial {
  quote: string;
  name: string;
  location: string;
  role?: string;
  avatar?: string;
}

export interface Experience {
  id: string;
  slug: string;
  type: 'pilgrimage' | 'retreat';
  category: 'nepal' | 'himalayan' | 'upcoming' | 'past';
  status: 'upcoming' | 'past';
  title: string;
  subtitle: string;
  location: string;
  duration: string;
  dates: string;
  groupSize: string;
  heroImage: string;
  shortDescription: string;
  fullDescription: string[];
  highlights: ExperienceHighlight[];
  guidance: ExperienceGuide[];
  itinerary: ExperienceItineraryDay[];
  gallery: ExperienceGalleryItem[];
  testimonials: ExperienceTestimonial[];
  pricing?: {
    standard: string;
    details: string;
  };
  whatsIncluded: string[];
}

export const experiences: Experience[] = [
  {
    id: 'nepal-sacred-himalayas',
    slug: 'nepal-sacred-himalayas',
    type: 'pilgrimage',
    category: 'nepal',
    status: 'upcoming',
    title: 'A Journey Through Sacred Nepal',
    subtitle: 'Heart of the Himalayas Pilgrimage',
    location: 'Kathmandu, Pokhara & Sacred Himalayan Valleys',
    duration: '12 Days',
    dates: 'October 14 – 25, 2026',
    groupSize: '15 – 18 Travelers',
    heroImage: 'https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1920',
    shortDescription: 'A immersive pilgrimage through the sacred temples, ancient stupas, high Himalayan valleys, and living spiritual traditions of Nepal.',
    fullDescription: [
      'Nepal is not merely a geographic landscape; it is an ancient altar of living wisdom where mountain peaks meet divine stillness. This 12-day pilgrimage is designed for seekers, lovers of music, and travelers looking for an authentic inner and outer journey.',
      'We journey from the historic ritual fires of Pashupatinath in Kathmandu to the high serene alpine valleys of Pokhara and Muktinath. Along the path, we blend sacred temple visits, mountain walks, daily meditation, devotional music circles, and moments of profound quietude.',
      'Guided by seasoned Himalayan pilgrims and traditional wisdom keepers, every step invites you to slow down, drop into presence, and reconnect with what truly matters.'
    ],
    highlights: [
      {
        title: 'Sacred Temple Visits',
        description: 'Sunrise ceremonies at Pashupatinath, Boudhanath Stupa, and Muktinath Temple.',
        icon: 'Landmark'
      },
      {
        title: 'Himalayan Landscapes',
        description: 'Breathtaking vistas of Annapurna, Machapuchare, and Dhaulagiri mountain ranges.',
        icon: 'Mountain'
      },
      {
        title: 'Meditation & Silent Walks',
        description: 'Guided morning pranayama, silent mountain strolls, and riverbank reflection.',
        icon: 'Sparkles'
      },
      {
        title: 'Sacred Devotional Music',
        description: 'Evening kirtans, classical instrumentals, and soul-stirring Himalayan songs.',
        icon: 'Music'
      },
      {
        title: 'Satsangs & Ancient Wisdom',
        description: 'Discussions with local spiritual elders, monastics, and authentic practitioners.',
        icon: 'Sun'
      },
      {
        title: 'Cultural Heritage Immersion',
        description: 'Exploring ancient Newari architecture, traditional tea houses, and pottery towns.',
        icon: 'Compass'
      }
    ],
    guidance: [
      {
        name: 'Prem Prakash',
        role: 'Pilgrimage Lead & Sacred Musician',
        bio: 'Over 15 years guiding spiritual journeys through the Indian and Nepalese Himalayas. Prem bridges sacred music, mantra, and deep Himalayan storytelling.',
        image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=900'
      },
      {
        name: 'Sunita Gurung',
        role: 'Himalayan Guide & Cultural Facilitator',
        bio: 'Born in the Pokhara valley, Sunita carries profound knowledge of Nepalese sacred sites, local monastic customs, and alpine trails.',
        image: 'https://images.pexels.com/photos/36529362/pexels-photo-36529362.jpeg?auto=compress&cs=tinysrgb&w=900'
      }
    ],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Arrival in Kathmandu',
        location: 'Kathmandu Valley (1,400m)',
        description: 'Welcome gathering, traditional Nepalese tea ceremony, introductory orientation and evening opening circle beneath the ambient lights of Kathmandu.',
        highlights: ['Welcome Circle', 'Traditional Dinner', 'Introduction to the Pilgrimage']
      },
      {
        day: 'Day 02',
        title: 'Sacred Temples & Fires of Pashupati',
        location: 'Pashupatinath & Boudhanath',
        description: 'Dawn meditation at Boudhanath Stupa as monks chant prayers. In the evening, witness the divine Bagmati Ganga Aarti at Pashupatinath.',
        highlights: ['Stupa Circumambulation', 'Bagmati Aarti Ritual', 'Monastic Blessing']
      },
      {
        day: 'Day 03',
        title: 'Journey to the Lakeside of Pokhara',
        location: 'Pokhara Valley (820m)',
        description: 'Scenic overland travel through lush river valleys toward Pokhara. Evening reflection by the tranquil waters of Fewa Lake.',
        highlights: ['Trishuli River Vistas', 'Fewa Lake Sunset', 'Devotional Evening Music']
      },
      {
        day: 'Day 04',
        title: 'Sunrise Over Annapurna',
        location: 'Sarangkot & Peace Pagoda',
        description: 'Early morning climb to witness golden sunlight illuminate Machapuchare peak. Silent meditation at the World Peace Pagoda.',
        highlights: ['Golden Mountain Sunrise', 'Silent Meditation', 'Peace Pagoda Visit']
      },
      {
        day: 'Day 05',
        title: 'Flight into Mustang Valley',
        location: 'Jomsom & Kagbeni (2,800m)',
        description: 'Mountain flight through the Kali Gandaki gorge into the arid, mystical Mustang terrain. Walk through ancient stone streets of Kagbeni.',
        highlights: ['Himalayan Flight', 'Trans-Himalayan Landscape', 'Kagbeni Village Walk']
      },
      {
        day: 'Day 06',
        title: 'Pilgrimage to Muktinath',
        location: 'Muktinath Sacred Shrine (3,710m)',
        description: 'Ascend to the revered 108 water spouts of Muktinath. Experience the eternal burning flame of natural gas over spring water.',
        highlights: ['108 Waterspouts Ritual', 'Temple Blessing', 'High Altitude Altitude Reflection']
      },
      {
        day: 'Day 07',
        title: 'High Altitude Silence & Music Circle',
        location: 'Marpha & Kali Gandaki',
        description: 'Day of quiet integration amidst apple orchards of Marpha village. Sunset kirtan and acoustic sound bath under mountain peaks.',
        highlights: ['Apple Orchard Walk', 'Mauna (Silence) Hours', 'Mountain Kirtan Circle']
      },
      {
        day: 'Day 08',
        title: 'Descent to Pokhara Sanctuary',
        location: 'Pokhara Valley',
        description: 'Return flight to Pokhara. Afternoon rest, herbal massage, and sharing circle overlooking the serene valley.',
        highlights: ['Valley Return', 'Rest & Integration', 'Sharing Circle']
      },
      {
        day: 'Day 09',
        title: 'Begnas Lake & Sacred Sound',
        location: 'Begnas Lake',
        description: 'Peaceful boat journey across quiet Begnas Lake to a secluded mountain lodge. Sacred music workshop and sound meditation.',
        highlights: ['Wooden Boat Ride', 'Sound Healing Session', 'Organic Feast']
      },
      {
        day: 'Day 10',
        title: 'Return to Kathmandu Heritage',
        location: 'Patan & Bhaktapur',
        description: 'Fly back to Kathmandu. Private tour of Patan Durbar Square and meetings with Newari copper artisans and thangka painters.',
        highlights: ['Patan Heritage Walk', 'Thangka Painting Atelier', 'Artisan Dialogues']
      },
      {
        day: 'Day 11',
        title: 'Closing Circle & Feast of Gratitude',
        location: 'Kathmandu Sanctuary',
        description: 'Final morning meditation, reflective journaling, ceremonial closing dinner and devotional music performance.',
        highlights: ['Gratitude Ritual', 'Closing Kirtan', 'Celebratory Dinner']
      },
      {
        day: 'Day 12',
        title: 'Homeward Journey',
        location: 'Kathmandu International Airport',
        description: 'Heartfelt farewells as participants depart with transformed hearts and quiet minds.',
        highlights: ['Farewell Breakfast', 'Transfer to Airport']
      }
    ],
    gallery: [
      {
        url: 'https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Himalayan peaks at dawn over Mustang valley'
      },
      {
        url: 'https://images.pexels.com/photos/32225795/pexels-photo-32225795.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Prayer flags fluttering at Boudhanath Stupa'
      },
      {
        url: 'https://images.pexels.com/photos/31874584/pexels-photo-31874584.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Quiet mountain trails through rhododendron groves'
      },
      {
        url: 'https://images.pexels.com/photos/29622178/pexels-photo-29622178.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Evening fire ceremony by the Bagmati riverbank'
      },
      {
        url: 'https://images.pexels.com/photos/39686332/pexels-photo-39686332.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Devotional music gathering amidst mountain silence'
      },
      {
        url: 'https://images.pexels.com/photos/14461598/pexels-photo-14461598.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Pilgrims walking towards the sacred high passes'
      }
    ],
    testimonials: [
      {
        quote: 'This pilgrimage was not a vacation; it was a homecoming. Walking through Nepal with JustPrem created space for my soul to breathe.',
        name: 'Elena Rostova',
        location: 'Zurich, Switzerland',
        role: 'Artist & Pilgrim'
      },
      {
        quote: 'The harmony of sacred music, Himalayan silence, and thoughtful guidance made this the most profound journey of my life.',
        name: 'Marcus Vance',
        location: 'Melbourne, Australia',
        role: 'Architect'
      }
    ],
    whatsIncluded: [
      'All internal flights within Nepal (Kathmandu - Jomsom - Pokhara - Kathmandu)',
      'Boutique eco-lodge & heritage hotel accommodations',
      'All daily organic vegetarian meals (Breakfast, Lunch, Dinner)',
      'Private comfortable ground transportation throughout',
      'All temple entry permits, TIMS card, and Mustang conservation fees',
      'Daily guided meditation, yoga, and devotional music circles',
      'Experienced Himalayan pilgrimage leaders & local guides'
    ]
  },
  {
    id: 'mustang-ancient-kingdom',
    slug: 'mustang-ancient-kingdom',
    type: 'pilgrimage',
    category: 'nepal',
    status: 'upcoming',
    title: 'Upper Mustang — The Forgotten Kingdom',
    subtitle: 'Trans-Himalayan Sacred Odyssey',
    location: 'Lo Manthang & Upper Mustang, Nepal',
    duration: '14 Days',
    dates: 'May 10 – 23, 2027',
    groupSize: '12 Travelers',
    heroImage: 'https://images.pexels.com/photos/32261503/pexels-photo-32261503.jpeg?auto=compress&cs=tinysrgb&w=1920',
    shortDescription: 'Journey into the untouched walled kingdom of Lo Manthang, 8th-century cliff monasteries, and Tibet-bordered high desert valleys.',
    fullDescription: [
      'Hidden behind the high Annapurna barrier lies Upper Mustang — one of the last preserved strongholds of classical Tibetan culture on Earth. Known as the Kingdom of Lo, this high-altitude desert is carved with wind-sculpted red cliffs, ancient meditation caves, and centuries-old monasteries.',
      'This 14-day Retreat takes a small, dedicated group into the heart of Lo Manthang. We ride and walk through sacred landscapes untouched by modern chaos, holding daily silence, music, and contemplation in caves where saints once meditated.'
    ],
    highlights: [
      { title: 'Lo Manthang Walled City', description: 'Explore the 15th-century royal palace and golden monastic temples.' },
      { title: 'Ancient Cliff Caves', description: 'Visit Sky Caves of Chhoser used by Himalayan ascetics for 2,000 years.' },
      { title: '8th-Century Monasteries', description: 'Chungsi Cave and Ghar Gompa — the oldest monastery in Mustang.' },
      { title: 'Desert Silence & Sound', description: 'Acoustic chanting inside centuries-old stone gompas.' }
    ],
    guidance: [
      {
        name: 'Prem Prakash',
        role: 'Journey Leader',
        bio: 'Guided over 8 Mustang expeditions with deep respect for local Tibetan Buddhist culture.',
        image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=900'
      }
    ],
    itinerary: [
      { day: 'Day 01', title: 'Kathmandu Arrival', location: 'Kathmandu', description: 'Briefing & sacred welcome ritual.', highlights: ['Orientation'] },
      { day: 'Day 02', title: 'Flight to Pokhara', location: 'Pokhara', description: 'Preparation for trans-Himalayan flight.', highlights: ['Lake Stroll'] },
      { day: 'Day 03', title: 'Fly to Jomsom & Trek to Kagbeni', location: 'Kagbeni', description: 'Gateway to Upper Mustang.', highlights: ['Forbidden Gateway'] },
      { day: 'Day 04-06', title: 'Journey to Lo Manthang', location: 'Upper Mustang', description: 'Passing red canyons, chortens, and ancient villages.', highlights: ['Red Canyons', 'Ghar Gompa'] },
      { day: 'Day 07-09', title: 'Sanctuary of Lo Manthang & Caves', location: 'Lo Manthang', description: 'Chhoser Sky Caves & monastic teachings.', highlights: ['Royal City', 'Sky Caves'] },
      { day: 'Day 10-14', title: 'Return Journey & Departure', location: 'Kathmandu', description: 'Descending down the valley and final sharing circle.', highlights: ['Closing Circle'] }
    ],
    gallery: [
      { url: 'https://images.pexels.com/photos/32261503/pexels-photo-32261503.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Red sand cliffs of Upper Mustang' }
    ],
    testimonials: [
      { quote: 'Upper Mustang with JustPrem felt like stepping into a biblical landscape. Utterly transformative.', name: 'Julian Vance', location: 'London, UK' }
    ],
    whatsIncluded: [
      'Upper Mustang Special Restricted Area Permits ($500 value)',
      'All flights & private 4x4 mountain vehicles',
      'Accommodations & daily organic meals',
      'Spiritual guidance & local Mustang cultural guides'
    ]
  },
  {
    id: 'himalayan-bhakti-retreat',
    slug: 'himalayan-bhakti-retreat',
    type: 'retreat',
    category: 'himalayan',
    status: 'upcoming',
    title: 'Himalayan Bhakti Retreat',
    subtitle: 'A Journey of Devotion, Music & Quietude',
    location: 'Harsil Valley, Sacred Garhwal Himalayas',
    duration: '7 Days',
    dates: 'April 18 – 24, 2027',
    groupSize: '20 – 25 Participants',
    heroImage: 'https://images.pexels.com/photos/36520323/pexels-photo-36520323.jpeg?auto=compress&cs=tinysrgb&w=1920',
    shortDescription: 'A 7-day immersion in pine-forested alpine valleys, morning silence, devotional kirtan, and Himalayan rivers.',
    fullDescription: [
      'Nestled amidst dense deodar pine forests and snow-draped peaks, Harsil Valley is one of the Himalayas’ best-kept spiritual sanctuaries. Here, the turquoise waters of the Bhagirathi river flow gently past quiet wooden hamlets.',
      'The Himalayan Bhakti Retreat is an invitation to step away from noise, gather with like-minded souls, and sink into the nectar of devotional music (Bhakti), meditation, and rustic mountain life.',
      'Each day unfolds effortlessly: dawn chanting by the riverbank, gentle morning movement, afternoon walks through apple orchards, and evening satsangs filled with acoustic music, fire, and shared warmth.'
    ],
    highlights: [
      { title: 'Sacred Devotional Music', description: 'Daily evening kirtan, harmonium sessions, and sound circles by the bonfire.', icon: 'Music' },
      { title: 'Morning Silence & Pranayama', description: 'Breathwork and gentle movement in crisp Himalayan pine air.', icon: 'Sparkles' },
      { title: 'Harsil Apple Orchard Walks', description: 'Walks through historic wooden mountain villages and apple orchards.', icon: 'Footprints' },
      { title: 'Satsang & Philosophy', description: 'Soulful discussions on Bhakti traditions, love, and inner surrender.', icon: 'Heart' },
      { title: 'Glacial River Dipping', description: 'Refreshing dips in pristine, untouched Himalayan streams.', icon: 'Waves' }
    ],
    guidance: [
      {
        name: 'Prem Prakash & Musicians',
        role: 'Retreat Facilitator & Kirtan Collective',
        bio: 'Devoted to sharing ancient mantras and heart-opening melodies in natural sacred spaces.',
        image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=900'
      },
      {
        name: 'Asha Sharma',
        role: 'Yoga & Pranayama Practitioner',
        bio: 'Guides gentle somatic practices that tune the physical body for deep meditative stillness.',
        image: 'https://images.pexels.com/photos/16720740/pexels-photo-16720740.jpeg?auto=compress&cs=tinysrgb&w=900'
      }
    ],
    itinerary: [
      { day: 'Day 01', title: 'Arrival in Harsil Sanctuary', location: 'Harsil Valley', description: 'Arrival, warm herbal welcome tea, introduction to the retreat space, and evening campfire opening song circle.', highlights: ['Arrival Tea', 'Opening Kirtan Circle'] },
      { day: 'Day 02', title: 'Awakening the Heart', location: 'Bhagirathi Riverbank', description: 'Sunrise pranayama by the riverbank followed by a heart-centered satsang on the path of Bhakti.', highlights: ['Riverbank Pranayama', 'Bhakti Satsang'] },
      { day: 'Day 03', title: 'Pine Forest Silence Walk', location: 'Dharali & Deodar Woods', description: 'Morning in noble silence (Mauna). Walk through towering pine woods to an ancient village shrine.', highlights: ['Mauna Walk', 'Shrine Visit'] },
      { day: 'Day 04', title: 'Music & Sacred Mantra', location: 'Harsil Retreat Lodge', description: 'Workshop on Indian classical scales, mantra pronunciation, and group vocal resonance.', highlights: ['Voice Workshop', 'Harmonium Circle'] },
      { day: 'Day 05', title: 'Trek to Sattal Alpine Lakes', location: 'Sattal Lakes (2,700m)', description: 'Day trek to seven glacial lakes surrounded by snow peaks. Picnic, meditation, and quiet reflection.', highlights: ['Glacial Lakes Trek', 'Alpine Meditation'] },
      { day: 'Day 06', title: 'Celebration of Love & Gratitude', location: 'Harsil Fireplace', description: 'Full evening of celebration, open-mic participant expressions, devotional singing, and festive feast.', highlights: ['Devotional Celebration', 'Himalayan Feast'] },
      { day: 'Day 07', title: 'Blessings & Homeward Return', location: 'Harsil Valley', description: 'Final prayer circle by the water, exchange of gifts, and departing hugs.', highlights: ['Blessing Circle', 'Departure'] }
    ],
    gallery: [
      { url: 'https://images.pexels.com/photos/36520323/pexels-photo-36520323.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Pine trees lining the Bhagirathi river in Harsil' },
      { url: 'https://images.pexels.com/photos/32436570/pexels-photo-32436570.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Evening music gathering around the fire' },
      { url: 'https://images.pexels.com/photos/20046905/pexels-photo-20046905.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Walk through mountain villages' }
    ],
    testimonials: [
      { quote: 'I came to Harsil carrying heavy stress and left with a heart overflowing with song and peace. JustPrem creates pure magic.', name: 'Sarah Jenkins', location: 'Vancouver, Canada' },
      { quote: 'The music, the pine scent, the gentle guidance... everything was curated with divine care.', name: 'Devon Mehta', location: 'California, USA' }
    ],
    whatsIncluded: [
      '7 Days accommodation in eco-crafted mountain lodge',
      '3 Fresh organic vegetarian/sattvic meals daily',
      'Daily morning yoga, breathwork, and evening Bhakti kirtans',
      'Guided alpine forest hikes & lake excursions',
      'All retreat materials and herbal tea station'
    ]
  },
  {
    id: 'silence-and-sound-rishikesh',
    slug: 'silence-and-sound-rishikesh',
    type: 'retreat',
    category: 'upcoming',
    status: 'upcoming',
    title: 'Silence & Sacred Sound Retreat',
    subtitle: '3 Days of Mauna & Classical Raga Immersion',
    location: 'Upper Rishikesh Ganga Valley, Foothills of Himalayas',
    duration: '5 Days',
    dates: 'November 08 – 12, 2026',
    groupSize: '20 Participants',
    heroImage: 'https://images.pexels.com/photos/34792307/pexels-photo-34792307.jpeg?auto=compress&cs=tinysrgb&w=1920',
    shortDescription: 'Deepen inner quiet with 3 days of noble silence, sound baths, sitar ragas, and Ganga river meditations.',
    fullDescription: [
      'Where the holy Ganga emerges from the Himalayan gorges into the foothills lies a sanctuary of eternal stillness. This retreat balances the power of absolute outer silence with the subtle vibration of sacred sound.',
      'For 3 full days, participants maintain Mauna (noble silence) to quiet the mental chatter. During this quiet, master musicians perform intimate evening Indian classical ragas that soothe the nervous system and awaken intuition.'
    ],
    highlights: [
      { title: '3 Days Noble Silence', description: 'Gentle digital detox & inward silence for deep mental rejuvenation.', icon: 'VolumeX' },
      { title: 'Classical Indian Sound Baths', description: 'Live Sitar, Bamboo Flute (Bansuri), and Singing Bowls at dusk.', icon: 'Music' },
      { title: 'Ganga Riverbank Meditation', description: 'Morning breathwork on private white sand beaches.', icon: 'Waves' }
    ],
    guidance: [
      {
        name: 'Prem Prakash',
        role: 'Sound Facilitator',
        bio: 'Studied classical Indian music and nada yoga for over two decades.',
        image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=900'
      }
    ],
    itinerary: [
      { day: 'Day 01', title: 'Arrival & Intention Setting', location: 'Upper Rishikesh', description: 'Welcoming guests, room allocation, and pre-silence gathering.', highlights: ['Opening Circle'] },
      { day: 'Day 02-04', title: 'The Sacred Tunnel of Silence', location: 'Ganga Ashram', description: '3 Days of Mauna, silent walks, sound ragas, and restorative yoga.', highlights: ['Noble Silence', 'Sitar Raga Bath'] },
      { day: 'Day 05', title: 'Breaking Silence & Integration', location: 'Ganga Beach', description: 'Ceremonial sound break, joyful sharing, and departure.', highlights: ['Silence Break Ritual'] }
    ],
    gallery: [
      { url: 'https://images.pexels.com/photos/34792307/pexels-photo-34792307.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Sunrise over Upper Ganga river' }
    ],
    testimonials: [
      { quote: 'Silence in Rishikesh with live sitar in the evening was an experience of absolute bliss.', name: 'Ananya Roy', location: 'Mumbai, India' }
    ],
    whatsIncluded: [
      '5 Days Ashram eco-stay with private Ganga view',
      'Organic Ayurvedic sattvic cuisine',
      'All sound baths, sitar performances, and yoga sessions'
    ]
  },
  {
    id: 'annapurna-sanctuary-retreat',
    slug: 'annapurna-sanctuary-retreat',
    type: 'retreat',
    category: 'past',
    status: 'past',
    title: 'Annapurna Valley Retreat',
    subtitle: 'Memory of Silence & Sacred Mountain Music',
    location: 'Pokhara Foothills, Nepal',
    duration: '8 Days',
    dates: 'October 12 – 19, 2025 (Past Experience)',
    groupSize: '18 Participants',
    heroImage: 'https://images.pexels.com/photos/31874584/pexels-photo-31874584.jpeg?auto=compress&cs=tinysrgb&w=1920',
    shortDescription: 'A past retreat memory of acoustic music, mountain sunrise meditations, and high valley walks.',
    fullDescription: [
      'In October 2025, 18 seekers gathered in the peaceful hills overlooking the Annapurna range. Over 8 days, we sang under starlit Nepalese skies, learned ancient chanting techniques, and connected deeply as a soul family.'
    ],
    highlights: [
      { title: 'Machapuchare Sunrises', description: 'Daily dawn meditation facing Fishtail Peak.' },
      { title: 'Sacred Kirtan Nights', description: 'Acoustic evening circles around Nepalese oil lamps.' },
      { title: 'Organic Mountain Feast', description: 'Fresh farm food grown in local Himalayan soil.' }
    ],
    guidance: [
      { name: 'Prem Prakash', role: 'Retreat Host', bio: 'Guided the 2025 Annapurna circle.', image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=900' }
    ],
    itinerary: [
      { day: 'Archive', title: '8 Days of Himalayan Immersion', location: 'Annapurna', description: 'Reflections from our past retreat memory.', highlights: ['Past Experience'] }
    ],
    gallery: [
      { url: 'https://images.pexels.com/photos/31874584/pexels-photo-31874584.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Golden peak of Machapuchare during sunset' },
      { url: 'https://images.pexels.com/photos/13849093/pexels-photo-13849093.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Group meditation on the hill ridge' }
    ],
    testimonials: [
      { quote: 'The Annapurna retreat bonded us into a lifelong family. I still carry the songs in my heart.', name: 'Claire Dubois', location: 'Paris, France' }
    ],
    whatsIncluded: [
      'Archive experience record'
    ]
  }
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug || e.id === slug);
}

export function getExperiencesByType(type: 'Retreat' | 'retreat'): Experience[] {
  return experiences.filter((e) => e.type === type);
}

export function getExperiencesByCategory(category: string): Experience[] {
  if (category === 'all') return experiences;
  return experiences.filter((e) => e.category === category || (category === 'nepal' && e.category === 'nepal'));
}
