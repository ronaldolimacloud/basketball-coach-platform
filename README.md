# 🏀 Basketball Coach Platform

A modern web application for basketball coaches to analyze game footage, provide timestamped feedback to players, and track team performance.

## ✨ Features

### 🎥 **Video Analysis**
- Custom video player with timeline controls
- Click-to-add markers at specific timestamps
- Visual timeline with color-coded feedback markers
- Jump to specific moments by clicking timeline markers

### 👥 **Player Management**
- Team roster management with player details
- Position tracking and player statistics
- Individual player feedback tracking

### 🏷️ **Feedback System**
- Timestamped markers for positive feedback and improvement areas
- Categorized feedback (offense, defense, teamwork)
- Priority levels for actionable insights
- Searchable and filterable feedback history

### 📊 **Analytics Dashboard**
- Game statistics and performance metrics
- Player progress tracking
- Quick stats overview

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: AWS Amplify Gen 2
- **Database**: AWS DynamoDB (via Amplify)
- **Authentication**: AWS Cognito
- **Storage**: AWS S3 (for video files)
- **Hosting**: AWS Amplify Hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS Account (for deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/basketball-coach-platform.git
   cd basketball-coach-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Deploy to AWS (optional)**
   ```bash
   npx ampx sandbox
   ```

### Project Structure
```
basketball-coach-platform/
├── amplify/                 # AWS Amplify backend configuration
│   ├── auth/               # Authentication settings
│   ├── data/               # Database schema
│   └── backend.ts          # Backend configuration
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## 📋 Data Models

### Player
- Name, number, position
- Team association
- Performance statistics

### Game
- Opponent, date, type
- Video URL and metadata
- Score and notes

### Marker
- Timestamp and description
- Player and game associations
- Feedback type and category
- Priority level

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📱 Current Status

**Version**: 0.0.0 (Initial Development)

**Completed Features**:
- ✅ Basic video player with timeline
- ✅ Player roster management
- ✅ Marker creation and display
- ✅ AWS Amplify backend setup
- ✅ Database schema design

**In Progress**:
- 🔄 Authentication integration
- 🔄 Real data persistence
- 🔄 Video upload functionality

**Planned Features**:
- 📋 Advanced analytics dashboard
- 📋 Video clip creation
- 📋 Export functionality
- 📋 Mobile app support
- 📋 Multi-team management

## 🤝 Contributing

This is currently a private development project. For questions or suggestions, please contact the development team.

## 📄 License

Private project - All rights reserved.
