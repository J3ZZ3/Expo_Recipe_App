# Recipe Hub Mobile App

Recipe Hub is a feature-rich mobile application built with React Native and Expo that allows users to discover, save, and manage their favorite recipes. The app provides a seamless experience for cooking enthusiasts to explore new recipes and maintain their personal collection.

## Features

### User Authentication
- Secure email/password authentication using Supabase
- User profile creation and management
- Protected routes and authenticated sessions

### Recipe Management
- Browse a curated collection of recipes
- Search recipes by name or category
- Add recipes to favorites
- Create and manage personal recipes
- View detailed recipe instructions and ingredients

### User Interface
- Modern and intuitive design
- Responsive layout for various screen sizes
- Loading states and animations
- Image handling for recipes and user profiles
- Dark/Light theme support

### Profile Management
- Customizable user profiles
- Profile picture upload and management
- Personal information management
- View and manage favorite recipes

## Technical Stack

### Frontend
- React Native
- Expo Framework
- React Navigation
- React Context API
- Expo Vector Icons
- React Native Reanimated

### Backend
- Supabase (Backend as a Service)
- PostgreSQL Database
- Supabase Authentication
- Supabase Storage for media files

### Development Tools
- TypeScript
- Babel
- EAS (Expo Application Services)
- Jest for testing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:

bash
```
git clone https://github.com/J3ZZ3/Expo_Recipe_App.git
cd Expo_Recipe_App
```

2. Install dependencies:

bash
```
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

### Building for Production

1. Configure EAS:
```bash
eas build:configure
```

2. Build for Android:
```bash
eas build --platform android
```

3. Build for iOS:
```bash
eas build --platform ios
```

## Acknowledgments

- Recipe data provided by [TheMealDB API](https://www.themealdb.com/api.php)
- Icons from [Ionicons](https://ionic.io/ionicons)
- UI inspiration from various cooking apps





