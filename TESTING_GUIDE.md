# 🧪 Testing Guide

## Quick Start Testing

### 1. Start the Application

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

---

## 🔐 Authentication Testing

### Test Registration Flow

1. **Navigate to Register:**
   - Open: `http://localhost:5173/register`

2. **Test Form Validation:**
   ```
   ❌ Leave name empty → Should show "Name is required"
   ❌ Enter invalid email → Should show "Email is invalid"
   ❌ Enter password < 6 chars → Should show error
   ❌ Passwords don't match → Should show error
   ✅ Fill all correctly → Should create account
   ```

3. **Test Successful Registration:**
   ```
   Name: John Doe
   Email: john@example.com
   Password: password123
   Confirm: password123
   
   Expected: 
   - Success toast
   - Redirect to dashboard
   - User logged in
   ```

### Test Login Flow

1. **Navigate to Login:**
   - Open: `http://localhost:5173/login`

2. **Test Form Validation:**
   ```
   ❌ Invalid email format → Error message
   ❌ Password < 6 chars → Error message
   ❌ Wrong credentials → "Invalid credentials"
   ✅ Correct credentials → Login success
   ```

3. **Test Successful Login:**
   ```
   Email: john@example.com
   Password: password123
   
   Expected:
   - Success toast "Welcome back!"
   - Redirect to dashboard
   - User info in navbar
   ```

---

## 📋 Task Management Testing

### Create Task

1. **Navigate to Tasks:**
   - Click "Tasks" in navbar
   - Or go to: `http://localhost:5173/tasks`

2. **Click "Add Task" button**

3. **Fill Form:**
   ```
   Title: Complete project documentation
   Description: Write comprehensive docs
   Category: Work
   Priority: High
   Due Date: Tomorrow
   ```

4. **Expected:**
   - Success toast
   - Task appears in list
   - Modal closes

### Update Task

1. **Click edit icon** on any task
2. **Modify fields**
3. **Click "Update Task"**
4. **Expected:**
   - Success toast
   - Task updated in list

### Complete Task

1. **Click checkbox** on any task
2. **Expected:**
   - Task marked complete
   - Visual change (opacity, strikethrough)
   - Success toast

### Delete Task

1. **Click trash icon** on any task
2. **Confirm deletion**
3. **Expected:**
   - Confirmation modal
   - Task removed from list
   - Success toast

### Filter Tasks

1. **Test Search:**
   - Type in search box
   - Tasks filter in real-time

2. **Test Filters:**
   - Click "Filters" button
   - Select status/category/priority
   - Tasks filter accordingly

---

## 🎨 Dashboard Testing

### Navigate to Dashboard

1. **Go to:** `http://localhost:5173/dashboard`

2. **Verify Display:**
   ```
   ✅ Welcome message with user name
   ✅ Task statistics (total, completed, pending)
   ✅ Completion rate circle
   ✅ Upcoming tasks list
   ✅ Quick action buttons
   ```

3. **Test Quick Actions:**
   - Click "Add New Task" → Opens task modal
   - Click "View All Tasks" → Goes to tasks page
   - Click "Pending Tasks" → Filters pending
   - Click "High Priority" → Filters high priority

---

## 👤 Profile Testing

### Navigate to Profile

1. **Go to:** `http://localhost:5173/profile`

2. **Verify Display:**
   ```
   ✅ User avatar with initial
   ✅ User name and email
   ✅ Member since date
   ✅ Task statistics
   ✅ Completion rate
   ✅ Achievement level
   ```

3. **Test Logout:**
   - Click "Logout" button
   - Expected: Redirect to login page

---

## 🛡️ Protected Routes Testing

### Test Authentication Guard

1. **Logout** if logged in

2. **Try accessing protected routes:**
   ```
   http://localhost:5173/dashboard
   http://localhost:5173/tasks
   http://localhost:5173/profile
   ```

3. **Expected:**
   - Redirect to `/login`
   - After login, redirect back to original page

---

## 🚨 Error Boundary Testing

### Test Error Handling

1. **Temporarily add error to a component:**
   ```javascript
   // In Dashboard.jsx or any component
   useEffect(() => {
       throw new Error('Test error boundary');
   }, []);
   ```

2. **Navigate to that page**

3. **Expected:**
   - Error boundary catches error
   - Shows friendly error UI
   - "Reload Page" and "Go Home" buttons work
   - Console shows error details

4. **Remove test error after testing**

---

## 🌐 API Testing

### Test Backend Endpoints

**Using Browser/Postman:**

1. **Register:**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   Response: { token, user }
   ```

3. **Get Current User:**
   ```
   GET http://localhost:5000/api/auth/me
   Headers: Authorization: Bearer <token>
   ```

4. **Create Task:**
   ```
   POST http://localhost:5000/api/tasks
   Headers: Authorization: Bearer <token>
   Body: {
     "title": "Test Task",
     "description": "Test Description",
     "category": "Work",
     "priority": "High"
   }
   ```

5. **Get Tasks:**
   ```
   GET http://localhost:5000/api/tasks
   Headers: Authorization: Bearer <token>
   ```

---

## 📱 Responsive Design Testing

### Test Different Screen Sizes

1. **Desktop (1920x1080):**
   - All features visible
   - Proper spacing
   - Multi-column layouts

2. **Tablet (768x1024):**
   - Responsive grid
   - Navbar adapts
   - Touch-friendly buttons

3. **Mobile (375x667):**
   - Mobile menu works
   - Single column layout
   - All features accessible

**Test in Chrome DevTools:**
- Press F12
- Click device toolbar icon
- Test different devices

---

## ✅ Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] Protected routes redirect
- [ ] Form validation works
- [ ] Error messages display

### Task Management
- [ ] Create task
- [ ] View all tasks
- [ ] Update task
- [ ] Delete task
- [ ] Mark complete/incomplete
- [ ] Search tasks
- [ ] Filter by status
- [ ] Filter by category
- [ ] Filter by priority

### Dashboard
- [ ] Statistics display correctly
- [ ] Upcoming tasks show
- [ ] Quick actions work
- [ ] Completion rate accurate

### Profile
- [ ] User info displays
- [ ] Task stats accurate
- [ ] Achievement level shows
- [ ] Logout works

### UI/UX
- [ ] Animations smooth
- [ ] Loading states show
- [ ] Toast notifications work
- [ ] Responsive on mobile
- [ ] No console errors

### Error Handling
- [ ] Error boundary catches errors
- [ ] API errors show toast
- [ ] Form validation works
- [ ] 404 redirects properly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:** 
- Check backend is running on port 5000
- Check `.env` has correct `VITE_API_URL`
- Check CORS is enabled in backend

### Issue: "Token expired" or "Unauthorized"
**Solution:**
- Logout and login again
- Check JWT_SECRET matches in backend
- Check token is saved in localStorage

### Issue: "Tasks not loading"
**Solution:**
- Check MongoDB connection
- Check user is authenticated
- Check browser console for errors

### Issue: "Styles not loading"
**Solution:**
- Run `npm install` in frontend
- Check Tailwind CSS is configured
- Clear browser cache

---

## 📊 Expected Results

### After Complete Testing:

✅ **Authentication:** Users can register, login, and logout
✅ **Task CRUD:** All operations work smoothly
✅ **Filtering:** Search and filters work correctly
✅ **Dashboard:** Shows accurate statistics
✅ **Profile:** Displays user info and stats
✅ **Responsive:** Works on all screen sizes
✅ **Error Handling:** Graceful error messages
✅ **Performance:** Fast and smooth animations

---

**Happy Testing! 🚀**
