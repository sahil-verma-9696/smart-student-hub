const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function fixAdminUser() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Find the user
    const User = mongoose.connection.collection('users');
    const user = await User.findOne({ email: 'admin1@gmail.com' });
    
    console.log('Current User Document:');
    console.log('  _id:', user._id);
    console.log('  email:', user.email);
    console.log('  role:', user.role);
    console.log('  adminId:', user.adminId || '(not present)');
    
    // Find admin profile that might belong to this user
    const Admin = mongoose.connection.collection('admins');
    const admins = await Admin.find({}).toArray();
    
    console.log('\n---\nAll Admin Profiles:');
    admins.forEach((admin, i) => {
      console.log(`\n  Admin ${i + 1}:`);
      console.log('    _id:', admin._id);
      console.log('    userId:', admin.userId || '(not present)');
      console.log('    name:', admin.name);
      console.log('    instituteId:', admin.instituteId || '(not present)');
    });

    // Find admin with instituteId
    const adminWithInstitute = await Admin.findOne({ instituteId: { $exists: true } });
    
    if (!adminWithInstitute) {
      console.log('\n\n❌ No admin profile has instituteId set!');
      await mongoose.disconnect();
      return;
    }

    console.log('\n---\nFound admin with instituteId:');
    console.log('  _id:', adminWithInstitute._id);
    console.log('  instituteId:', adminWithInstitute.instituteId);
    
    // Update the user to link to this admin profile
    console.log('\n---\nUpdating user to link with this admin profile...');
    
    const result = await User.updateOne(
      { email: 'admin1@gmail.com' },
      { $set: { adminId: adminWithInstitute._id } }
    );
    
    console.log(`✓ Updated ${result.modifiedCount} user document(s)`);
    
    // Verify
    const updatedUser = await User.findOne({ email: 'admin1@gmail.com' });
    console.log('\nUpdated User:');
    console.log('  email:', updatedUser.email);
    console.log('  adminId:', updatedUser.adminId);
    console.log('  (should link to admin with instituteId:', adminWithInstitute.instituteId + ')');

    await mongoose.disconnect();
    console.log('\n✓ Migration completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAdminUser();
