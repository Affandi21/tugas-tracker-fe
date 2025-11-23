# 📚 Tugas Tracker - Frontend


## 🎯 Overview

**Tugas Tracker** adalah aplikasi manajemen tugas yang dirancang khusus untuk mahasiswa. Dengan tampilan modern pastel aesthetic dan interface yang intuitif, aplikasi ini membantu mahasiswa mengorganisir mata kuliah, melacak deadline tugas, dan memantau progress belajar dengan mudah.

### ✨ Highlights

- 🎨 **Soft Pastel UI**
- 📱 **Fully Responsive**
- ⚡ **Real-time Updates**
- 🎭 **Smooth Animations**
- 📊 **Visual Progress**
- 🏷️ **Smart Badges**

---

## 🚀 Features

### 📚 Course Management (CRUD)
- ✅ Create, Read, Update, Delete mata kuliah
- ✅ Set SKS dan deskripsi course
- ✅ Auto-generated color themes (5 pastel variations)
- ✅ Real-time task count per course
- ✅ Progress tracking dengan visual indicators

### 📝 Task Management (CRUD)
- ✅ Create, Read, Update, Delete tugas
- ✅ Task status tracking:
  - ⏳ **Pending** - Belum dikerjakan
  - ⚙️ **In Progress** - Sedang dikerjakan
  - ✅ **Completed** - Sudah selesai
- ✅ Deadline management dengan smart warnings
- ✅ Filter tasks by status
- ✅ Overdue & due soon indicators

### 🎨 Modern UI/UX
- ✨ Glassmorphism cards dengan soft shadows
- 🎨 5 pastel color themes (auto-assigned)
- 🌊 Floating animated background shapes
- 💫 Smooth transitions & hover effects
- 📊 Stats dashboard (total courses, tasks, completed)
- 🎭 Friendly empty states
- 🔔 Visual deadline warnings

### 🔗 Backend Integration
- 🔌 RESTful API integration
- 🔄 Real-time data synchronization
- ⚡ Fast API calls with error handling
- 🛡️ Proper loading & error states

---

## 🛠️ Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **React** | 18.x | UI Framework |
| ⚡ **Vite** | 5.x | Build Tool & Dev Server |
| 🎨 **TailwindCSS** | 3.x | Styling & Utilities |
| 🧭 **React Router** | 6.x | SPA Navigation |

### Additional Tools
- 📝 **Plus Jakarta Sans** - Modern typography
- 🎭 **CSS Animations** - Custom keyframes
- 💅 **Inline Styles** - Dynamic theming
- 🎯 **Custom Hooks** - State management

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Affandi21/tugas-tracker-fe.git
cd tugas-tracker-fe
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📂 Project Structure

```
tugas-tracker-fe/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── ristekApi.js         
│   ├── components/
│   │   ├── CourseCard.jsx        
│   │   └── TaskItem.jsx
        └── ConfirmDialog.jsx
        └── GradeCalculator.jsx
│   ├── pages/
│   │   ├── CoursesPage.jsx       
│   │   └── TasksPage.jsx         
│   ├── styles/
│   │   └── global.css
        └── courses.css
        └── tasks.css         
│   ├── App.jsx                   
│   └── main.jsx
    └── index.css                 
├── .env                          
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Key Files Explained

**`src/api/ristekApi.js`**
- Centralized API service
- Handles all HTTP requests
- Error handling & response parsing

**`src/pages/CoursesPage.jsx`**
- Main dashboard
- Course list with CRUD operations
- Stats overview
- Modal forms

**`src/pages/TasksPage.jsx`**
- Task management for specific course
- Filter by status
- Task CRUD operations
- Deadline indicators

**`src/components/CourseCard.jsx`**
- Individual course card
- Progress visualization
- Action buttons (view, edit, delete)

**`src/components/TaskItem.jsx`**
- Individual task item
- Status dropdown
- Deadline badges
- Delete action

---

## 🎨 Design System

### Color Palette

```css
/* Pastel Colors */
--pastel-purple: #CABDFF   /* Soft lavender */
--pastel-blue: #A4D8FF     /* Baby blue */
--pastel-pink: #FFCCE5     /* Cotton candy pink */
--pastel-mint: #CFFFE5     /* Mint green */
--pastel-peach: #FFD4B2    /* Peachy orange */

