// Usage: node normalize-activitytype-keys.js
// It will lowercase all ActivityType.key values and create a unique index on key.
// It will abort if there are case-insensitive duplicates (e.g., 'foo' and 'FOO').

const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'smart-student-hub';
const COLLECTION = 'activitytypes';

async function run() {
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to', MONGO_URI);
  const db = client.db(DB_NAME);
  const col = db.collection(COLLECTION);

  const docs = await col.find({}).toArray();
  console.log('Found', docs.length, 'activitytype documents');

  const groups = {};
  for (const d of docs) {
    const key = (d.key || '').toString();
    const lower = key.toLowerCase();
    groups[lower] = groups[lower] || [];
    groups[lower].push(d);
  }

  const conflicts = Object.entries(groups).filter(([k, arr]) => arr.length > 1);
  if (conflicts.length > 0) {
    console.error('Found case-insensitive duplicate keys. Resolve these before running the script:');
    for (const [k, arr] of conflicts) {
      console.error(`Key group: ${k}`);
      arr.forEach((d) => console.error('  _id:', d._id.toString(), 'key:', d.key));
    }
    await client.close();
    process.exit(1);
  }

  // No conflicts; proceed to lowercase keys where necessary
  let updated = 0;
  for (const d of docs) {
    const key = (d.key || '').toString();
    const lower = key.toLowerCase();
    if (key !== lower) {
      await col.updateOne({ _id: d._id }, { $set: { key: lower } });
      updated++;
      console.log('Lowercased', d._id.toString(), '->', lower);
    }
  }

  console.log('Lowercased', updated, 'documents');

  // Create unique index on key
  try {
    await col.createIndex({ key: 1 }, { unique: true });
    console.log('Created unique index on key');
  } catch (err) {
    console.error('Failed to create unique index:', err.message);
  }

  await client.close();
  console.log('Done');
}

run().catch((err) => {
  console.error(err);
  process.exit(2);
});
