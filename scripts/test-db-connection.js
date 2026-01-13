const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  console.log('--- MongoDB Connection Test ---');

  // 1. Try to read .env.local
  const envPath = path.join(__dirname, '..', '.env.local');
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (fs.existsSync(envPath)) {
      console.log('Found .env.local file.');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/MONGODB_URI=(.*)/);
      if (match && match[1]) {
        mongoUri = match[1].trim();
        // Remove quotes if present
        if ((mongoUri.startsWith('"') && mongoUri.endsWith('"')) || (mongoUri.startsWith("'") && mongoUri.endsWith("'"))) {
          mongoUri = mongoUri.slice(1, -1);
        }
        console.log('Loaded MONGODB_URI from .env.local');
      } else {
        console.error('ERROR: MONGODB_URI not found in .env.local');
        return;
      }
    } else {
      console.error('ERROR: .env.local file not found.');
      return;
    }
  } else {
    console.log('Using MONGODB_URI from process.env');
  }

  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is undefined.');
    return;
  }

  // Mask the password for display
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
  console.log(`Attempting to connect to: ${maskedUri}`);

  try {
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('SUCCESS: Connected to MongoDB!');
    
    // List collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(c => console.log(` - ${c.name}`));

    // 2. Test Write Operation
    console.log('--- Testing Write Operation ---');
    const TestSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', TestSchema);
    
    console.log('Creating test document...');
    const doc = await TestModel.create({ name: 'Connection Test' });
    console.log('Document created:', doc._id);
    
    console.log('Deleting test document...');
    await TestModel.deleteOne({ _id: doc._id });
    console.log('Document deleted.');

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (error) {
    console.error('CONNECTION FAILED:');
    console.error(error.message);
    if (error.message.includes('bad auth')) {
        console.error('Hint: Check your username and password in the connection string.');
    } else if (error.message.includes('ECONNREFUSED')) {
        console.error('Hint: Check if the database server is running.');
    } else if (error.name === 'MongoServerSelectionError') {
        console.error('Hint: Check if your IP is whitelisted in MongoDB Atlas.');
    }
  }
}

testConnection();
