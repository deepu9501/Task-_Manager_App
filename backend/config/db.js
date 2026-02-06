const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!');
        console.error(`Error: ${error.message}`);
        console.error('\n💡 Possible solutions:');
        console.error('   1. Check if your IP is whitelisted in MongoDB Atlas');
        console.error('   2. Verify your MongoDB URI in .env file');
        console.error('   3. Check your internet connection');
        process.exit(1);
    }
};

module.exports = connectDB;
