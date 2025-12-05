require('dotenv').config({ path: '.env.development' });
const { MongoClient } = require('mongodb');

async function checkAssignments() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sshDB';
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('sshDB');
    const assignmentsCollection = db.collection('activitytypeassignments');
    const typesCollection = db.collection('activitytypes');
    
    // Count documents
    const assignmentCount = await assignmentsCollection.countDocuments();
    const typeCount = await typesCollection.countDocuments();
    
    console.log(`\nTotal ActivityTypes: ${typeCount}`);
    console.log(`Total ActivityTypeAssignments: ${assignmentCount}`);
    
    // Show all assignments
    console.log('\n--- ActivityTypeAssignments ---');
    const assignments = await assignmentsCollection.find({}).toArray();
    assignments.forEach(a => {
      console.log(`ID: ${a._id}`);
      console.log(`  activityTypeId: ${a.activityTypeId}`);
      console.log(`  instituteId: ${a.instituteId === null ? 'null' : a.instituteId === undefined ? 'undefined' : a.instituteId}`);
      console.log(`  hasInstituteIdField: ${a.hasOwnProperty('instituteId')}`);
      console.log(`  status: ${a.status}`);
      console.log('');
    });
    
    // Show all types
    console.log('\n--- ActivityTypes ---');
    const types = await typesCollection.find({}).toArray();
    types.forEach(t => {
      console.log(`ID: ${t._id}`);
      console.log(`  name: ${t.name}`);
      console.log(`  isPrimitive: ${t.isPrimitive}`);
      console.log(`  status: ${t.status}`);
      console.log(`  formSchema fields: ${t.formSchema?.length || 0}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

checkAssignments();
