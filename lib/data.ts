// Destination guides, ported from design/trip-data.js.

import { photo } from './images';

export type Destination = {
  id: string;
  type: 'popular' | 'gem';
  name: string;
  bn: string;
  district: string;
  blurb: string;
  img: string;
  gallery: string[];
  article: { about: string; food: string; stay: string; route: string };
};

export type Story = {
  id: string;
  place: string;
  title: string;
  text: string;
  name: string;
  from: string;
  date: string; // YYYY-MM-DD
  image?: string; // URL of the traveller's photo, if they uploaded one
  authorId?: string; // account that wrote it; starter stories have none
};

export const DESTS: Destination[] = [
  {
    "id": "coxs-bazar",
    "type": "popular",
    "name": "Cox's Bazar",
    "bn": "কক্সবাজার",
    "district": "Cox's Bazar",
    "blurb": "The longest natural sea beach in the world, with 120 km of sand along the Bay of Bengal.",
    "img": photo('coxs-bazar-sea-beach', 1400),
    "gallery": [
      photo('a-dusk-at-coxs-bazar-sea-beach', 900),
      photo('coxs-bazar-sea-beach-in-between-day-and-night', 900)
    ],
    "article": {
      "about": "Cox's Bazar is home to the longest natural sandy sea beach in the world, an unbroken stretch of about 120 km along the Bay of Bengal. The town itself is busy and full of hotels, but the coastline changes as you move south: from the crowded central beaches at Laboni and Sugandha, to the quieter shores of Himchari, Inani and finally Teknaf.\n\nThe best way to see it is along Marine Drive, the coastal road that runs between the hills and the sea. Stop at Himchari for its small waterfall and hilltop view, at Inani for the coral boulders exposed at low tide, and at Shamlapur for a fishing village where boats come in at dawn. In town, visit the Buddhist temples at Ramu, the Burmese Market for handwoven goods, and Kolatoli beach for the sunset.\n\nThe best time to visit is from November to March, when the sea is calm and the sky is clear. The monsoon, from June to September, brings rough water and strong currents, and swimming can be dangerous. Always swim between the flags, where lifeguards are on duty.",
      "food": "Fresh seafood is the main reason to eat in Cox's Bazar. Restaurants around Sugandha and Kolatoli display the day's catch on ice in the evening: rupchanda (pomfret), loitta, coral fish, prawns and crab. You choose what you want and it is fried or grilled to order, usually with rice, dal and a sharp tomato or shutki bhorta.\n\nDon't leave without trying the dried fish. At the Nazirartek shutki mahal near the airport, thousands of fish are laid out on bamboo racks to dry in the sun, and you can buy packs to take home. For something sweet, the town's Rakhine shops sell pickles, rice cakes and tamarind sweets.",
      "stay": "Cox's Bazar has the widest range of places to stay in the country. Most hotels are packed along Kolatoli Road and the lanes near Sugandha and Laboni beach, from simple guesthouses to large resorts with pools. Staying close to one of these beaches means you can walk to the sea in the morning and to the restaurants at night.\n\nIf you want quiet, look further south along Marine Drive towards Inani, where a handful of smaller resorts sit directly on the beach. Hotels fill up quickly in December, during winter school holidays and around Eid, so book ahead at those times.",
      "route": "By road, air-conditioned and non-AC buses leave Dhaka from Arambagh, Sayedabad and Kalabagan every evening and arrive the next morning after about 10 to 12 hours. The direct train from Kamalapur to Cox's Bazar is now the most comfortable way to travel overland and takes around 9 hours. There are also several daily flights from Dhaka, which take about an hour.\n\nGetting around once you arrive is easy. Easy bikes and rickshaws run between the beaches in town. For Marine Drive, Himchari and Inani, hire a CNG or a jeep for half a day and agree the route and fare before you set off."
    }
  },
  {
    "id": "sajek",
    "type": "popular",
    "name": "Sajek Valley",
    "bn": "সাজেক ভ্যালি",
    "district": "Rangamati",
    "blurb": "A hilltop village in Rangamati where the clouds drift below you at dawn.",
    "img": photo('sajek-valley-bangladesh', 1400),
    "gallery": [
      photo('sajek-valley-01', 900),
      photo('runmoy-sajek-valley-04', 900)
    ],
    "article": {
      "about": "Sajek Valley sits on a ridge about 1,800 feet high in the far north of Rangamati district, close to the Mizoram border. It is best known for the sea of clouds that fills the valleys below at dawn and after rain. The main settlement, Ruilui Para, is home to Lushai, Pangkhua and Tripura communities, and the colourful cottages along its single road look out over layers of green hills.\n\nGet up early and walk to the helipad for the sunrise, then continue to Konglak Para, the highest village in the valley, which is a short but steep climb. On the way, stop at Hazachora waterfall and Dighinala. In the evening, the stretch of road near the Ruilui stone garden is the best place to watch the sun go down.\n\nSajek is beautiful all year, but it is at its best from late August to November, when the hills are green after the monsoon and the clouds are thickest. Winter is dry and clear with cool nights, so bring a light jacket.",
      "food": "The dish everyone comes for is bamboo chicken: chicken marinated with local spices, sealed inside a green bamboo tube and cooked slowly over a fire. Most restaurants in Ruilui need you to order it a few hours ahead. Small Tripura and Lushai kitchens also serve rice with hill vegetables, bamboo shoots, local chillies and pork or chicken curry.\n\nAlong the road you'll find fresh pineapple, papaya, bananas and jackfruit, depending on the season. Food choices are limited and prices are higher than in town, because everything has to be carried up the hill.",
      "stay": "Cottages and small resorts line both sides of the road in Ruilui Para and Konglak Para. Many are built of wood and bamboo, with balconies facing the valley. They are simple, and electricity often comes from a generator or solar panels for a few hours in the evening.\n\nBook ahead for Thursday, Friday and holiday nights, when rooms sell out. Ask for a valley-facing room; the view from your bed at sunrise is a big part of the experience.",
      "route": "Take a night bus from Dhaka (Kalabagan, Sayedabad or Fakirapool) to Khagrachhari, which takes around 7 to 8 hours. From Khagrachhari town, hire a chander gari, the open-top jeeps that carry up to 12 people, for the 70 km drive to Sajek. Motorbikes and CNGs are also available.\n\nAll vehicles travel in convoy with an army escort from Baghaihat, usually leaving mid-morning and early afternoon. Try to reach Khagrachhari early so you don't miss it. Keep your NID or passport with you for the checkpoints, and carry cash, because mobile banking and card payments are unreliable on the hill."
    }
  },
  {
    "id": "sundarbans",
    "type": "popular",
    "name": "Sundarbans",
    "bn": "সুন্দরবন",
    "district": "Khulna",
    "blurb": "The largest mangrove forest on earth, and home of the Royal Bengal tiger.",
    "img": photo('sundarbans-river', 1400),
    "gallery": [
      photo('boat-trees-and-water-in-sundarbans', 900),
      photo('river-in-sundarban', 900)
    ],
    "article": {
      "about": "The Sundarbans is the largest mangrove forest in the world, spread across the delta of the Padma, Meghna and Brahmaputra rivers. Around 60 percent of it lies in Bangladesh. It is a UNESCO World Heritage Site and the home of the Royal Bengal tiger, as well as spotted deer, estuarine crocodiles, wild boar, monkeys and hundreds of kinds of birds.\n\nMost visits are by boat. Launches follow the rivers and narrow tidal creeks to Katka, Kochikhali and Hiron Point, where there are watchtowers and short walking trails. Karamjal, near Mongla, is an easy half-day visit with a deer and crocodile breeding centre. The forest is quiet and dense, and much of the magic is in sitting on deck at dawn as the tide turns.\n\nThe best time to go is from November to February, when the weather is cool and dry and the rivers are calm. Tiger sightings are rare, but footprints on the mud banks are common. Remember that you are in a protected area: stay with your guide, keep your voice low, and don't leave any plastic behind.",
      "food": "On a launch tour, all meals are cooked on board. Expect rice, dal, vegetables, chicken and fresh river fish such as bhetki and prawns, with tea and snacks on deck. Tell the operator in advance if you have any dietary needs.\n\nBefore or after the trip, eat well in Khulna. The city is famous for chui jhal, mutton or beef cooked with chui, a peppery local vine, and for its fresh river prawns. Don't forget to try the sweets from Khulna's old shops too.",
      "stay": "Most visitors stay on the launch for two or three nights, sleeping in simple bunk cabins while the boat is anchored in the forest. It is the best way to see the Sundarbans, because you wake up already inside it.\n\nFor a shorter trip, there are eco-cottages and resorts in Mongla and on the edge of the forest near Karamjal and Dacope, from where you can take day trips by boat. Khulna has plenty of hotels if you arrive the night before your tour.",
      "route": "Buses from Dhaka reach Khulna in about five hours using the Padma Bridge, and the train from Kamalapur takes a similar time. Mongla is another hour further south. Most tours start from Khulna or Mongla.\n\nYou cannot enter the forest on your own. Entry requires a permit from the Forest Department and an armed forest guard. Licensed tour operators arrange both, as well as the launch, meals and guide, so it is easiest to book a full package with one of them."
    }
  },
  {
    "id": "srimangal",
    "type": "popular",
    "name": "Srimangal",
    "bn": "শ্রীমঙ্গল",
    "district": "Moulvibazar",
    "blurb": "The tea capital of Bangladesh, with rolling gardens and the Lawachara rainforest.",
    "img": photo('srimangal-tea-garden', 1400),
    "gallery": [
      photo('tea-garden-srimongol-sylhet-bangladesh-2', 900),
      photo('nymphaea-nouchali-madhabpur-tea-garden-srimangal', 900)
    ],
    "article": {
      "about": "Srimangal, in Moulvibazar district, is known as the tea capital of Bangladesh. Rolling tea gardens cover the low hills around the town, and pickers work between the rows in bright saris. The landscape is gentle and green all year, and it is one of the easiest nature trips from Dhaka.\n\nWalk or cycle through the gardens at Finlay, Madhabpur and Bharaura, and visit the Bangladesh Tea Research Institute to see how tea is grown and processed. Lawachara National Park, a short drive away, is a patch of tropical rainforest where you can hear hoolock gibbons calling from the treetops. Nearby you'll also find Baikka Beel, a wetland full of migratory birds in winter, and Khasi and Manipuri villages.\n\nSrimangal is at its greenest during the monsoon, from June to October, when the gardens are lush and the forest is full of life. Winter, from November to February, is cooler and better for birdwatching.",
      "food": "Everyone stops at Nilkantha Tea Cabin for the famous seven-layer tea, made by carefully pouring teas of different densities into the same glass. It is sweet, colourful and worth trying once. You can also buy fresh local tea to take home from the shops in town.\n\nSrimangal's restaurants serve good Bangladeshi food: several kinds of bhorta, fish curries, and fresh vegetables from the hills. In the Manipuri and Khasi villages, you may be able to try local dishes and see handloom weaving.",
      "stay": "There are eco-resorts and cottages inside or right beside the tea estates, surrounded by gardens and forest. They are ideal if you want to wake up to birdsong and walk straight into the hills.\n\nIn town there are plenty of simpler hotels, which are convenient if you're arriving late by train or travelling on a smaller budget. Book ahead on weekends and during the holidays.",
      "route": "The train from Kamalapur is the nicest way to reach Srimangal and takes about four and a half hours. The last part of the journey runs through tea country, with gardens right beside the tracks. Buses also leave from Sayedabad and take around four hours.\n\nIn Srimangal, rickshaws, CNGs and easy bikes can take you to the gardens, Lawachara, Nilkantha and the lakes. For a full day of sightseeing, hire a CNG with a driver who knows the area."
    }
  },
  {
    "id": "saint-martins",
    "type": "popular",
    "name": "Saint Martin's",
    "bn": "সেন্টমার্টিন",
    "district": "Cox's Bazar",
    "blurb": "Bangladesh's only coral island, with clear blue water and quiet nights.",
    "img": photo('saint-martins-island', 1400),
    "gallery": [
      photo('blue-waters-of-saint-martin-island-bangladesh', 900),
      photo('amazing-evening-view-of-saint-martin-island-bangladesh', 900)
    ],
    "article": {
      "about": "Saint Martin's Island, locally called Narikel Jinjira, is Bangladesh's only coral island. It lies about 9 km off the southern tip of the mainland, and is only a few kilometres long. The island is known for its clear blue water, coral rocks, coconut palms and quiet nights with a sky full of stars.\n\nYou can walk or cycle around the whole island in a few hours. The west beach is the best for sunsets, and at low tide you can explore rock pools full of small fish and sea life. From the south end, you can reach Chera Dwip, the southernmost point of Bangladesh.\n\nTo protect the fragile coral ecosystem, the government now limits the number of visitors and the season in which you can stay. Rules can change from year to year, so check the latest before you plan. The best time to go is from December to January, when the sea is calm.",
      "food": "Fish is caught and cooked the same day. Every evening, restaurants near the jetty and along the beach display the catch: coral fish, rupchanda, squid, lobster and crab. Pick what you want and have it fried or grilled with rice and vegetables.\n\nFresh coconut water is sold everywhere, and it's the best drink on a hot afternoon. Most food on the island is simple, so don't expect much variety.",
      "stay": "Cottages, small resorts and guesthouses are spread across the island, mostly near the jetty and along the west beach. They are simple and quiet, with limited electricity and water at times.\n\nBecause visitor numbers are limited, book your accommodation together with your ship ticket. Keep your stay short, respect the local community, and leave no plastic behind.",
      "route": "First travel to Cox's Bazar by bus, train or plane. Ships to Saint Martin's leave from Cox's Bazar or Teknaf during the tourist season, and the crossing takes several hours depending on the port.\n\nTickets can sell out, especially during the holidays, so book your outward and return journeys together. Check the current government rules on visitor numbers and overnight stays before you travel."
    }
  },
  {
    "id": "ratargul",
    "type": "gem",
    "name": "Ratargul",
    "bn": "রাতারগুল",
    "district": "Sylhet",
    "blurb": "A freshwater swamp forest you explore by small boat during the monsoon.",
    "img": photo('ratargul-0315', 1400),
    "gallery": [
      photo('ratargul-swamp-forest-sylhet', 900),
      photo('ratargul-swamp-forest-sylhet-bangladesh', 900)
    ],
    "article": {
      "about": "Ratargul Swamp Forest, about 26 km from Sylhet city, is the only freshwater swamp forest in Bangladesh. During the monsoon, the Goain River floods the forest and the trees stand half underwater, with their roots and trunks rising from dark, still water. It is often called the Amazon of Bangladesh.\n\nThe only way to see it is by small wooden boat. A local boatman rows you slowly through the narrow channels between the trees, and the forest becomes quiet and cool. Look out for kingfishers, herons, monkeys and snakes resting on low branches. A watchtower near the edge of the forest gives a wide view over the canopy.\n\nVisit between July and October, when the water is high. In winter the water drops and the forest floor becomes dry. Go early in the morning to avoid the crowds, and sit still in the boat; they tip easily.",
      "food": "There are only a few tea stalls near the ghat at Motorghat, so plan your meals in Sylhet. The city is known for shatkora beef, cooked with a local citrus fruit, and for the famous seven-colour tea and fresh sweets.\n\nCarry water and some snacks for the boat ride. Don't feed the monkeys and don't throw any rubbish into the water.",
      "stay": "There is nowhere to stay at the forest itself. Stay in Sylhet city, where you'll find hotels and guesthouses of every type, especially around Zindabazar, Ambarkhana and Airport Road.\n\nRatargul makes an easy day trip from Sylhet. You can combine it with other sights like Jaflong, Bisnakandi or Lalakhal to make the most of your visit.",
      "route": "Take the train from Kamalapur to Sylhet, which takes around six to seven hours, or a bus from Sayedabad or Mohakhali. Flights to Sylhet take under an hour.\n\nFrom Sylhet city, hire a CNG to Motorghat, about an hour's drive. At the ghat, hire a small wooden boat with a local boatman. A round trip through the forest takes between one and two hours."
    }
  },
  {
    "id": "chera-dwip",
    "type": "gem",
    "name": "Chera Dwip",
    "bn": "ছেঁড়া দ্বীপ",
    "district": "Saint Martin's",
    "blurb": "The country's southernmost tip. Coral rocks and open sea, reachable at low tide.",
    "img": photo('st-martin-island-chera-dwip', 1400),
    "gallery": [
      photo('blue-waters-of-saint-martin-island-bangladesh', 900),
      photo('saint-martins-island', 900)
    ],
    "article": {
      "about": "Chera Dwip is the southernmost point of Bangladesh, a small group of islets just south of Saint Martin's Island. The name means \"cut-off island\", because at high tide it is separated from Saint Martin's by the sea. There are no permanent homes here, only coral rocks, sand, screwpine bushes and open sea on every side.\n\nIt is a place to walk, explore and sit quietly. At low tide you can climb over the coral rocks and look into rock pools full of small sea life. Standing at the very tip, with nothing but ocean ahead of you, is a special feeling.\n\nVisit with Saint Martin's, from December to January, when the sea is calm. Check the tide times before you go and leave before the water starts to rise. Be careful on the sharp, slippery rocks and never break or take any coral.",
      "food": "There are no shops or restaurants on Chera Dwip. Have a good meal on Saint Martin's before you go, and carry plenty of water and some food. Occasionally a local seller offers coconuts near the landing spot.\n\nTake all your rubbish back with you. The island is fragile and there is no one to clean it.",
      "stay": "No one stays overnight on Chera Dwip. You'll stay on Saint Martin's Island and visit as a half-day trip, ideally in the morning or early afternoon at low tide.\n\nBook your Saint Martin's accommodation together with your ship ticket, because visitor numbers are limited.",
      "route": "Reach Saint Martin's Island first, by travelling to Cox's Bazar and then taking a ship. From the south end of Saint Martin's, you can walk to Chera Dwip at low tide over sand and rocks in about two hours.\n\nSmall boats and speedboats also make the trip from the Saint Martin's jetty in about 20 minutes. Many people walk there and take a boat back. Always check the tide times before setting off."
    }
  },
  {
    "id": "nilgiri",
    "type": "gem",
    "name": "Nilgiri",
    "bn": "নীলগিরি",
    "district": "Bandarban",
    "blurb": "One of the highest points in Bandarban, where clouds touch the hilltop.",
    "img": photo('nilgiri-bandarban-bangladesh-20', 1400),
    "gallery": [],
    "article": {
      "about": "Nilgiri is one of the highest peaks in Bangladesh that you can reach by road, around 2,200 feet above sea level in Bandarban district. The name means \"blue mountain\", and on clear days you can see layers of blue-green hills stretching to the horizon, with the Sangu River winding far below.\n\nIt is famous for the clouds. During the monsoon and autumn, clouds rise from the valleys and drift across the hilltop and through the resort. The drive itself is part of the experience: the road climbs and twists through the hills, past Marma and Bawm villages, with viewpoints along the way.\n\nOn the way, stop at Shoilo Propat waterfall, Chimbuk hill and the Buddha Dhatu Jadi golden temple near Bandarban town. The best time to visit is from August to November, when the clouds are thickest.",
      "food": "The cafeteria at Nilgiri Resort serves simple rice meals with chicken, fish and vegetables. There are also a few food stalls near the entrance selling tea and snacks.\n\nIn Bandarban town, try the local Bawm and Marma food: bamboo shoot curry, hill chicken, sticky rice and fresh fruit from the hills. Carry water and snacks for the drive.",
      "stay": "Nilgiri Resort, run by the army, has cottages right on the hilltop with views over the hills. Rooms are limited and in high demand, so book well in advance.\n\nIf you can't get a room, stay in Bandarban town, which has plenty of hotels and resorts, and visit Nilgiri as a day trip. Start early to make the most of the views.",
      "route": "Buses from Dhaka to Bandarban leave from Sayedabad, Fakirapool and Kalabagan and take around eight hours. You can also travel via Chattogram, then take a local bus to Bandarban.\n\nFrom Bandarban town, hire a chander gari (open jeep) for the 47 km drive up to Nilgiri, which takes about two hours. There are army checkpoints along the way, so carry your NID or passport. Try to come back down before dark, because the road is steep and winding."
    }
  },
  {
    "id": "madhabpur",
    "type": "gem",
    "name": "Madhabpur Lake",
    "bn": "মাধবপুর লেক",
    "district": "Moulvibazar",
    "blurb": "A quiet lake hidden among tea hills, covered in blue water lilies in summer.",
    "img": photo('nymphaea-nouchali-madhabpur-tea-garden-srimangal', 1400),
    "gallery": [
      photo('tea-garden-srimongol-sylhet-bangladesh-2', 900),
      photo('srimangal-tea-garden', 900)
    ],
    "article": {
      "about": "Madhabpur Lake is a quiet, winding lake hidden among the tea hills of Kamalganj, in Moulvibazar district. It was created by building a dam across the valleys of the Madhabpur Tea Estate, and today it is surrounded by green tilla hills covered in tea bushes.\n\nThe lake is best known for its water lilies. From late spring through the monsoon, the surface is covered with blue and purple lilies, which open in the early morning and close by midday. You can walk along the tilla paths above the water for beautiful views, and watch tea workers passing on their way to the gardens.\n\nVisit between June and September for the lilies, and arrive early in the morning while they are open. Nearby, you can also visit Madhabkunda waterfall, Lawachara National Park and Srimangal's tea gardens.",
      "food": "There are very few food options at the lake apart from tea stalls. Eat before you go in Srimangal or Kamalganj, and bring water and a few snacks.\n\nIn Srimangal, try the seven-layer tea at Nilkantha Tea Cabin, and local Bangladeshi food in the town's restaurants.",
      "stay": "There is nowhere to stay at the lake. Most visitors stay in Srimangal, less than an hour away, where there are eco-resorts, cottages and hotels of every kind.\n\nA few small guesthouses are also open near Kamalganj if you want to be closer. Book ahead for weekends and holidays.",
      "route": "Take the train from Kamalapur or a bus from Sayedabad to Srimangal, which takes around four to five hours. From Srimangal, hire a CNG to Madhabpur Lake, about an hour's drive through tea country.\n\nTo see the lilies at their best, leave Srimangal early in the morning. Agree the fare with your driver before you set off, and ask them to wait for your return journey."
    }
  }
];

export const byId = (id: string | null | undefined) => DESTS.find(d => d.id === id);
