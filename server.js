const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('./organic-farming-58b8d-firebase-adminsdk-biun7-d36043d167.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Enable ignoreUndefinedProperties to avoid Firestore errors with undefined values
db.settings({ ignoreUndefinedProperties: true });

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'), {
  index: false // Prevent serving index.html directly
}));

// Serve login page by default at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve signup page for users
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Farmer signup
app.post('/signup-farmer', (req, res) => {
  console.log('Received signup data:', req.body);

  const { email, password, name, location } = req.body;

  // Validate input fields
  if (!email || !password || !name || !location) {
    return res.status(400).send('Error: Missing required fields.');
  }

  admin.auth().createUser({
    email: email,
    password: password
  })
    .then(userRecord => {
      console.log('Farmer user created:', userRecord.uid);

      // Add farmer details to Firestore under 'Farmers' collection
      return db.collection('Farmers').doc(userRecord.uid).set({
        name: name,
        email: email,
        location: location,
        role: 'farmer' // Set role as 'farmer'
      });
    })
    .then(() => res.send('Farmer signed up successfully and added to Firestore!'))
    .catch(error => {
      console.error('Error during farmer signup:', error);
      res.status(400).send(error.message);
    });
});

// User signup
app.post('/signup-user', (req, res) => {
  const { email, password, name } = req.body;

  // Validate input fields
  if (!email || !password || !name) {
    return res.status(400).send('Error: Missing required fields.');
  }

  admin.auth().createUser({
    email: email,
    password: password
  })
    .then(userRecord => {
      console.log('User created:', userRecord.uid);

      // Add user details to Firestore under 'Users' collection
      return db.collection('Users').doc(userRecord.uid).set({
        name: name,
        email: email,
        role: 'user' // Set role as 'user'
      });
    })
    .then(() => res.send('User signed up successfully and added to Firestore!'))
    .catch(error => {
      console.error('Error during user signup:', error);
      res.status(400).send(error.message);
    });
});

// Login for User or Farmer
app.post('/login-user', (req, res) => {
  const { email, password } = req.body;

  admin.auth().getUserByEmail(email)
    .then(userRecord => {
      console.log('User login successful:', userRecord.uid);

      // Check if the user is a farmer or a regular user
      const userId = userRecord.uid;

      // Check Firestore for user's role (either from 'Farmers' or 'Users' collection)
      return Promise.all([
        db.collection('Farmers').doc(userId).get(),
        db.collection('Users').doc(userId).get()
      ]);
    })
    .then(([farmerDoc, userDoc]) => {
      let userType = 'user'; // Default is 'user'

      if (farmerDoc.exists) {
        userType = 'farmer'; // If farmerDoc exists, this is a farmer
      }

      res.json({ uid: farmerDoc.id || userDoc.id, userType });
    })
    .catch(error => {
      console.error('Login failed:', error);
      res.status(400).send('Login failed: ' + error.message);
    });
});

// Farmer login
app.post('/login-farmer', (req, res) => {
    const { email, password } = req.body;
  
    admin.auth().getUserByEmail(email)
      .then(userRecord => {
        console.log('Farmer login successful:', userRecord.uid);
  
        // Check if the user is a farmer by checking Firestore
        return db.collection('Farmers').doc(userRecord.uid).get();
      })
      .then(farmerDoc => {
        if (!farmerDoc.exists) {
          throw new Error('Not a farmer.'); // Throw error if no farmer document found
        }
  
        res.json({ uid: farmerDoc.id, userType: 'farmer' });
      })
      .catch(error => {
        console.error('Login failed:', error);
        res.status(400).send('Login failed: ' + error.message);
      });
  });
  
  

// Farmer posts a product
app.post('/post-product', (req, res) => {
  console.log('Received request:', req.body); // Log the incoming request body

  const { productName, productDescription, productCost, farmerId } = req.body;

  if (!productName || !productDescription || !productCost || !farmerId) {
    return res.status(400).send('Error: Missing required fields.');
  }

  // Check if the user is a farmer before allowing product posting
  db.collection('Farmers').doc(farmerId).get()
    .then(docSnapshot => {
      if (!docSnapshot.exists) {
        throw new Error('Only farmers can post products.');
      }

      // Add product details to Firestore under 'Products' collection
      return db.collection('Products').add({
        productName: productName,
        productDescription: productDescription,
        productCost: productCost,
        farmerId: farmerId,
        postedAt: new Date().toISOString()
      });
    })
    .then(() => res.send('Product posted successfully!'))
    .catch(error => {
      console.error('Error posting product:', error);
      res.status(400).send(error.message);
    });
});

// Fetch all products for the homepage
app.get('/get-products', async (req, res) => {
  try {
    const productsSnapshot = await db.collection('Products').get();
    const products = [];
    productsSnapshot.forEach(doc => {
      products.push(doc.data());
    });
    res.json(products);  // Send products as JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});