// Destination guides and the starter stories, ported from design/trip-data.js.

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
};

export const W = (f: string, w = 1400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=${w}`;

export const DESTS: Destination[] = [
  {
    "id": "coxs-bazar",
    "type": "popular",
    "name": "Cox's Bazar",
    "bn": "কক্সবাজার",
    "district": "Cox's Bazar",
    "blurb": "The longest natural sea beach in the world, with 120 km of sand along the Bay of Bengal.",
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Cox's_Bazar_sea_beach.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/A_dusk_at_Cox's_Bazar_sea_beach.jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cox's_Bazar_sea_beach--In_between_day_and_night.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Sajek_Valley_Bangladesh.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sajek_Valley_01.jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Runmoy%2C_Sajek_Valley_04.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Sundarbans_river.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Boat%2C_trees_and_water_in_Sundarbans.jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/River_in_Sundarban.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Srimangal_Tea_garden.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tea_Garden_Srimongol_Sylhet_Bangladesh_2.JPG?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nymphaea_nouchali%2C_Madhabpur_Tea_Garden%2C_Srimangal.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Saint_Martin's_Island.JPG?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Blue_waters_of_Saint_Martin_Island_%2C_Bangladesh.jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Amazing_evening_view_of_Saint_Martin_Island%2C_Bangladesh.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Ratargul_0315.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ratargul_Swamp_Forest%2C_Sylhet..jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ratargul_Swamp_Forest%2C_Sylhet%2C_Bangladesh.jpg?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/St_Martin_Island_Chera_Dwip.JPG?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Blue_waters_of_Saint_Martin_Island_%2C_Bangladesh.jpg?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Saint_Martin's_Island.JPG?width=900"
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Nilgiri%2C_Bandarban%2C_Bangladesh_20.jpg?width=1400",
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
    "img": "https://commons.wikimedia.org/wiki/Special:FilePath/Nymphaea_nouchali%2C_Madhabpur_Tea_Garden%2C_Srimangal.jpg?width=1400",
    "gallery": [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tea_Garden_Srimongol_Sylhet_Bangladesh_2.JPG?width=900",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Srimangal_Tea_garden.jpg?width=900"
    ],
    "article": {
      "about": "Madhabpur Lake is a quiet, winding lake hidden among the tea hills of Kamalganj, in Moulvibazar district. It was created by building a dam across the valleys of the Madhabpur Tea Estate, and today it is surrounded by green tilla hills covered in tea bushes.\n\nThe lake is best known for its water lilies. From late spring through the monsoon, the surface is covered with blue and purple lilies, which open in the early morning and close by midday. You can walk along the tilla paths above the water for beautiful views, and watch tea workers passing on their way to the gardens.\n\nVisit between June and September for the lilies, and arrive early in the morning while they are open. Nearby, you can also visit Madhabkunda waterfall, Lawachara National Park and Srimangal's tea gardens.",
      "food": "There are very few food options at the lake apart from tea stalls. Eat before you go in Srimangal or Kamalganj, and bring water and a few snacks.\n\nIn Srimangal, try the seven-layer tea at Nilkantha Tea Cabin, and local Bangladeshi food in the town's restaurants.",
      "stay": "There is nowhere to stay at the lake. Most visitors stay in Srimangal, less than an hour away, where there are eco-resorts, cottages and hotels of every kind.\n\nA few small guesthouses are also open near Kamalganj if you want to be closer. Book ahead for weekends and holidays.",
      "route": "Take the train from Kamalapur or a bus from Sayedabad to Srimangal, which takes around four to five hours. From Srimangal, hire a CNG to Madhabpur Lake, about an hour's drive through tea country.\n\nTo see the lilies at their best, leave Srimangal early in the morning. Agree the fare with your driver before you set off, and ask them to wait for your return journey."
    }
  }
];

export const SEED: Story[] = [
  {
    "id": "s1",
    "place": "sajek",
    "title": "How we did Sajek for ৳4,800",
    "text": "We were four friends with one long weekend and a budget that did not stretch far. Everyone online had a different number for Sajek, so we wrote down every taka we spent.\n\nWe took the night bus from Kalabagan and reached Khagrachhari just after sunrise. A jeep driver found us before we found him. We split the chander gari with another group of six, which cut our share to almost nothing. The army escort left Baghaihat mid-morning, and the road after that is the part nobody prepares you for: steep, green and loud with the engine.\n\nRuilui Para was busier than the photos suggest, but the cottage we had booked over the phone was clean and had a balcony facing the valley. That evening the clouds came up from below like smoke. We sat there until the generator went off.\n\nThe next morning we climbed Konglak before five. It is short but steep, and worth every step. We were back in Dhaka by midnight, tired, and each of us had spent ৳4,800. No surprises. If you go, carry cash, book the cottage ahead, and don't skip the sunrise.\n\nA few things we learned the hard way. The road from Khagrachhari is rough, and sitting on the roof of the jeep is fun for the first hour and painful after that. Bring something soft to sit on, and a scarf for the dust. The escort times change, so ask your driver the evening before and don't trust what you read online.\n\nRuilui gets loud at night on weekends, with groups playing music until late. If you want quiet, walk towards Konglak after dinner. The road is dark, but the sky is full of stars and you can hear the whole valley below you. We stood there for almost an hour without saying much.\n\nOn the way back we stopped at the Alutila cave and the Hazachora waterfall. Both are worth the short detour if you have time before your bus. We ate a late lunch in Khagrachhari town, where the food was half the price of Sajek and just as good.\n\nI've been on a lot of trips with these friends, but this is the one we still talk about. Not because anything dramatic happened, but because everything worked, and the view on that first evening was better than any photo I had seen.",
    "name": "Nusrat Jahan",
    "from": "Dhaka",
    "date": "2026-09-14"
  },
  {
    "id": "s2",
    "place": "ratargul",
    "title": "Rowing through a forest that floods",
    "text": "I had seen Ratargul in a hundred photos and assumed it would feel staged. It did not.\n\nWe took the train to Sylhet and a reserved CNG to Motorghat the next morning. By eight the ghat was already filling up, so we took the first boat we could. Our boatman, a quiet man called Rashid, had been rowing these channels since he was a boy. He told us to sit still and stop leaning out for pictures, which we ignored for about five minutes, until the boat tipped enough to scare us.\n\nInside, the forest goes quiet. The water is dark and still, the trees stand half underwater, and the light comes through in thin lines. We saw a kingfisher, a snake coiled on a branch at eye level, and nothing else for almost an hour.\n\nBy noon there were boats queued along every channel. Go early, go in the monsoon, and let the boatman choose the route. It was the best weekend we have had in years.\n\nRashid told us that when he was young, very few outsiders came here. Now, during the monsoon, hundreds of boats go in every day. He worries about the plastic and the noise, and he asked us, politely, to keep our voices down. After that we barely spoke, and the forest felt completely different.\n\nAbout halfway through, the channel opened into a small clearing where the water was perfectly still and reflected the trees above. Rashid stopped rowing and let the boat drift. A troop of monkeys moved through the branches over our heads, completely ignoring us. It was the most peaceful ten minutes of the whole year for me.\n\nAfterwards we climbed the watchtower near the edge of the forest. From the top you can see how big Ratargul really is, a dark green patch spreading across the flooded land. On the way back to Sylhet we stopped for tea at a roadside stall and watched the rain move across the fields.\n\nIf you go, please take your rubbish back with you, pay your boatman fairly and listen to what he says. The forest has survived this long because local people have looked after it.",
    "name": "Arif Hossain",
    "from": "Chattogram",
    "date": "2026-08-02"
  },
  {
    "id": "s3",
    "place": "sundarbans",
    "title": "Three days on a launch in the Sundarbans",
    "text": "I went to the Sundarbans expecting to see a tiger. I did not see a tiger. I came back wanting to go again anyway.\n\nWe joined a three-day launch from Khulna with a licensed operator, who sorted the forest permit and the armed guard before we arrived. The launch was simple: bunk cabins, a deck, and a cook who made more food than twenty people could eat.\n\nThe first evening we anchored in a narrow channel near Katka. Without the engine, the forest was loud: birds, insects, and something heavy moving in the mud. At dawn we walked the trail to the beach with the guard in front. There were fresh pugmarks in the mud, maybe a day old. Nobody talked for a while after that.\n\nAt Kochikhali we saw spotted deer in a clearing, a crocodile on the bank, and monkeys fighting over a biscuit packet someone had dropped. The best part was simply sitting on the deck as the tide turned. Bring repellent, a torch and patience. The forest does not perform for you.\n\nOn the second day we went ashore at Kochikhali with our guard and walked through tall grass towards the coast. Every few minutes he stopped and listened. We saw fresh deer tracks, and then, in a patch of soft mud, a single large pugmark. He said it was probably from the night before. Nobody complained about walking slowly after that.\n\nThe beach at Kochikhali is wide and empty, with the forest right behind it. We sat there for a while watching crabs run across the sand, and it was hard to believe we were only a day away from Khulna.\n\nThe launch crew were the heroes of the trip. The cook made fresh fish curry, dal and vegetables at every meal, and there was always tea on the deck. At night the crew told stories about tigers, honey collectors and storms, some of which I'm sure were exaggerated, but all of which we believed at the time.\n\nOn the last morning, the fog lay low over the river and the forest looked grey and endless. I understood then why people keep coming back, even if they never see a tiger. The Sundarbans is not a zoo. It is a living place, and you are only a guest.",
    "name": "Tahmid Rahman",
    "from": "Sylhet",
    "date": "2026-03-01"
  },
  {
    "id": "s4",
    "place": "srimangal",
    "title": "Tea country in the rain, with my mother",
    "text": "My mother had always wanted to see the tea gardens, so this July I took her. We chose the train, and I am glad we did. The last hour into Srimangal runs past tea hills so close you can almost touch them.\n\nIt rained almost the whole time. That turned out to be the point. The gardens were a green I have no word for, and the pickers moved along the rows under big plastic sheets, laughing at us for stopping to take photos.\n\nWe stayed in a small cottage a few kilometres out of town. On the second day we hired a guide at Lawachara and walked the shorter trail. We heard hoolock gibbons long before we saw them, calling across the canopy. My mother, who has bad knees, walked the whole way.\n\nIn the evening we had the seven-layer tea at Nilkantha. It tastes mostly of sugar, but you have to try it once. Two days, very little money, and my mother still talks about it.\n\nOn our first morning, we walked into the Finlay garden and met a group of women picking leaves. One of them showed my mother how to pick just the top two leaves and a bud. My mother tried, laughed, and then insisted on taking a photo with all of them. It is now her phone wallpaper.\n\nLater that day we visited the Tea Research Institute and learned how the leaves are withered, rolled, dried and sorted. It was more interesting than I expected, and the tea we tasted there was the best of the trip.\n\nAt Lawachara we walked slowly, stopping often. Our guide pointed out a flying squirrel's nest, a line of ants carrying leaves, and a capped langur sitting quietly high in a tree. The forest was dripping from the rain and the air smelled of wet earth. My mother said it reminded her of her village when she was a girl.\n\nIt was the simplest trip I have ever taken, and one of the best. If you are thinking of taking your parents somewhere, Srimangal is perfect: easy to reach, gentle, and green everywhere you look.",
    "name": "Farhana Akter",
    "from": "Rajshahi",
    "date": "2026-07-28"
  },
  {
    "id": "s5",
    "place": "saint-martins",
    "title": "Saint Martin's, ten years later",
    "text": "I first went to Saint Martin's ten years ago, when you could barely walk the beach for people. This January was different, and better.\n\nWith the visitor cap, you need to plan. We booked the ship from Cox's Bazar weeks ahead and chose the return date at the same time. The crossing takes most of the morning, and the moment the water turns from brown to clear blue is still magic.\n\nThe island was quiet. Fewer stalls, fewer speakers, fewer plastic bottles. We rented bicycles and rode around the whole island in an afternoon. At night the sky was so full of stars that my friend, who grew up in Dhaka, just lay on the sand and laughed.\n\nWe did not walk on the coral, and we saw local volunteers asking others not to either. It felt like people finally cared. Bring cash, respect the rules, and go gently.\n\nThe best part was the mornings. We woke before sunrise and walked along the west beach while the fishermen were bringing their boats in. They sorted the catch right on the sand, and children ran between the baskets. A man offered us tea from a flask and wouldn't take any money for it.\n\nIn the afternoons we explored the rock pools at low tide. The water was so clear that we could see small fish, sea urchins and bits of coral just below the surface. We were careful not to step on anything living, and we saw that most other visitors were careful too.\n\nWe walked to Chera Dwip on our second day and came back by boat. Standing at the southern tip of the country, with nothing but water in front of you, is something I think every Bangladeshi should experience at least once.\n\nThe island has changed a lot in ten years, and mostly for the better. There are still problems with rubbish and too many new buildings, but there is also more awareness. If we want our children to see it the way we did, we all have to travel more gently.",
    "name": "Imran Kabir",
    "from": "Khulna",
    "date": "2026-01-20"
  },
  {
    "id": "s6",
    "place": "madhabpur",
    "title": "Seven in the morning at Madhabpur Lake",
    "text": "Everyone said to go early, and I thought they meant nine. They meant seven.\n\nWe left Srimangal in a CNG while it was still grey outside. The road into the tea estate is bumpy and empty at that hour. When we reached the lake there was a light mist on the water, and the lilies were fully open, purple and blue from one end to the other. There were three other people there.\n\nWe walked up the tilla path on the far side and sat on the grass above the water for almost an hour. Tea workers passed behind us on their way to the gardens. Nobody was selling anything.\n\nBy eleven the lilies had started to close and the first buses had arrived. We left happy. It cost me ৳1,500, including the night in Srimangal. It is one of the most beautiful places I have seen in Bangladesh, and hardly anyone I know has heard of it.\n\nOn the way back, the driver stopped at a small tea stall at the edge of the estate. The owner told us that most visitors come at noon, look at a lake full of closed flowers, and leave disappointed. He laughed and said the lilies keep their own schedule.\n\nWe went on to Madhabkunda waterfall in the afternoon, about an hour away. It was full from the rain and much louder than I expected. Then we drove back through the tea gardens as the light turned gold and the workers were heading home.\n\nThe whole trip was very simple. No bookings, no guide, just a train, a CNG and an early alarm. Sometimes that is all you need.\n\nIf you go, please don't pick the lilies or step into the water. The lake is inside a working tea estate, so be respectful, stay on the paths and keep your voice low. It's a quiet place and it deserves to stay that way.",
    "name": "Mim Chowdhury",
    "from": "Sylhet",
    "date": "2026-08-24"
  }
];

export const byId = (id: string | null | undefined) => DESTS.find(d => d.id === id);
