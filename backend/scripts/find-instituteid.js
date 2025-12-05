const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function findInstituteIds() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Check admins
    const Admin = mongoose.connection.collection('admins');
    const admins = await Admin.find({}).toArray();
    console.log(`Found ${admins.length} admin(s):`);
    admins.forEach(admin => {
      console.log(`  - ${admin.name} (${admin._id})`);
      console.log(`    instituteId: ${admin.instituteId || '(not present)'}`);
    });

    // Check institutes
    console.log('\n---\n');
    const Institute = mongoose.connection.collection('institutes');
    const institutes = await Institute.find({}).toArray();
    console.log(`Found ${institutes.length} institute(s):`);
    institutes.forEach(inst => {
      console.log(`  - ${inst.name} (${inst._id})`);
    });

    // Check users
    console.log('\n---\n');
    const User = mongoose.connection.collection('users');
    const users = await User.find({ role: 'admin' }).limit(5).toArray();
    console.log(`Sample admin users:`);
    users.forEach(user => {
      console.log(`  - ${user.email}`);
      console.log(`    instituteId: ${user.instituteId || '(not present)'}`);
      console.log(`    adminId: ${user.adminId || '(not present)'}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findInstituteIds();
