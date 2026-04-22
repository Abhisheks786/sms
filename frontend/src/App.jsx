import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('adminToken');
  const role = localStorage.getItem('userRole');
  
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  
  return children;
};

const DashboardContainer = ({ children }) => {
  const name = localStorage.getItem('userName');
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            SMS | <span className="capitalize text-blue-600">{role} Portal</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Hello, {name}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardContainer><AdminDashboard /></DashboardContainer>
          </ProtectedRoute>
        } />

        {/* Teacher Route */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardContainer><TeacherDashboard /></DashboardContainer>
          </ProtectedRoute>
        } />

        {/* Student Route */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardContainer><StudentDashboard /></DashboardContainer>
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={
          <ProtectedRoute>
            <RoleRedirect />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

const RoleRedirect = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;
  if (role === 'student') return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
}

export default App;