/* Neutral Colors */
--bg-main: #FAFAFA         /* Off-white background */
--bg-card: #FFFFFF         /* Pure white cards */
--text-primary: #2D3142    /* Dark gray text */
--text-secondary: #6B7280  /* Medium gray text */
```

### Typography

- **Headings:** Plus Jakarta Sans (700-800 weight)
- **Body:** Inter (400-600 weight)
- **Font Sizes:** 
  - H1: 3rem (48px)
  - H2: 2rem (32px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Border Radius

- Small: `16px` (buttons, inputs)
- Medium: `20px` (cards)
- Large: `24px` (modals)
- Full: `9999px` (pills, badges)

---

## 🔌 API Integration

### Base URL
```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### Endpoints Used

#### Mata Kuliah (Courses)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/matkul` | Get all courses | `include=tugas` |
| GET | `/matkul/:id` | Get course by ID | `include=tugas` |
| POST | `/matkul` | Create new course | - |
| PUT | `/matkul/:id` | Update course | - |
| DELETE | `/matkul/:id` | Delete course | - |

#### Tugas (Tasks)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/tugas` | Get all tasks | `mataKuliahId`, `status` |
| POST | `/tugas` | Create new task | - |
| PUT | `/tugas/:id` | Update task | - |
| DELETE | `/tugas/:id` | Delete task | - |

### Request Examples

**Create Course:**
```javascript
POST /api/matkul
Content-Type: application/json

{
  "nama": "Data Structures & Algorithms",
  "deskripsi": "Class B - Prof. Smith",
  "sks": 4
}
```

**Create Task:**
```javascript
POST /api/tugas
Content-Type: application/json

{
  "nama": "Lab Report #1",
  "deskripsi": "Implement Binary Search Tree",
  "deadline": "2025-12-01T00:00:00.000Z",
  "mataKuliahId": "uuid-here",
  "status": "BELUM_DIKERJAKAN"
}
```

**Update Task Status:**
```javascript
PUT /api/tugas/:id
Content-Type: application/json

{
  "nama": "Lab Report #1",
  "deskripsi": "Implement Binary Search Tree",
  "deadline": "2025-12-01T00:00:00.000Z",
  "mataKuliahId": "uuid-here",
  "status": "SELESAI"
}
```

---

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start dev server (port 5173)
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

Create a `.env` file with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api


```

**⚠️ Important:** 
- Always prefix with `VITE_` for Vite to expose to client
- Never commit `.env` to version control
- Use `.env.example` for documentation

---

## 📱 Responsive Breakpoints

```css
mobile:  < 768px     
tablet:  768px-1024px 
desktop: > 1024px    
```

All components are fully responsive with:
- Flexible grid layouts
- Touch-friendly buttons (min 44px)
- Stacked forms on mobile
- Optimized font sizes

---

## 🎭 Features Showcase

### 1. Dashboard View
- Clean header with app branding
- Stats cards showing overview
- Grid of course cards
- Floating action button
- Empty state illustration

### 2. Course Cards
- Unique pastel theme per course
- Progress bar with shimmer
- Task count indicator
- Quick action buttons
- Hover effects

### 3. Task Management
- Comprehensive stats overview
- Filter pills for status
- Task cards with badges
- Status dropdown
- Deadline warnings (overdue, due soon)

### 4. Forms & Modals
- Centered overlay modals
- Glassmorphic backgrounds
- Smooth animations
- Form validation
- Success/error feedback

---



## 👨‍💻 Author

**Your Name**
- GitHub: [@Affandi21](https://github.com/Affandi21)

---

## 🙏 Acknowledgments

- RISTEK Fasilkom UI - Open Class Web Development 2025
- Checkpoint project for learning React & backend integration

---