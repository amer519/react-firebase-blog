// generate-sitemap.js
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

// Function to fetch all blog IDs from Firestore
const fetchBlogIDs = async () => {
  const snapshot = await db.collection('posts').get(); // Ensure 'blogs' is your correct collection name
  const ids = [];
  snapshot.forEach((doc) => {
    ids.push(doc.id);
  });
  return ids;
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
    const blogIDs = await fetchBlogIDs();
    const dynamicRoutes = blogIDs.map((id) => `/posts/${id}`);

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

    // Ensure the public directory exists
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // Write the sitemap.xml file
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlString);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();