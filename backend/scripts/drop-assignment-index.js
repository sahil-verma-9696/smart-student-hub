require('dotenv').config({ path: '.env.development' });
const { MongoClient } = require('mongodb');

async function dropIndex() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sshDB';
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('sshDB');
    const collection = db.collection('activitytypeassignments');
    
    // List all indexes
    console.log('Fetching current indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Drop the problematic unique index on activityTypeId
    try {
      console.log('\nDropping activityTypeId_1 index...');
      await collection.dropIndex('activityTypeId_1');
      console.log('Successfully dropped activityTypeId_1 index');
    } catch (err) {
      console.log('Could not drop activityTypeId_1:', err.message);
    }
    
    // Show final indexes
    console.log('\nFinal indexes:');
    const finalIndexes = await collection.indexes();
    console.log(JSON.stringify(finalIndexes, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

dropIndex();
