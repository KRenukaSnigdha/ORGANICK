
# ORGANICK - Organic Farming Platform

**ORGANICK** is a web application for managing organic farming products. It includes features such as user and farmer registration, login, and product checkout. The platform allows both farmers and users to create accounts, log in, and access personalized services.
<img width="1062" height="427" alt="image" src="https://github.com/user-attachments/assets/27aa8130-abcf-43f9-acf6-df0b105765c3" />


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Setup and Installation](#setup-and-installation)
- [Firebase Configuration](#firebase-configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration & Login**: Allows users to sign up and log in to the platform.
- **Farmer Registration & Login**: Enables farmers to sign up, log in, and manage their profiles.
- **Firestore Database**: Stores user and farmer data securely.
- **Product Management**: Farmers can manage their products.
- **Checkout**: Users can browse and purchase products.

---
## Tech Stack

- **Node.js**: Backend server framework.
- **Express.js**: Server-side web framework.
- **Firebase**: Authentication and Firestore database.
- **HTML/CSS/JavaScript**: Frontend design and functionality.

---
## Screenshots

1.Login and Sign Up pages 

<img width="660" height="633" alt="image" src="https://github.com/user-attachments/assets/31fa8976-d160-4d89-a255-e869b368d465" />

2.Products

<img width="875" height="488" alt="image" src="https://github.com/user-attachments/assets/363bb457-f8a8-41b0-aa2e-767d4558fc6e" />

3. Database
   
<img width="785" height="767" alt="image" src="https://github.com/user-attachments/assets/913cf2ce-8cef-4d06-b5f0-5ebeaf5d0584" />


---
## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/organick.git
cd organick
```
## Installation & Setup

### 2. Install Dependencies

Install the required Node.js dependencies using:

```bash
npm install
```
### 3. Create Firebase Project
Go to Firebase Console.
Create a new Firebase project.
Enable Cloud Firestore.
Enable Authentication.
Enable Email/Password authentication under Authentication → Sign-in method.
Generate a Service Account Key (JSON) for the Firebase Admin SDK.

### 4. Setup Firebase Admin SDK

Place the downloaded serviceAccountKey.json file in the root directory of the project.

Initialize Firebase Admin SDK in server.js:

```bash
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```
**Important:** Never upload serviceAccountKey.json to GitHub. Add it to .gitignore because it contains private Firebase credentials.
### 5. Run the Server
```bash
node server.js
```
The app should now be running on http://localhost:3000.

---
## Firebase Configuration

**Authentication:** Enable email/password authentication.
**Firestore Database:** Set up two collections, Farmers and Users, to store farmer and user data, respectively.
**Firestore Structure:**
Farmers (collection)
  - farmerUID (document)
    - name: String
    - email: String
    - location: String

Users (collection)
  - userUID (document)
    - name: String
    - email: String
**Usage**
1. Farmer Signup

Farmers can sign up by submitting their email, password, name, and location via the signup-farmer.html form.

2. User Signup

Users can sign up by submitting their email, password, and name via the signup-user.html form.

3. Login for Farmers & Users

Both farmers and users can log in by submitting their credentials via login-farmer.html or login-user.html forms.

---

## Project Structure

ORGANICK/
│
├── assets/                  # Static assets like images, fonts, etc.
│
├── node_modules/            # Dependencies (generated after npm install)
│
├── partials/                # Reusable components like header and footer
│
├── public/                  # Publicly accessible files
│   └── styles.css           # Stylesheet for the application
│
├── views/                   # HTML views
│   ├── login-farmer.html    # Farmer login page
│   ├── login-user.html      # User login page
│   ├── signup-farmer.html   # Farmer signup page
│   └── signup-user.html     # User signup page
│
├── .gitignore               # Files and directories ignored by Git
├── Gulpfile.js              # Gulp task automation configuration
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Dependency lock file
├── README.md                # Project documentation
├── server.js                # Express backend server
└── serviceAccountKey.json   # Firebase Admin SDK credentials (DO NOT SHARE)

---
## Routes
POST /signup-farmer: Farmer registration.
POST /login-farmer: Farmer login.
POST /signup-user: User registration.
POST /login-user: User login.

---

## Contributing
We welcome contributions to enhance ORGANICK!
**Steps to contribute:**
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-branch).
Create a pull request.

