// Test MongoDB Atlas Connection
// Run this with: node test-mongodb-connection.js

const mongoose = require('mongoose');

// Replace this with your actual connection string
const MONGO_URI = 'mongodb+srv://khushidadhaniya8_db_user:Heny_20051108@cluster0.7uzkhpd.mongodb.net/taskify?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your username and password');
    console.log('2. Make sure your IP is whitelisted (0.0.0.0/0)');
    console.log('3. Verify the cluster is running');
    console.log('4. Check if the database name is correct');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
