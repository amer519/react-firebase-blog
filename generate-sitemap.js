const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const admin = require('firebase-admin');
require('dotenv').config(); // Load environment variables

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
  // databaseURL is omitted since you're using Cloud Firestore
});

const db = admin.firestore();

// Function to fetch all blog post IDs from Firestore
const fetchPostIDs = async () => {
  try {
    const snapshot = await db.collection('posts').get(); // Use 'posts' collection
    const ids = [];
    snapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    return ids;
  } catch (error) {
    console.error('Error fetching post IDs:', error);
    throw error; // Ensure the error propagates
  }
};

// Define your static routes
const staticRoutes = [
  '/',
  '/login',
  '/blogs',
  '/create',
  // Add more static routes here if necessary
];

// Generate sitemap
const generateSitemap = async () => {
  try {
    const postIDs = await fetchPostIDs();
    const dynamicRoutes = postIDs.map((id) => `/blogs/${id}`); // Ensure correct frontend route

    // Define your base URL
    const hostname = 'https://iamsimba.co'; // Replace with your actual domain

    // Create an array of link objects
    const links = staticRoutes.map((route) => ({
      url: route,
      changefreq: 'weekly',
      priority: 0.8,
    }));

    dynamicRoutes.forEach((route) => {
      links.push({
        url: route,
        changefreq: 'monthly',
        priority: 0.7,
      });
    });

    // Create a stream to write to sitemap.xml
    const stream = new SitemapStream({ hostname });

    // Convert links to a readable stream and pipe into sitemap stream
    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString()
    );

    // Ensure the build directory exists
    const buildDir = path.resolve(__dirname, 'build');
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }

    // Write the sitemap.xml file to the build directory
    fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), xmlString);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error; // Ensure the build fails if sitemap generation fails
  }
};

// Run the sitemap generation function
generateSitemap();