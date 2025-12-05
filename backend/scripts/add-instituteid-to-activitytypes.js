const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function addInstituteIdToActivityTypes() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const ActivityType = mongoose.connection.collection('activitytypes');
    const Admin = mongoose.connection.collection('admins');
    
    // Find all activity types without instituteId
    const missingInstituteId = await ActivityType.find({
      isPrimitive: false,
      instituteId: { $exists: false }
    }).toArray();

    console.log(`Found ${missingInstituteId.length} ActivityType(s) missing instituteId\n`);

    if (missingInstituteId.length === 0) {
      console.log('All non-primitive activity types already have instituteId. Nothing to do.');
      await mongoose.disconnect();
      return;
    }

    // Get the first admin's institute ID (or ask user to specify)
    const admin = await Admin.findOne({ instituteId: { $exists: true } });
    
    if (!admin || !admin.instituteId) {
      console.log('\nERROR: Could not find an admin with instituteId.');
      console.log('Please provide the instituteId manually.\n');
      console.log('Documents needing update:');
      missingInstituteId.forEach(doc => {
        console.log(`  - ${doc.name} (${doc._id})`);
      });
      await mongoose.disconnect();
      return;
    }

    console.log(`Using instituteId from admin: ${admin.instituteId}`);
    console.log(`Admin name: ${admin.name}\n`);

    // Ask for confirmation (in real scenario, you'd use readline)
    console.log('The following ActivityTypes will be updated:');
    missingInstituteId.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.name} (${doc._id})`);
    });
    console.log(`\nThey will be assigned instituteId: ${admin.instituteId}`);
    console.log('\nProceeding with update...\n');

    // Update all documents
    const result = await ActivityType.updateMany(
      {
        isPrimitive: false,
        instituteId: { $exists: false }
      },
      {
        $set: { instituteId: admin.instituteId }
      }
    );

    console.log(`✓ Updated ${result.modifiedCount} ActivityType document(s)`);

    // Verify the update
    const updated = await ActivityType.find({
      _id: { $in: missingInstituteId.map(d => d._id) }
    }).toArray();

    console.log('\nVerification:');
    updated.forEach(doc => {
      console.log(`  - ${doc.name}: instituteId = ${doc.instituteId}`);
    });

    await mongoose.disconnect();
    console.log('\n✓ Migration completed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addInstituteIdToActivityTypes();
