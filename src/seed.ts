import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Destination from './models/Destination';
import User from './models/User';
import Review from './models/Review';
import Blog from './models/Blog';
import Booking from './models/Booking';

dotenv.config();

const destinations = [
  { title: 'Bali Tropical Paradise', slug: 'bali-tropical-paradise', shortDescription: 'Discover the enchanting island of Bali...', fullDescription: 'Bali is a living canvas...', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'], category: 'Beach', location: 'Bali', country: 'Indonesia', continent: 'Asia', price: 129, rating: 4.8, reviewCount: 342, bestSeason: 'April to October', activities: ['Surfing', 'Temple Tours', 'Yoga Retreats'], highlights: ['Sacred temples', 'World-class surf breaks', 'Luxury jungle resorts'], amenities: ['Beach Access', 'Spa', 'Infinity Pool'], coordinates: { lat: -8.4095, lng: 115.1889 }, featured: true, trending: true },
  // ... 11 more destinations
];

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderlust';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      Destination.deleteMany({}),
      User.deleteMany({}),
      Review.deleteMany({}),
      Blog.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // Create 3 users
    const admin = await User.create({
      name: 'Sarah Johnson', email: 'admin@wanderlust.com',
      password: 'Demo@123', role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    });
    const demoUser = await User.create({
      name: 'Kenji Tanaka', email: 'demo@wanderlust.com',
      password: 'Demo@123', role: 'user',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    });
    const emma = await User.create({
      name: 'Emma Watson', email: 'emma@wanderlust.com',
      password: 'Demo@123', role: 'user',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    });

    // Create 12 destinations
    const authorMap = [admin._id, demoUser._id, admin._id, admin._id, demoUser._id, admin._id, demoUser._id, admin._id, demoUser._id, admin._id, demoUser._id, admin._id];
    const authorNames = ['Sarah Johnson', 'Kenji Tanaka', 'Sarah Johnson', 'Sarah Johnson', 'Kenji Tanaka', 'Sarah Johnson', 'Kenji Tanaka', 'Sarah Johnson', 'Kenji Tanaka', 'Sarah Johnson', 'Kenji Tanaka', 'Sarah Johnson'];

    const destDocs = await Destination.insertMany(
      destinations.map((d, i) => ({
        ...d,
        authorId: authorMap[i],
        authorName: authorNames[i],
        createdAt: new Date(2026, i % 6, (i + 1) * 2),
        updatedAt: new Date(2026, 6, 12 - i),
      }))
    );

    // Create 8 reviews
    await Review.insertMany([
      { destinationId: destDocs[0]._id, userId: demoUser._id, userName: 'Kenji Tanaka', rating: 5, comment: 'Bali exceeded every expectation.' },
      { destinationId: destDocs[0]._id, userId: emma._id, userName: 'Emma Watson', rating: 4, comment: 'Beautiful island with rich culture.' },
      { destinationId: destDocs[1]._id, userId: demoUser._id, userName: 'Kenji Tanaka', rating: 5, comment: 'The Swiss Alps are breathtaking.' },
      { destinationId: destDocs[3]._id, userId: emma._id, userName: 'Emma Watson', rating: 5, comment: 'Santorini sunsets are magical.' },
      { destinationId: destDocs[6]._id, userId: demoUser._id, userName: 'Kenji Tanaka', rating: 5, comment: 'New Zealand is incredible.' },
      { destinationId: destDocs[8]._id, userId: admin._id, userName: 'Sarah Johnson', rating: 5, comment: 'Seeing the Northern Lights was spiritual.' },
      { destinationId: destDocs[9]._id, userId: demoUser._id, userName: 'Kenji Tanaka', rating: 5, comment: 'The Maldives is pure paradise.' },
      { destinationId: destDocs[4]._id, userId: emma._id, userName: 'Emma Watson', rating: 4, comment: 'Incredible biodiversity!' },
    ]);

    // Create 4 blogs
    await Blog.insertMany([
      { title: 'The Art of Slow Travel', slug: 'art-of-slow-travel', excerpt: 'Discover how slowing down leads to deeper travel experiences.', content: 'Detailed guide...', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', category: 'Travel Tips', authorId: admin._id, authorName: 'Sarah Johnson', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', tags: ['Slow Travel', 'Mindful Travel'], readTime: 6 },
      { title: 'Hidden Gems of Southeast Asia', slug: 'hidden-gems-southeast-asia', excerpt: 'Beyond Bali lie incredible destinations.', content: 'Guide...', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', category: 'Destinations', authorId: demoUser._id, authorName: 'Kenji Tanaka', authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80', tags: ['Southeast Asia', 'Hidden Gems'], readTime: 5 },
      { title: 'Northern Lights Photography Guide', slug: 'northern-lights-photography', excerpt: 'Master the art of aurora photography.', content: 'Guide...', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800', category: 'Photography', authorId: admin._id, authorName: 'Sarah Johnson', tags: ['Photography', 'Northern Lights'], readTime: 8 },
      { title: 'Tokyo Street Food Adventure', slug: 'tokyo-street-food-guide', excerpt: 'Navigate Tokyo\'s street food scene.', content: 'Guide...', image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800', category: 'Food & Drink', authorId: demoUser._id, authorName: 'Kenji Tanaka', tags: ['Food', 'Tokyo'], readTime: 7 },
    ]);

    // Create 2 bookings
    await Booking.insertMany([
      { userId: demoUser._id, destinationId: destDocs[0]._id, destinationName: 'Bali Tropical Paradise', destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300', checkIn: new Date('2026-08-15'), checkOut: new Date('2026-08-22'), guests: 2, totalPrice: 903, status: 'confirmed' },
      { userId: demoUser._id, destinationId: destDocs[6]._id, destinationName: 'New Zealand South Island', destinationImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=300', checkIn: new Date('2026-12-10'), checkOut: new Date('2026-12-20'), guests: 1, totalPrice: 1950, status: 'pending' },
    ]);

    // Update wishlists
    await User.findByIdAndUpdate(demoUser._id, { wishlist: [destDocs[0]._id, destDocs[6]._id, destDocs[10]._id] });
    await User.findByIdAndUpdate(emma._id, { wishlist: [destDocs[3]._id, destDocs[7]._id, destDocs[9]._id] });
    await User.findByIdAndUpdate(admin._id, { wishlist: [destDocs[0]._id, destDocs[3]._id, destDocs[8]._id] });

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${destDocs.length} destinations`);
    console.log('   - 3 users (admin@wanderlust.com / demo@wanderlust.com)');
    console.log('   - 8 reviews');
    console.log('   - 4 blog posts');
    console.log('   - 2 bookings');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();