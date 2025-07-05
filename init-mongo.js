// MongoDB initialization script for URL Shortener application
// This script runs when the MongoDB container starts for the first time

// Switch to the url-shortener database
db = db.getSiblingDB('url-shortener');

// Create a user specifically for the url-shortener application
db.createUser({
    user: 'urlshortener',
    pwd: 'urlshortener123',
    roles: [
        {
            role: 'readWrite',
            db: 'url-shortener'
        }
    ]
});

// Create initial collections with proper indexes
db.createCollection('users');
db.createCollection('urls');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.urls.createIndex({ shortCode: 1 }, { unique: true });
db.urls.createIndex({ userId: 1 });
db.urls.createIndex({ createdAt: 1 });

console.log('Database initialization completed successfully!'); 