// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Protected route example
app.get('/api/orders', authenticate, async (req, res) => {
    try {
        // Fetch orders from Firestore
        const orders = await admin.firestore()
            .collection('orders')
            .where('userId', '==', req.user.uid)
            .get();
        
        res.json(orders.docs.map(doc => doc.data()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});