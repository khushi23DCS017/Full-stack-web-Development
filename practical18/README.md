# Taskify - Modern Task Management & Productivity Dashboard

A beautiful, responsive, and feature-rich task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and deployed on Firebase.

![Taskify Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Taskify+Dashboard)

## 🚀 Features

### ✨ Core Features
- **User Authentication** - Secure registration and login with JWT
- **Task Management** - Create, edit, delete, and organize tasks
- **Project Organization** - Group tasks into projects with custom colors
- **Dashboard Analytics** - Visual insights into productivity and progress
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Real-time Updates** - Instant feedback and smooth animations

### 🎨 UI/UX Features
- **Modern Design** - Clean, intuitive interface with beautiful gradients
- **Dark/Light Theme** - Automatic theme switching based on system preferences
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Components** - Hover effects, loading states, and micro-interactions
- **Mobile-First** - Optimized for all screen sizes

### 📊 Dashboard Features
- **Statistics Overview** - Total tasks, completion rate, and progress tracking
- **Recent Tasks** - Quick access to latest tasks
- **Quick Actions** - One-click task and project creation
- **Progress Visualization** - Visual progress bars and completion rates

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests
- **React Toastify** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Deployment
- **Firebase Hosting** - Frontend deployment
- **MongoDB Atlas** - Cloud database (recommended)
- **GitHub** - Version control and code hosting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskify
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Firebase Hosting Deployment

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase Project**
```bash
firebase init hosting
```

4. **Build the Frontend**
```bash
cd frontend
npm run build
```

5. **Deploy to Firebase**
```bash
firebase deploy
```

### Environment Variables for Production

Update the frontend API URL in `frontend/src/context/AuthContext.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-api.com';
```

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/600x400/667eea/ffffff?text=Dashboard+View)

### Tasks Management
![Tasks](https://via.placeholder.com/600x400/10b981/ffffff?text=Tasks+Management)

### Projects
![Projects](https://via.placeholder.com/600x400/f59e0b/ffffff?text=Projects+View)

### Mobile Responsive
![Mobile](https://via.placeholder.com/300x600/8b5cf6/ffffff?text=Mobile+View)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎯 Features in Detail

### Task Management
- **Priority Levels** - High, Medium, Low with color coding
- **Status Tracking** - Todo, In Progress, Completed
- **Due Dates** - Set and track task deadlines
- **Categories** - Organize tasks by category
- **Search & Filter** - Find tasks quickly
- **Bulk Actions** - Mark multiple tasks as complete

### Project Organization
- **Custom Colors** - Personalize project appearance
- **Progress Tracking** - Visual progress indicators
- **Task Association** - Link tasks to projects
- **Project Statistics** - Track project completion

### User Experience
- **Responsive Design** - Works on all devices
- **Intuitive Navigation** - Easy-to-use sidebar and navigation
- **Real-time Feedback** - Instant updates and notifications
- **Smooth Animations** - Delightful user interactions
- **Accessibility** - Keyboard navigation and screen reader support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Express.js](https://expressjs.com/) - The backend framework
- [MongoDB](https://www.mongodb.com/) - The database
- [Firebase](https://firebase.google.com/) - The hosting platform
- [Lucide](https://lucide.dev/) - The icon library
- [Framer Motion](https://www.framer.com/motion/) - The animation library

## 📈 Future Enhancements

- [ ] Team collaboration features
- [ ] File attachments for tasks
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Task templates
- [ ] Time tracking
- [ ] Integration with external tools

---

⭐ **Star this repository if you found it helpful!**
