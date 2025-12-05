const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://laptopsahil123:sahilmongo12@cluster0.asnbdyu.mongodb.net/sshDB?retryWrites=true&w=majority';

async function checkAdminInstituteId() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Find the user
    const User = mongoose.connection.collection('users');
    const user = await User.findOne({ email: 'admin1@gmail.com' });
    
    console.log('User Document:');
    console.log('  email:', user?.email);
    console.log('  role:', user?.role);
    console.log('  adminId:', user?.adminId || '(not present)');
    console.log('  instituteId:', user?.instituteId || '(not present)');
    
    if (user?.adminId) {
      console.log('\n---\n');
      const Admin = mongoose.connection.collection('admins');
      const admin = await Admin.findOne({ _id: new mongoose.Types.ObjectId(user.adminId) });
      
      console.log('Admin Document:');
      console.log('  _id:', admin?._id);
      console.log('  name:', admin?.name);
      console.log('  instituteId:', admin?.instituteId || '(not present)');
      
      if (admin?.instituteId) {
        console.log('\n---\n');
        const Institute = mongoose.connection.collection('institutes');
        const institute = await Institute.findOne({ _id: new mongoose.Types.ObjectId(admin.instituteId) });
        
        console.log('Institute Document:');
        console.log('  _id:', institute?._id);
        console.log('  name:', institute?.name);
      }
    }

    await mongoose.disconnect();
    console.log('\n✓ Check completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdminInstituteId();
