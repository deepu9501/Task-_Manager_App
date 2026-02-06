# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd Task_Manager_App/backend
npm install

# Frontend (in new terminal)
cd Task_Manager_App/frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Edit `Task_Manager_App/backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

**Frontend** - Already configured in `Task_Manager_App/frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd Task_Manager_App/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Task_Manager_App/frontend
npm run dev
```

### Step 4: Open Browser

Navigate to: **http://localhost:5173**

---

## 🎯 First Time Setup

1. **Register Account:**
   - Click "Create one" on login page
   - Fill in your details
   - Click "Create Account"

2. **Create Your First Task:**
   - Click "Add Task" button
   - Fill in task details
   - Click "Create Task"

3. **Explore Features:**
   - ✅ Dashboard - View statistics
   - ✅ Tasks - Manage all tasks
   - ✅ Profile - View your info

---

## 📋 What Was Fixed

✅ **Login Page** - Now fully functional
✅ **Register Page** - Complete with validation
✅ **Error Boundary** - Catches runtime errors
✅ **Environment Config** - Proper .env setup
✅ **Error Handling** - Backend middleware added

---

## 📚 Documentation

- **FIXES_APPLIED.md** - What was fixed and why
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **TESTING_GUIDE.md** - How to test everything
- **README.md** - Full project documentation

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in `.env`
- Make sure port 5000 is available

**Frontend won't start?**
- Run `npm install` again
- Check port 5173 is available

**Can't login?**
- Register a new account first
- Check backend is running
- Check browser console for errors

**Tasks not loading?**
- Check MongoDB is connected
- Check you're logged in
- Check backend console for errors

---

## ✅ Ready to Go!

Your Task Manager App is now fully functional with:

- 🔐 Complete authentication system
- 📝 Full CRUD operations for tasks
- 🎨 Beautiful, responsive UI
- 🛡️ Error handling and boundaries
- ⚙️ Environment-based configuration

**Happy task managing! 🎉**
