const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function fixAllAdminUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const User = mongoose.connection.collection('users');
    const Admin = mongoose.connection.collection('admins');
    const Institute = mongoose.connection.collection('institutes');

    // Get all admin users
    const adminUsers = await User.find({ role: 'admin' }).toArray();
    console.log(`Found ${adminUsers.length} admin users\n`);

    // Get all admin profiles
    const adminProfiles = await Admin.find({}).toArray();
    console.log(`Found ${adminProfiles.length} admin profiles\n`);

    // Get all institutes
    const institutes = await Institute.find({}).toArray();
    console.log(`Found ${institutes.length} institutes\n`);

    console.log('='.repeat(60));

    // For each admin user without adminId, create or link admin profile
    for (let i = 0; i < adminUsers.length; i++) {
      const user = adminUsers[i];
      console.log(`\nAdmin User ${i + 1}: ${user.email}`);
      console.log(`  Current adminId: ${user.adminId || '(none)'}`);

      if (user.adminId) {
        // Check if linked admin has instituteId
        const linkedAdmin = await Admin.findOne({ _id: user.adminId });
        if (linkedAdmin?.instituteId) {
          console.log(`  ✓ Already linked to admin with instituteId: ${linkedAdmin.instituteId}`);
          continue;
        } else {
          console.log(`  ⚠️ Linked admin has no instituteId, will fix...`);
        }
      }

      // Find or create admin profile with instituteId
      let adminProfile = adminProfiles[i % adminProfiles.length];
      let instituteId = institutes[i % institutes.length]._id;

      // If admin profile doesn't have instituteId, add it
      if (!adminProfile.instituteId) {
        console.log(`  → Adding instituteId ${instituteId} to admin profile ${adminProfile._id}`);
        await Admin.updateOne(
          { _id: adminProfile._id },
          { $set: { instituteId: instituteId } }
        );
      } else {
        instituteId = adminProfile.instituteId;
      }

      // Link user to admin profile
      console.log(`  → Linking user to admin ${adminProfile._id} (institute: ${instituteId})`);
      await User.updateOne(
        { _id: user._id },
        { $set: { adminId: adminProfile._id } }
      );

      console.log(`  ✓ Fixed`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All admin users fixed!\n');

    // Verify
    console.log('Verification:');
    const updatedUsers = await User.find({ role: 'admin' }).toArray();
    for (const user of updatedUsers) {
      const admin = await Admin.findOne({ _id: user.adminId });
      console.log(`  ${user.email}:`);
      console.log(`    adminId: ${user.adminId}`);
      console.log(`    admin.instituteId: ${admin?.instituteId || '(ERROR: MISSING)'}`);
    }

    await mongoose.disconnect();
    console.log('\n✓ Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAllAdminUsers();
