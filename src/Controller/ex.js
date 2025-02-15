import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/TodoModels.js'; // Adjust path as necessary

// Environment variable for JWT secret (securely stored)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace!

export const loginAcc = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // 2. Find User by Email
    const user = await User.findOne({ where: { email: String(email) } }); // String() to be safe

    // 3. Check if User Exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' }); // Unauthorized
    }

    // 4. Compare Passwords
    const passwordMatch = await bcryptjs.compare(String(password), user.password); // String() again

    // 5. If Passwords Don't Match
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 6. Generate JWT Token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, userName: user.userName }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Adjust as needed
    );

    // 7. Update lastLogin
    user.lastLogin = new Date(); // OR DataTypes.NOW if you want to use the database's time
    await user.save();  // Save the updated lastLogin timestamp

    // 8. Send Success Response
    return res.status(200).json({ // 200 OK
      success: true,
      message: 'Login successful',
      token: token, // Send the JWT token
      user: {
        userId: user.userId,
        email: user.email,
        userName: user.userName,
      }, // Send user info (excluding password)
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

export const logoutAcc = async (req, res) => {
    try {
      // Logout is typically a client-side operation in JWT-based authentication.
      // The server invalidates the token by removing it from the client (e.g., localStorage, cookies).
  
      // Server-side (optional): You *could* implement token blacklisting for true server-side logout,
      //   but this adds complexity and is usually unnecessary for most web apps.
  
      res.status(200).json({ success: true, message: 'Logout successful' }); // 200 OK
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ success: false, message: 'Logout failed. Please try again.' });
    }
  };