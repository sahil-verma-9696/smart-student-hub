const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function testQuery() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const ActivityType = mongoose.connection.collection('activitytypes');
    
    // Simulate the query with empty instituteId (what happens before re-login)
    console.log('Test 1: Query with EMPTY instituteId (before re-login):');
    try {
      const emptyIdQuery = {
        $or: [
          { isPrimitive: true },
          { instituteId: new mongoose.Types.ObjectId('') } // This will fail
        ]
      };
      const result1 = await ActivityType.find(emptyIdQuery).toArray();
      console.log('  Result count:', result1.length);
    } catch (error) {
      console.log('  ❌ ERROR:', error.message);
    }

    // Simulate the query with valid instituteId (after re-login)
    console.log('\nTest 2: Query with VALID instituteId (after re-login):');
    const validIdQuery = {
      $or: [
        { isPrimitive: true },
        { instituteId: new mongoose.Types.ObjectId('692d347f2ebd5f7bbc91f7c5') }
      ]
    };
    const result2 = await ActivityType.find(validIdQuery).toArray();
    console.log('  Result count:', result2.length);
    result2.forEach(doc => {
      console.log('    -', doc.name, '| isPrimitive:', doc.isPrimitive, '| instituteId:', doc.instituteId);
    });

    // Show all activity types with their instituteId
    console.log('\nAll ActivityTypes in database:');
    const all = await ActivityType.find({}).toArray();
    all.forEach(doc => {
      console.log('  -', doc.name);
      console.log('    isPrimitive:', doc.isPrimitive);
      console.log('    instituteId:', doc.instituteId || '(not present)');
      console.log('    status:', doc.status);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testQuery();
