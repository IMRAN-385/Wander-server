import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Destination from '../models/Destination';
import Review from '../models/Review';

const fallbackDestinations = [
  {
    _id: 'd1',
    title: 'Bali Tropical Paradise',
    slug: 'bali-tropical-paradise',
    shortDescription: 'Discover the enchanting island of Bali with its pristine beaches, sacred temples, and vibrant cultural heritage.',
    fullDescription: 'Bali is a living canvas of natural beauty and spiritual depth.',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'],
    category: 'Beach',
    location: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    price: 129,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 342,
    bestSeason: 'April to October',
    activities: ['Surfing', 'Temple Tours', 'Snorkeling', 'Yoga Retreats', 'Rice Terrace Trekking'],
    highlights: ['Sacred temples at sunset', 'World-class surf breaks', 'Traditional Balinese cuisine', 'Luxury jungle resorts'],
    amenities: ['Beach Access', 'Spa', 'Infinity Pool', 'Restaurant', 'Yoga Studio'],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    featured: true,
    trending: true,
    authorId: 'admin1',
    authorName: 'Sarah Johnson',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-07-10T12:00:00Z',
  },
  {
    _id: 'd2',
    title: 'Swiss Alps Mountain Escape',
    slug: 'swiss-alps-mountain-escape',
    shortDescription: 'Breathtaking snow-capped peaks, alpine lakes, and charming villages nestled in the heart of Switzerland.',
    fullDescription: 'The Swiss Alps offer a dramatic playground of jagged summits, glacial valleys, and postcard villages.',
    images: ['https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a8?w=800'],
    category: 'Mountains',
    location: 'Zermatt',
    country: 'Switzerland',
    continent: 'Europe',
    price: 289,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 518,
    bestSeason: 'December to March',
    activities: ['Skiing', 'Snowboarding', 'Cable Car Tours', 'Alpine Hiking', 'Chocolate Tasting'],
    highlights: ['Matterhorn views', 'World-class ski slopes', 'Glacier Paradise viewpoint', 'Cozy mountain chalets'],
    amenities: ['Ski-in/Ski-out', 'Fireplace Lounge', 'Sauna', 'Restaurant', 'Equipment Rental'],
    coordinates: { lat: 46.0207, lng: 7.7491 },
    featured: true,
    trending: true,
    authorId: 'admin1',
    authorName: 'Sarah Johnson',
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-07-08T10:00:00Z',
  },
  {
    _id: 'd3',
    title: 'Tokyo Neon Nights',
    slug: 'tokyo-neon-nights',
    shortDescription: 'A dazzling fusion of ancient tradition and futuristic energy in one of the world\'s most electric cities.',
    fullDescription: 'Tokyo pulses with contradiction — centuries-old shrines sit blocks away from towering neon skyscrapers.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800'],
    category: 'City',
    location: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    price: 175,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 621,
    bestSeason: 'March to May',
    activities: ['Street Food Tours', 'Shrine Visits', 'Shopping in Shibuya', 'Robot Restaurant Show', 'Sumo Watching'],
    highlights: ['Shibuya Crossing at night', 'Senso-ji Temple', 'Michelin-starred ramen', 'Cherry blossom parks'],
    amenities: ['City Center Location', 'Rooftop Bar', 'Concierge', 'Restaurant', 'Free Wi-Fi'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    featured: true,
    trending: false,
    authorId: 'admin2',
    authorName: 'Kenji Watanabe',
    createdAt: '2026-02-02T08:00:00Z',
    updatedAt: '2026-07-05T12:00:00Z',
  },
  {
    _id: 'd4',
    title: 'Amazon Rainforest Expedition',
    slug: 'amazon-rainforest-expedition',
    shortDescription: 'Venture into the lungs of the planet for an immersive journey through untouched jungle wilderness.',
    fullDescription: 'The Amazon is a world unto itself — a dense green cathedral where jaguars prowl the undergrowth.',
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'],
    category: 'Nature',
    location: 'Manaus',
    country: 'Brazil',
    continent: 'Americas',
    price: 210,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 187,
    bestSeason: 'June to November',
    activities: ['Jungle Trekking', 'Canoeing', 'Wildlife Spotting', 'Night Safari', 'Indigenous Village Visit'],
    highlights: ['Pink river dolphins', 'Canopy walkways', 'Piranha fishing', 'Sunset over the river'],
    amenities: ['Eco Lodge', 'Guided Tours', 'Mosquito Netting', 'Restaurant', 'Solar Power'],
    coordinates: { lat: -3.1190, lng: -60.0217 },
    featured: false,
    trending: true,
    authorId: 'admin3',
    authorName: 'Mariana Costa',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-06-28T12:00:00Z',
  },
  {
    _id: 'd5',
    title: 'Sahara Desert Adventure',
    slug: 'sahara-desert-adventure',
    shortDescription: 'Camel treks and star-filled nights across the golden dunes of the world\'s largest hot desert.',
    fullDescription: 'The Sahara stretches to the horizon in endless waves of ochre sand.',
    images: ['https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'],
    category: 'Adventure',
    location: 'Merzouga',
    country: 'Morocco',
    continent: 'Africa',
    price: 155,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 264,
    bestSeason: 'October to April',
    activities: ['Camel Trekking', 'Sandboarding', 'Stargazing', 'Berber Camp Stay', 'Sunrise Dune Hike'],
    highlights: ['Erg Chebbi dunes', 'Traditional Berber music', 'Desert stargazing', 'Sunset camel caravan'],
    amenities: ['Desert Camp', 'Traditional Tents', 'Campfire Dining', 'Guided Trek', 'Blanket & Bedding'],
    coordinates: { lat: 31.0801, lng: -4.0133 },
    featured: false,
    trending: true,
    authorId: 'admin3',
    authorName: 'Mariana Costa',
    createdAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-06-30T12:00:00Z',
  },
  {
    _id: 'd6',
    title: 'Santorini Coastal Dream',
    slug: 'santorini-coastal-dream',
    shortDescription: 'Whitewashed cliffside villages overlooking the deep blue Aegean, famous for legendary sunsets.',
    fullDescription: 'Santorini rises dramatically from the caldera left by an ancient volcanic eruption.',
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'],
    category: 'Coastal',
    location: 'Oia',
    country: 'Greece',
    continent: 'Europe',
    price: 245,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 473,
    bestSeason: 'May to September',
    activities: ['Sunset Watching', 'Wine Tasting', 'Catamaran Cruise', 'Volcano Tour', 'Beach Hopping'],
    highlights: ['Oia sunset views', 'Volcanic black-sand beaches', 'Cliffside infinity pools', 'Local Assyrtiko wine'],
    amenities: ['Caldera View', 'Infinity Pool', 'Private Terrace', 'Restaurant', 'Airport Transfer'],
    coordinates: { lat: 36.4618, lng: 25.3753 },
    featured: true,
    trending: true,
    authorId: 'admin1',
    authorName: 'Sarah Johnson',
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-07-12T12:00:00Z',
  },
  {
    _id: 'd7',
    title: 'Icelandic Ring Road Journey',
    slug: 'icelandic-ring-road-journey',
    shortDescription: 'Waterfalls, glaciers, and the dancing Northern Lights along Iceland\'s dramatic volcanic coastline.',
    fullDescription: 'Iceland is a land forged by fire and ice — thundering waterfalls, black-sand beaches, and glacier lagoons.',
    images: ['https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800', 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800'],
    category: 'Nature',
    location: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    price: 265,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 356,
    bestSeason: 'September to March',
    activities: ['Northern Lights Hunting', 'Glacier Hiking', 'Ice Cave Exploring', 'Hot Spring Bathing', 'Waterfall Tours'],
    highlights: ['Aurora Borealis', 'Jökulsárlón glacier lagoon', 'Blue Lagoon geothermal spa', 'Black-sand beaches'],
    amenities: ['Geothermal Pool Access', 'Heated Cabins', 'Guided Tours', 'Restaurant', 'Northern Lights Wake-up Call'],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    featured: false,
    trending: true,
    authorId: 'admin2',
    authorName: 'Kenji Watanabe',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-07-01T12:00:00Z',
  },
  {
    _id: 'd8',
    title: 'Machu Picchu Highlands',
    slug: 'machu-picchu-highlands',
    shortDescription: 'Trek through misty Andean peaks to the legendary lost city of the Inca.',
    fullDescription: 'Perched on a ridge between two towering peaks, Machu Picchu emerges from the clouds like a secret the mountains kept for centuries.',
    images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800'],
    category: 'Adventure',
    location: 'Cusco',
    country: 'Peru',
    continent: 'Americas',
    price: 198,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 402,
    bestSeason: 'May to September',
    activities: ['Inca Trail Trekking', 'Ruins Exploration', 'Llama Spotting', 'Sacred Valley Tour', 'Sunrise Viewing'],
    highlights: ['Sunrise over the citadel', 'Inca Trail four-day trek', 'Sacred Valley terraces', 'Andean condor sightings'],
    amenities: ['Mountain Lodge', 'Guided Trekking', 'Porter Service', 'Restaurant', 'Oxygen Kits'],
    coordinates: { lat: -13.1631, lng: -72.5450 },
    featured: true,
    trending: false,
    authorId: 'admin3',
    authorName: 'Mariana Costa',
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-06-25T12:00:00Z',
  },
  {
    _id: 'd9',
    title: 'New York City Lights',
    slug: 'new-york-city-lights',
    shortDescription: 'The city that never sleeps — iconic skylines, world-class dining, and non-stop energy.',
    fullDescription: 'New York City is a mosaic of neighborhoods, each with its own rhythm.',
    images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800'],
    category: 'City',
    location: 'New York',
    country: 'United States',
    continent: 'Americas',
    price: 220,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 589,
    bestSeason: 'April to June',
    activities: ['Broadway Shows', 'Museum Tours', 'Central Park Cycling', 'Rooftop Bar Hopping', 'Food Tours'],
    highlights: ['Times Square at night', 'Statue of Liberty ferry', 'Central Park in autumn', 'Empire State Building views'],
    amenities: ['City Center Location', 'Gym', 'Concierge', 'Restaurant', 'Rooftop Terrace'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    featured: false,
    trending: false,
    authorId: 'admin2',
    authorName: 'Kenji Watanabe',
    createdAt: '2026-03-12T08:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z',
  },
  {
    _id: 'd10',
    title: 'Maldives Overwater Escape',
    slug: 'maldives-overwater-escape',
    shortDescription: 'Crystal-clear lagoons and private overwater bungalows in the heart of the Indian Ocean.',
    fullDescription: 'The Maldives is a scattering of coral atolls where turquoise water meets powder-white sand.',
    images: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800'],
    category: 'Beach',
    location: 'Malé Atoll',
    country: 'Maldives',
    continent: 'Asia',
    price: 420,
    currency: 'USD',
    rating: 5.0,
    reviewCount: 298,
    bestSeason: 'November to April',
    activities: ['Snorkeling', 'Scuba Diving', 'Sunset Cruise', 'Private Island Picnic', 'Spa Treatments'],
    highlights: ['Overwater bungalows', 'Coral reef diving', 'Bioluminescent plankton beach', 'Private sandbank dinners'],
    amenities: ['Overwater Villa', 'Private Pool', 'Spa', 'All-Inclusive Dining', 'Seaplane Transfer'],
    coordinates: { lat: 3.2028, lng: 73.2207 },
    featured: true,
    trending: true,
    authorId: 'admin1',
    authorName: 'Sarah Johnson',
    createdAt: '2026-03-18T08:00:00Z',
    updatedAt: '2026-07-14T12:00:00Z',
  },
  {
    _id: 'd11',
    title: 'Serengeti Safari Trail',
    slug: 'serengeti-safari-trail',
    shortDescription: 'Witness the Great Migration and the raw beauty of the African savanna up close.',
    fullDescription: 'The Serengeti unfolds as an endless golden plain where lions rest in acacia shade.',
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800'],
    category: 'Nature',
    location: 'Serengeti',
    country: 'Tanzania',
    continent: 'Africa',
    price: 310,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 231,
    bestSeason: 'June to September',
    activities: ['Game Drives', 'Hot Air Balloon Safari', 'Great Migration Viewing', 'Maasai Village Visit', 'Bird Watching'],
    highlights: ['The Great Migration', 'Big Five sightings', 'Sunrise balloon safari', 'Maasai cultural exchange'],
    amenities: ['Luxury Tented Camp', 'Guided Game Drives', 'Full Board Dining', 'Campfire Lounge', 'Airstrip Transfer'],
    coordinates: { lat: -2.3333, lng: 34.8333 },
    featured: false,
    trending: true,
    authorId: 'admin3',
    authorName: 'Mariana Costa',
    createdAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-07-02T12:00:00Z',
  },
  {
    _id: 'd12',
    title: 'Great Ocean Road Coastal Drive',
    slug: 'great-ocean-road-coastal-drive',
    shortDescription: 'A scenic coastal drive past dramatic limestone stacks and hidden surf beaches in Victoria.',
    fullDescription: 'The Great Ocean Road hugs the wild southern coast of Australia, winding past the towering Twelve Apostles.',
    images: ['https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800', 'https://images.unsplash.com/photo-1494233892892-84542a694e2b?w=800'],
    category: 'Coastal',
    location: 'Victoria',
    country: 'Australia',
    continent: 'Oceania',
    price: 190,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 214,
    bestSeason: 'December to February',
    activities: ['Scenic Driving', 'Surfing', 'Koala Spotting', 'Rainforest Walks', 'Twelve Apostles Tour'],
    highlights: ['Twelve Apostles at sunset', 'Great Otway rainforest', 'Bells Beach surf spot', 'Wildlife spotting'],
    amenities: ['Coastal Lodge', 'Car Rental Included', 'Restaurant', 'Guided Tours', 'Ocean View Rooms'],
    coordinates: { lat: -38.6600, lng: 143.1044 },
    featured: false,
    trending: false,
    authorId: 'admin2',
    authorName: 'Kenji Watanabe',
    createdAt: '2026-03-28T08:00:00Z',
    updatedAt: '2026-06-15T12:00:00Z',
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/destinations
export const getDestinations = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      continent,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      page = '1',
      limit = '12',
    } = req.query;

    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search as string, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (continent) {
      query.continent = continent;
    }
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [dbDestinations, total] = await Promise.all([
      Destination.find(query).sort(sort as string).skip(skip).limit(limitNum),
      Destination.countDocuments(query),
    ]);

    let destinations: unknown[] = dbDestinations as unknown[];
    let totalCount = total;

    if (totalCount === 0) {
      const filtered = fallbackDestinations.filter((item) => {
        const matchesSearch = !search || item.title.toLowerCase().includes((search as string).toLowerCase());
        const matchesCategory = !category || item.category === category;
        const matchesContinent = !continent || item.continent === continent;
        const matchesMinPrice = !minPrice || item.price >= Number(minPrice);
        const matchesMaxPrice = !maxPrice || item.price <= Number(maxPrice);
        return matchesSearch && matchesCategory && matchesContinent && matchesMinPrice && matchesMaxPrice;
      });

      destinations = filtered.slice(skip, skip + limitNum) as Array<Record<string, unknown>>;
      totalCount = filtered.length;
    }

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: {
        items: destinations,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasMore: pageNum < totalPages,
        destinations,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('getDestinations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch destinations' });
  }
};

// GET /api/destinations/:slug
// Public detail pages link by slug (SEO-friendly URLs). We still accept a raw
// ObjectId here too, so internal/admin links that pass the real _id keep working.
export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;

    const destination = mongoose.Types.ObjectId.isValid(idValue)
      ? await Destination.findById(idValue)
      : await Destination.findOne({ slug: idValue });

    if (!destination) {
      const fallbackDestination = fallbackDestinations.find((item) => item.slug === idValue || item._id === idValue);
      if (!fallbackDestination) {
        return res.status(404).json({ success: false, message: 'Destination not found' });
      }

      const reviews: Array<Record<string, unknown>> = [];
      const related = fallbackDestinations.filter((item) => item._id !== fallbackDestination._id && item.category === fallbackDestination.category).slice(0, 4);

      return res.status(200).json({
        success: true,
        data: { destination: fallbackDestination, reviews, related },
      });
    }

    const [reviews, related] = await Promise.all([
      Review.find({ destinationId: destination._id.toString() } as Record<string, unknown>).sort({ createdAt: -1 }),
      Destination.find({
        _id: { $ne: destination._id },
        category: destination.category,
      }).limit(4),
    ]);

    res.status(200).json({
      success: true,
      data: { destination, reviews, related },
    });
  } catch (error) {
    console.error('getDestinationById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch destination' });
  }
};

// POST /api/destinations (protected — requires authenticate middleware upstream)
export const createDestination = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Ensure a unique slug even if two destinations share a title
    let slug = slugify(title);
    const existing = await Destination.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const destination = await Destination.create({
      ...req.body,
      slug,
      // Never trust authorship fields from the client — always derive from the verified token
      authorId: req.user.userId,
      authorName: req.user.name,
    });

    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    console.error('createDestination error:', error);
    res.status(400).json({ success: false, message: 'Failed to create destination' });
  }
};

// DELETE /api/destinations/:id (protected — owner or admin only)
export const deleteDestination = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const isOwner = destination.authorId?.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this destination' });
    }

    await destination.deleteOne();
    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    console.error('deleteDestination error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete destination' });
  }
};