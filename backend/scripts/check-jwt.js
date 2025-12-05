// Copy your JWT token from localStorage and paste it here
const token = "PASTE_YOUR_JWT_TOKEN_HERE";

// Decode the JWT (without verification, just to see the payload)
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Invalid JWT token format');
      return;
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    console.log('🔍 Your Current JWT Token Payload:\n');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\n---\n');
    
    if (!payload.instituteId || payload.instituteId.trim() === '') {
      console.log('❌ PROBLEM FOUND: instituteId is EMPTY in your token!');
      console.log('\n✅ SOLUTION:');
      console.log('1. Open your browser');
      console.log('2. Open Developer Tools (F12)');
      console.log('3. Go to Application/Storage → Local Storage');
      console.log('4. Clear the "accessToken" key');
      console.log('5. Go back to your app and LOG IN again');
      console.log('6. Your new token will have the correct instituteId');
    } else {
      console.log('✅ Token has instituteId:', payload.instituteId);
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

if (token === "PASTE_YOUR_JWT_TOKEN_HERE") {
  console.log('📋 INSTRUCTIONS:');
  console.log('\n1. Open your browser Developer Tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Type: localStorage.getItem("accessToken")');
  console.log('4. Copy the token (without quotes)');
  console.log('5. Paste it in this file where it says PASTE_YOUR_JWT_TOKEN_HERE');
  console.log('6. Run: node check-jwt.js');
  console.log('\nOR just LOG OUT and LOG IN again - that will fix everything!');
} else {
  decodeJWT(token);
}
