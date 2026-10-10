import type { Destination } from '../types/travel';

export const DESTINATIONS: Destination[] = [
  {
    id: 'jaam-gate',
    name: 'Jaam Gate',
    distanceFromIndore: '50 km',
    day: 'Day 1',
    tagline: 'Where History Meets the Hills',
    shortDesc:
      'Jaam Gate, also known as Jaam Darwaza, is a historic gateway connecting the Malwa and Nimar regions of Madhya Pradesh. Surrounded by rolling hills, misty valleys, and winding mountain roads, it offers a beautiful mix of heritage and nature.',
    thumbnail: '/assets/jaam-gate/jaam_gate_at_its_best.jpg',
    mapX: 42,
    mapY: 58,
    highlights: [
      'Historic Gateway',
      'Mountain Views',
      'Foggy Mornings',
      'Scenic Photography'
    ],
    gallery: [
      {
        id: 'jaam-gate-best',
        url: '/assets/jaam-gate/jaam_gate_at_its_best.jpg',
        title: 'Jaam Gate at its Best (View Through Arch)',
        category: 'History & Heritage',
        caption: 'A gateway to the past, where the stone walls tell stories of Malwa’s heritage.',
        type: 'photo',
        author: 'Gypsyink',
        authorUrl: 'https://commons.wikimedia.org/wiki/File:Jaam_gate_at_its_best.jpg',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jaam_gate_at_its_best.jpg'
      },
      {
        id: 'jam-gate-indore-road',
        url: '/assets/jaam-gate/jam_gate_indore.jpg',
        title: 'Jam Gate Road & Surroundings',
        category: 'Location & Landscape',
        caption: 'Where winding roads meet endless hills and misty valleys.',
        type: 'photo',
        author: 'Anushka10patel',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Anushka10patel',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jam_gate_indore.jpg'
      },
      {
        id: 'jamgate-mhow',
        url: '/assets/jaam-gate/jamgate.jpg',
        title: 'Jam Gate Mhow (Stone Gateway Elevation)',
        category: 'Architecture & Photography',
        caption: 'Every angle reveals another detail worth capturing.',
        type: 'photo',
        author: 'Aamin',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Theaaminkhan',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jamgate.jpg'
      },
      {
        id: 'jaam-gate-ai-view',
        url: '/assets/jaam-gate/jaam_gate_ai_illustrative.jpg',
        title: 'Stone Gateway & Valley Ghat Concept',
        category: 'Mist & Nature',
        caption: 'A quiet escape into the fresh air and calm of the hills.',
        type: 'ai',
        author: 'AI-Generated Illustration',
        license: 'Illustrative Concept'
      }
    ]
  },
  {
    id: 'maheshwar',
    name: 'Maheshwar',
    distanceFromIndore: '100 km',
    day: 'Day 1',
    shortDesc:
      'Set along the banks of the Narmada River, Maheshwar blends the heritage of the Holkar dynasty with beautiful ghats, historic architecture, and a celebrated handloom tradition. Explore its riverside landmarks, discover its cultural legacy, and experience the quiet charm of this historic town.',
    thumbnail: '/assets/maheshwar/maheshwar_fort_narmada_river.jpg',
    mapX: 38,
    mapY: 82,
    highlights: [
      'Ahilyabai Holkar’s Legacy',
      'Narmada Ghats',
      'Historic Fort',
      'Maheshwari Sarees'
    ],
    gallery: [
      {
        id: 'maheshwar-fort-river',
        url: '/assets/maheshwar/maheshwar_fort_narmada_river.jpg',
        title: 'Maheshwar Fort from the Narmada River',
        category: 'HISTORY & HERITAGE',
        caption: 'A timeless fort rising above the sacred Narmada.',
        description: 'Discover Maheshwar’s historic fort complex overlooking the Narmada, associated with the legacy of Rajmata Ahilyabai Holkar.',
        type: 'photo',
        author: 'Eskay001',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Eskay001',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Maheshwar_fort_as_seen_from_the_Narmada_river.jpg'
      },
      {
        id: 'maheshwar-ghat',
        url: '/assets/maheshwar/maheshwar_ghat.jpg',
        title: 'Maheshwar Ghat',
        category: 'RIVERFRONT & GHATS',
        caption: 'Stone steps descend into the calm waters of the Narmada.',
        description: 'Maheshwar’s riverside ghats are known for their historic stone architecture, peaceful atmosphere, and views across the river.',
        type: 'photo',
        author: 'Vinitmaha',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Vinitmaha',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Maheshwar_Ghat.jpg'
      },
      {
        id: 'maheshwar-narmada-ghat',
        url: '/assets/maheshwar/maheshwar_narmada_ghat.jpg',
        title: 'Maheshwar Narmada Ghat',
        category: 'RIVERSIDE LIFE',
        caption: 'A riverside landmark where architecture meets everyday life.',
        description: 'Explore the ghats as a place of worship, reflection, and local activity along the Narmada.',
        type: 'photo',
        author: 'सुबोध पाठक',
        authorUrl: 'https://commons.wikimedia.org/wiki/user:%E0%A4%B8%E0%A5%81%E0%A4%AC%E0%A5%8B%E0%A4%A7_%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%95',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Maheshwar_Narmada_Ghat.jpg'
      },
      {
        id: 'maheshwar-bathing-ghat',
        url: '/assets/maheshwar/beautiful_bathing_ghat_narmada_river.jpg',
        title: 'Beautiful Bathing Ghat at Narmada River',
        category: 'GHAT ARCHITECTURE',
        caption: 'Ancient stone steps meet the flowing river.',
        description: 'The layered steps and stone structures reveal the traditional design of Maheshwar’s riverfront.',
        type: 'photo',
        author: 'Eskay001',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Eskay001',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Beautiful_bathing_ghat_at_Narmada_river,_Maheshwar_Fort.jpg'
      },
      {
        id: 'maheshwar-ghat-skyline',
        url: '/assets/maheshwar/maheshwar_ghat_alternate_view.jpg',
        title: 'Maheshwar Ghat — alternate riverfront view',
        category: 'ARCHITECTURE & VIEWS',
        caption: 'A wider view of Maheshwar’s historic river-facing skyline.',
        description: 'Take in the relationship between the historic buildings, the ghats, and the broad Narmada riverfront.',
        type: 'photo',
        author: 'Shrikant Bansod',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Shrikant_Bansod',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Maheshwar_Ghat,_Narmada_Ghat_Maheshwar,_Madhya_Pradesh.jpg'
      },
      {
        id: 'maheshwar-handloom-weaver',
        url: '/assets/maheshwar/maheshwari_handloom_weaver.jpg',
        title: 'Maheshwari Handloom Weaver',
        category: 'MAHESHWARI HANDLOOM',
        caption: 'Tradition woven carefully into every thread.',
        description: 'Maheshwar is celebrated for its distinctive handwoven sarees and textile tradition. This image introduces the craftsmanship behind the local weaving heritage.',
        type: 'photo',
        author: 'Eskay001',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Eskay001',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Handloom_weaver_in_Maheshwar_fort,_Khargone_district,_Madhya_Pradesh.jpg'
      }
    ]
  },
  {
    id: 'sahastradhara',
    name: 'Sahastradhara',
    distanceFromIndore: '110 km',
    modalDistanceLabel: '6 km from Maheshwar',
    day: 'Day 2',
    shortDesc:
      'Captivating river landscape where the Narmada breaks into hundreds of rushing streams and sparkling cascades over dark volcanic basalt rock channels.',
    thumbnail: '/assets/sahastradhara/sahastradhara_aerial_landscape.jpg',
    mapX: 48,
    mapY: 84,
    highlights: [
      'A Thousand Streams',
      'Volcanic Basalt Rocks',
      'Ek Mukhi Datta Temple',
      'Narmada Cascades'
    ],
    gallery: [
      {
        id: 'sahastradhara-aerial-landscape',
        url: '/assets/sahastradhara/sahastradhara_aerial_landscape.jpg',
        title: 'Aerial & Landscape View of Narmada',
        category: 'AERIAL & LANDSCAPE VIEW',
        caption: 'A thousand streams, one breathtaking landscape.',
        description: 'See the wider landscape around the Narmada, where flowing water and rocky terrain create a distinctive natural scene.',
        type: 'photo',
        author: 'Ashish Gupta',
        authorUrl: 'https://www.flickr.com/people/36853543@N00',
        license: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:18_expanse_of_Narmada_in_Maheshwar_(16673851680).jpg'
      },
      {
        id: 'sahastradhara-river-streams',
        url: '/assets/sahastradhara/sahastradhara_river_streams.jpg',
        title: 'Narmada River Streams',
        category: 'NARMADA RIVER STREAMS',
        caption: 'Where the Narmada finds a thousand paths.',
        description: 'Discover the flowing channels of the Narmada that give Sahastradhara its name, meaning ‘a thousand streams’.',
        type: 'photo',
        author: 'Dusanesurbhi',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Dusanesurbhi',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:View_of_Narmada_from_fort_of_maheshwar.jpg'
      },
      {
        id: 'sahastradhara-rocks-water',
        url: '/assets/sahastradhara/sahastradhara_rocks_flowing_water.jpg',
        title: 'Rocks & Flowing Water Formations',
        category: 'ROCKS & FLOWING WATER',
        caption: 'Nature carved into stone and water.',
        description: 'Get closer to the rocky riverbed and the movement of water across the natural formations.',
        type: 'photo',
        author: 'Ashish Gupta',
        authorUrl: 'https://www.flickr.com/people/36853543@N00',
        license: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:19_expanse_of_Narmada_in_Maheshwar2_(16860201711).jpg'
      },
      {
        id: 'sahastradhara-temple-heritage',
        url: '/assets/sahastradhara/sahastradhara_temple_heritage.jpg',
        title: 'Ek Mukhi Datta Temple, Sahastradhara',
        category: 'TEMPLE & HERITAGE',
        caption: 'A quiet spiritual corner near the river.',
        description: 'Explore the temple surroundings near Sahastradhara and experience the connection between local heritage and the Narmada landscape.',
        type: 'photo',
        author: 'Nilrocks',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Nilrocks',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ek_Mukhi_Datta_Temple,Sahastradhara,Jalkoti,Maheshwar.jpg'
      },
      {
        id: 'sahastradhara-riverbank-scenic',
        url: '/assets/sahastradhara/sahastradhara_riverbank_scenic.jpg',
        title: 'Riverbank Scenic View of Narmada',
        category: 'RIVERBANK SCENIC VIEW',
        caption: 'Pause beside the timeless Narmada.',
        description: 'Take in the river from the bank, with scenic views that invite visitors to slow down and enjoy the surroundings.',
        type: 'photo',
        author: 'Sumit Surai',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Sumitsurai',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:River_Narmada_from_Maheshwar_Fort.jpg'
      },
      {
        id: 'sahastradhara-golden-hour',
        url: '/assets/sahastradhara/sahastradhara_golden_hour.jpg',
        title: 'Golden Hour View over Narmada',
        category: 'GOLDEN HOUR VIEW',
        caption: 'Golden light, flowing water, peaceful moments.',
        description: 'Experience the landscape in warm evening light, when the river and surrounding terrain create a beautiful photography setting.',
        type: 'photo',
        author: 'Prachee Majumder',
        authorUrl: 'https://commons.wikimedia.org/wiki/User:Prachee_Majumder',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lit_by_twilight_,_Narmada.jpg'
      }
    ]
  }
];

export const START_POINT = {
  id: 'indore',
  name: 'Indore',
  distanceFromIndore: 'Start',
  day: 'Day 1',
  shortDesc: 'Starting departure point of the college road trip on the Malwa plateau.',
  mapX: 45,
  mapY: 22
};
