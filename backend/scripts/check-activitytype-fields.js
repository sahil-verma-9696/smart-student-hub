const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function checkActivityTypes() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const ActivityType = mongoose.connection.collection('activitytypes');
    const docs = await ActivityType.find({}).toArray();
    
    console.log(`\nTotal ActivityTypes: ${docs.length}\n`);
    console.log('='.repeat(60));
    
    docs.forEach((doc, i) => {
      console.log(`\nDocument ${i + 1}:`);
      console.log('  _id:', doc._id);
      console.log('  name:', doc.name);
      console.log('  isPrimitive:', doc.isPrimitive);
      console.log('  instituteId:', doc.instituteId || '(not present)');
      console.log('  status:', doc.status);
      console.log('  createdAt:', doc.createdAt);
      console.log('  All fields:', Object.keys(doc).join(', '));
    });

    await mongoose.disconnect();
    console.log('\n\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkActivityTypes();
