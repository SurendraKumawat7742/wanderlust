## 🏕️ Wanderlust

> An Airbnb-inspired full-stack travel listing platform built with Node.js, Express.js, MongoDB, and EJS.

Wanderlust is a full-stack web application that allows users to discover travel destinations, explore property listings, create and manage listings, leave reviews, and securely manage their accounts.

## 🌐 Live Demo

[Wanderlust](https://wanderlust-4-fqzf.onrender.com)

## ✨ Features
- 🔐 User registration and authentication
- 👤 User login and logout
- 🏡 Create and manage property listings
- 🔎 Explore available destinations
- 📍 View listing locations
- 📝 Add and manage reviews
- ⭐ Rate properties
- 🖼️ Upload listing images
- ☁️ Cloudinary-based image storage
- 🛡️ Protected routes and authorization
- ✅ Server-side form validation
- ⚡ Responsive user interface
- 🗄️ MongoDB database integration
- 🍪 Session-based authentication

## 🛠️ Tech Stack
### Frontend
- EJS
- EJS-Mate
- HTML
- CSS
- Bootstrap
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Passport Local
- Express Session
- Joi
- Multer

### Cloud & Storage
- Cloudinary
- MongoDB Atlas

### Tools
- Git & GitHub
- Vercel
- npm

## 🏗️ Project Architecture
```text
Wanderlust/
│
├── Controller/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── property.js
│   ├── review.js
│   └── user.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── includes/
│
├── init/
│
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── README.md
```
## 🔄 Application Flow
```text
                         User
                           │
                           ▼
                    EJS Frontend
                           │
                           │ HTTP Request
                           ▼
                  Express.js Server
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Listings        Authentication      Reviews
          │                │                │
          │                ▼                │
          │          Passport.js            │
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                       Mongoose
                           │
                           ▼
                        MongoDB
                           │
                           │
                    Image Uploads
                           │
                           ▼
                       Cloudinary
```
## 🗄️ Database Models

Wanderlust uses MongoDB with Mongoose for data persistence.

### Listing

Stores information about properties and destinations.
```text
Listing
├── title
├── description
├── image
├── price
├── location
└── country
```
### User

Stores registered user information and authentication details.
```text
User
├── username
└── password
```
### Review

Stores reviews and ratings associated with listings.
```text
Review
├── rating
├── comment
└── author
```
## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
```bash
Node.js
npm
MongoDB / MongoDB Atlas
Git
```
### 1. Clone the Repository
```bash
git clone https://github.com/SurendraKumawat7742/wanderlust.git
cd wanderlust
```
### 2. Install Dependencies
npm install

### 3. Configure Environment Variables

Create a .env file in the root directory.
```bash
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```
Do not commit your .env file or expose your API keys publicly.

### 4. Start the Application

node app.js

For development, you can also use a tool such as nodemon if installed.

### 5. Open the Application

Visit:

http://localhost:8080

## ☁️ Image Upload

Wanderlust uses Cloudinary for storing listing images.

The application uses:

- Cloudinary
- Multer
- Multer Storage Cloudinary

This allows uploaded images to be stored remotely instead of relying only on local server storage. The project dependencies confirm the Cloudinary and Multer integration.

## 🔐 Authentication & Authorization

Authentication is implemented using:

- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session
- Connect Mongo

Users can register and log in to access protected functionality.

## 🚀 Deployment

The application frontend is deployed on Vercel.
