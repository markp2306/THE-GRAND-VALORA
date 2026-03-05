# The Grand Valora - Project Structure

This project has been reorganized to be cleaner and easier to maintain.

## 📂 Folder Structure

- **`/` (Root)**: Contains the main entry file `index.html`.
- **`assets/images/`**: All website images are stored here.
- **`css/`**: Contains `style.css` for all visual styling (colors, layout, animations).
- **`js/`**:
  - `firebase-config.js`: Handles connection to the database.
  - `script.js`: Contains all interaction logic (reservations, modals, scroll effects).
- **`backend/`**: A separate folder for the Node.js server that handles email confirmations.

## 🚀 How to Run

1. **Frontend**: Simply open `index.html` in your browser.
2. **Backend**:
   - Navigate to the `backend/` folder.
   - Run `npm install` (first time only).
   - Run `npm run dev` to start the confirmation email server.

## 🛠️ Key Features

- **Firebase Integration**: Real-time reservation storage.
- **Nodemailer**: Automated, professionally styled confirmation emails.
- **Responsive Design**: Optimized for all devices.
- **Smooth Animations**: High-end luxury feel with scroll reveals.
