const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function fixMissingInstituteId() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const ActivityType = mongoose.connection.collection('activitytypes');
    
    // Find all activity types without instituteId and isPrimitive=false
    const missing = await ActivityType.find({
      isPrimitive: false,
      instituteId: { $exists: false }
    }).toArray();

    console.log(`Found ${missing.length} ActivityType(s) missing instituteId:`);
    missing.forEach(doc => {
      console.log(`  - ${doc.name} (${doc._id})`);
    });

    if (missing.length === 0) {
      console.log('✓ All non-primitive activity types have instituteId');
      await mongoose.disconnect();
      return;
    }

    // Use the known instituteId
    const instituteId = new mongoose.Types.ObjectId('692d347f2ebd5f7bbc91f7c5');
    console.log(`\nUpdating to instituteId: ${instituteId}`);

    const result = await ActivityType.updateMany(
      {
        isPrimitive: false,
        instituteId: { $exists: false }
      },
      {
        $set: { instituteId: instituteId }
      }
    );

    console.log(`✓ Updated ${result.modifiedCount} document(s)`);

    // Verify
    const all = await ActivityType.find({}).toArray();
    console.log('\nAll ActivityTypes:');
    all.forEach(doc => {
      console.log(`  - ${doc.name}: isPrimitive=${doc.isPrimitive}, instituteId=${doc.instituteId || '(missing)'}`);
    });

    await mongoose.disconnect();
    console.log('\n✓ Fix completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMissingInstituteId();
