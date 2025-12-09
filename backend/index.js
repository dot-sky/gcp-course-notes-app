// index.js

const express = require('express');
const cors = require('cors');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { Pool } = require('pg'); // Import Pool directly here for initialization

const app = express();
const port = process.env.PORT || 8080; // Use process.env.PORT for robustness

// CORS Configuration
const frontendUrl = "https://notesapp-frontend-service-203087834044.us-central1.run.app" || 'http://localhost:3000';
app.use(cors({
  origin: "*"
}));

// --- Database Pool and Secret Manager Initialization ---
let dbPool; // Declare dbPool globally, will be initialized asynchronously

async function initializeApp() {
    console.log('Starting application initialization...');
    const secretManagerClient = new SecretManagerServiceClient();

    try {
        // 1. Fetch database credentials from Secret Manager
        console.log('Accessing secret: projects/refreshing-park-478520-d6/secrets/notes-db-secret/versions/latest');
        const [version] = await secretManagerClient.accessSecretVersion({
            name: `projects/refreshing-park-478520-d6/secrets/notes-db-secret/versions/latest`,
        });
        const secretPayload = JSON.parse(version.payload.data.toString());
        console.log('Secrets fetched successfully.');

        // 2. Initialize the PostgreSQL connection pool
        dbPool = new Pool({
            user: secretPayload.DB_USER,
            host: secretPayload.DB_HOST,
            database: secretPayload.DB_NAME,
            password: secretPayload.DB_PASSWORD,
            port: secretPayload.DB_PORT,
            // For Cloud SQL private IP, you might also need:
            // ssl: {
            //   rejectUnauthorized: false // Or proper CA certs if using public IP with SSL
            // }
        });
        console.log('PostgreSQL pool initialized.');

        // Test the database connection
        await dbPool.query('SELECT NOW()');
        console.log('Successfully connected to PostgreSQL database.');

        // 3. Import and initialize the queries module with the dbPool
        // We require it here, AFTER the pool is ready
        const db = require('./queries')(dbPool);

        // Middleware to parse JSON bodies - Placed here to ensure it runs for all defined routes below
        app.use(express.json());

        // Define API endpoints using the now-initialized db module
        app.get('/', (request, response) => {
          response.json({ info: 'Node.js, Express, and Postgres API for Notes' });
        });

        app.get('/notes', db.getNotes);
        app.get('/notes/:id', db.getNoteById);
        app.post('/notes', db.createNote);
        app.put('/notes/:id', db.updateNote);
        app.delete('/notes/:id', db.deleteNote);

        // 4. Start the server only AFTER everything is initialized
        app.listen(port, () => {
            console.log(`Backend service listening on port ${port}.`);
        });

    } catch (err) {
        console.error('FATAL ERROR during application startup:', err);
        // Crucial: Exit the process if initialization fails, so Cloud Run knows it's unhealthy
        process.exit(1);
    }
}

// Start the initialization process
initializeApp();

// For testing purposes
module.exports = {
    app,
    initializeApp,
    get dbPool() { return dbPool; } // Use a getter to access the initialized pool
};