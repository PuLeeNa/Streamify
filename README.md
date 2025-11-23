# 🎬 Streamify - Movie Discovery App

A feature-rich React Native mobile application built with Expo that allows users to discover, search, and save their favorite movies using The Movie Database (TMDB) API.

## 📱 Features

### 🔐 User Authentication

- **Login & Registration Flow**: Secure authentication using TMDB API
- **Session Management**: Persistent login with AsyncStorage
- **Protected Routes**: Authentication-based navigation
- **User Profile**: Display user information with avatar and username
- **Secure Logout**: Session cleanup with confirmation dialog

### 🎥 Movie Discovery

- **Trending Movies**: Horizontal carousel showcasing top 5 trending movies with ranking badges
- **Latest Movies**: Grid layout displaying the latest releases
- **Movie Details**: Comprehensive movie information including:
  - Poster and backdrop images
  - Title, release date, and runtime
  - Rating and vote count
  - Overview and synopsis
  - Genres
  - Budget and revenue
  - Production companies
  - Related/similar movies carousel

### 🔍 Search Functionality

- **Real-time Search**: Debounced search input for optimal performance
- **Search Tracking**: Appwrite integration to track search metrics
- **Results Grid**: Clean display of search results

### 💾 Save Movies

- **Save/Unsave**: Bookmark favorite movies
- **Saved Collection**: Dedicated tab to view all saved movies
- **Auto-refresh**: Saved list updates when returning to the tab
- **Remove Movies**: Easy removal from saved collection
- **Persistent Storage**: Movies saved via Appwrite database

### 🎨 Theme System

- **Dark Mode**: Beautiful dark theme with custom colors
- **Light Mode**: Clean light theme
- **System Mode**: Automatic theme based on device settings
- **Persistent Preference**: Theme choice saved with AsyncStorage
- **Global Theme**: Consistent theming across all screens and components

### 📊 Analytics

- **Search Metrics**: Track popular search queries
- **Trending Analytics**: Monitor most-viewed movies

## 🛠️ Tech Stack

### Core Technologies

- **React Native**: Mobile app framework
- **Expo SDK ~54.0.25**: Development platform
- **TypeScript**: Type-safe code
- **Expo Router v6.0.15**: File-based navigation

### Styling

- **NativeWind v4.2.1**: Tailwind CSS for React Native
- **Custom Tailwind Config**: Customized color palette and design tokens

### Backend & APIs

- **TMDB API**: Movie data and authentication
- **Appwrite**: Backend services for:
  - User saved movies
  - Search metrics tracking
  - Data persistence

### State Management & Storage

- **React Context API**: Global state (Auth & Theme)
- **AsyncStorage**: Local data persistence
- **Custom Hooks**: Reusable data fetching logic

### Additional Libraries

- **react-native-appwrite**: Appwrite SDK integration
- **@react-native-masked-view/masked-view**: Masked views for UI effects
- **react-native-url-polyfill**: URL polyfill for React Native

## 📁 Project Structure

```
my-app/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── _layout.tsx      # Tab bar layout with theme support
│   │   ├── index.tsx        # Home screen (trending & latest movies)
│   │   ├── search.tsx       # Search screen with debounced input
│   │   ├── saved.tsx        # Saved movies collection
│   │   └── profile.tsx      # User profile & settings
│   ├── movies/
│   │   └── [id].tsx         # Dynamic movie details screen
│   ├── _layout.tsx          # Root layout with auth protection
│   ├── login.tsx            # Login screen with validation
│   ├── register.tsx         # Registration screen
│   └── globals.css          # Global styles
├── components/
│   ├── MovieCard.tsx        # Reusable movie card component
│   ├── TrendingCard.tsx     # Trending movie card with ranking
│   └── SearchBar.tsx        # Search input component
├── contexts/
│   ├── AuthContext.tsx      # Authentication state management
│   └── ThemeContext.tsx     # Theme state management
├── services/
│   ├── api.ts               # TMDB API integration
│   ├── appwrite.ts          # Appwrite database operations
│   ├── auth.ts              # Authentication service
│   └── useFetch.ts          # Custom fetch hook
├── constants/
│   ├── icons.ts             # Icon imports
│   └── images.ts            # Image imports
├── interfaces/
│   └── interfaces.d.ts      # TypeScript interfaces
├── assets/                  # Images, icons, and fonts
└── .env                     # Environment variables

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- TMDB API account
- Appwrite project (optional for backend features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Streamify/my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `my-app` directory:

   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_bearer_token
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ID=metrics
   EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID=saved_movies
   ```

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run the app**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your device

## 🔑 API Setup

### TMDB API

1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API
3. Generate API Key (v3 auth) and Read Access Token (v4 auth)
4. Use the Read Access Token (Bearer token) in your `.env` file

### Appwrite (Optional)

1. Create a project at [appwrite.io](https://appwrite.io/)
2. Create a database with two collections:
   - `metrics`: For search tracking
   - `saved_movies`: For user saved movies
3. Configure collection attributes as needed
4. Update `.env` with your project credentials

## 👤 User Authentication

### Registration

1. Users need a TMDB account to use the app
2. The registration screen validates input:
   - Username: minimum 3 characters
   - Email: valid email format
   - Password: minimum 8 characters, uppercase, lowercase, and number
3. App redirects to TMDB website for account creation
4. After creating TMDB account, return to app and login

### Login

1. Enter TMDB username and password
2. App authenticates with TMDB API
3. Session is created and stored securely
4. User is redirected to home screen
5. Session persists across app restarts

## 🎨 Theme Customization

The app uses a custom color scheme defined in `tailwind.config.js`:

```javascript
colors: {
  primary: "#0F0D23",
  secondary: "#F8D247",
  accent: "#FF6B6B",
  light: {
    100: "#E7EDF8",
    200: "#C2D1E8",
    300: "#A8B5DB",
  },
  dark: {
    100: "#272343",
    200: "#312F45",
  },
}
```

## 📱 App Screens

1. **Login Screen**: Authentication with form validation
2. **Register Screen**: User registration with validation
3. **Home Screen**: Trending carousel + Latest movies grid
4. **Search Screen**: Search bar + Results grid
5. **Saved Screen**: User's saved movies collection
6. **Profile Screen**: User info, theme toggle, logout
7. **Movie Details**: Comprehensive movie information + Similar movies

## 🔒 Security Features

- Secure session management with AsyncStorage
- Bearer token authentication
- Protected routes with automatic redirects
- Session validation on app launch
- Secure logout with session cleanup

## 🐛 Known Issues & Notes

- TMDB doesn't provide public API for user registration
- Users must create accounts on themoviedb.org
- Some movie posters may not load if unavailable in TMDB
- Appwrite integration is optional but recommended for full functionality

## 📦 Dependencies

```json
{
  "expo": "~54.0.25",
  "expo-router": "^6.0.15",
  "react-native": "0.76.5",
  "nativewind": "^4.2.1",
  "react-native-appwrite": "latest",
  "@react-native-async-storage/async-storage": "^2.x",
  "@react-native-masked-view/masked-view": "latest"
}
```

## 🤝 Contributing

This is an academic project for Mobile Applications Development course.

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie API
- [Appwrite](https://appwrite.io/) for backend services
- [Expo](https://expo.dev/) for the development framework
- [NativeWind](https://www.nativewind.dev/) for styling

---

