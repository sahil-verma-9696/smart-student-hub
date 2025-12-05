require('dotenv').config({ path: '.env.development' });
const { MongoClient } = require('mongodb');

async function dropIndex() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sshDB';
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('sshDB');
    const collection = db.collection('activitytypes');
    
    // List all indexes
    console.log('Fetching current indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Drop the problematic indexes
    const indexesToDrop = ['key_1', 'instituteId.official_email_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped ${indexName} index`);
      } catch (err) {
        console.log(`⚠️  Could not drop ${indexName} index:`, err.message);
      }
    }
    
    // Show indexes after drop
    const indexesAfter = await collection.indexes();
    console.log('\nIndexes after drop:', JSON.stringify(indexesAfter, null, 2));
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

dropIndex();
