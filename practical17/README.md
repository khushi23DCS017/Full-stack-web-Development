# Tuition Management System - Admin Panel

A comprehensive web application for managing student records in a tuition class. Built with Node.js, Express.js, MongoDB, and Bootstrap.

## Features

### 🎯 Core Functionality
- **Add Students**: Complete student registration with validation
- **View Students**: Display all students in a responsive table
- **Edit Students**: Update student information seamlessly
- **Delete Students**: Remove students with confirmation dialog

### 🔍 Advanced Features
- **Real-time Search**: Search students by name, class, contact, guardian, or address
- **Form Validation**: Client-side and server-side validation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with Bootstrap 5
- **Loading States**: Visual feedback during operations
- **Error Handling**: Comprehensive error messages and alerts

### 📊 Student Information
- Full Name (Required)
- Age (Optional, 3-120 years)
- Class/Grade (Optional)
- Guardian/Parent Name (Optional)
- Contact Number (Required, 10-digit Indian mobile)
- Address (Optional)
- Fees Status (Paid/Pending)

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with gradients and animations
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon library

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd practical17
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://127.0.0.1:27017/tuitionDB`

4. **Start the application**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:5000`
   - The application will be ready to use!

## API Endpoints

### Students
- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Query Parameters
- `page` - Page number for pagination
- `limit` - Number of records per page

## Usage Guide

### Adding a Student
1. Fill in the required fields (Name and Contact)
2. Optionally fill other fields
3. Toggle fees status if paid
4. Click "Save Student"

### Editing a Student
1. Click the edit button (pencil icon) next to any student
2. Modify the information in the form
3. Click "Update Student"

### Deleting a Student
1. Click the delete button (trash icon) next to any student
2. Confirm deletion in the modal dialog
3. Student will be permanently removed

### Searching Students
1. Use the search box in the students table
2. Search by name, class, contact, guardian, or address
3. Results update in real-time

## Database Schema

### Student Collection
```javascript
{
  name: String (required),
  age: Number (min: 3, max: 120),
  guardian: String,
  contact: String (required),
  className: String,
  feesPaid: Boolean (default: false),
  address: String,
  createdAt: Date (default: Date.now)
}
```

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tuitionDB
```

## Development

### Project Structure
```
practical17/
├── public/
│   ├── index.html      # Main HTML file
│   ├── main.js         # Client-side JavaScript
│   └── styles.css      # Custom CSS styles
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # This file
```

### Key Features Implementation
- **Form Validation**: Real-time validation with visual feedback
- **Search Functionality**: Client-side filtering with debouncing
- **Modal Dialogs**: Bootstrap modals for confirmations
- **Responsive Design**: Mobile-first approach with Bootstrap grid
- **Error Handling**: Comprehensive error messages and loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team.

---

**Note**: This application is designed for educational purposes and practical demonstrations. Ensure proper security measures for production use.
