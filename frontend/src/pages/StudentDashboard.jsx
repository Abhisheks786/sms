import { useState, useEffect } from 'react';
import { getMyAttendance, getMyMarks } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const studentId = localStorage.getItem('adminToken') ? JSON.parse(atob(localStorage.getItem('adminToken').split('.')[1])).id : null;

  useEffect(() => {
    if (studentId) {
      getMyAttendance(studentId).then(setAttendance).catch(console.error);
      getMyMarks(studentId).then(setMarks).catch(console.error);
    }
  }, [studentId]);

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const totalClasses = attendance.length;
  const attendancePercentage = totalClasses ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-600">Student Portal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-800">Overall Attendance</h3>
          <p className="text-4xl font-bold text-teal-600 mt-2">{attendancePercentage}%</p>
          <p className="text-sm text-teal-600 mt-1">Present: {presentCount} / {totalClasses} classes</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Total Subjects Graded</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{marks.length}</p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Academic Performance Graph</h3>
        <div className="bg-gray-50 p-4 rounded-lg" style={{ height: 300 }}>
          {marks.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" name="Score Obtained" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center mt-10">No marks recorded yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Recent Attendance</h3>
          <ul className="space-y-2">
            {attendance.slice(0, 5).map(a => (
              <li key={a._id} className="flex justify-between p-3 border rounded shadow-sm">
                <span>{new Date(a.date).toLocaleDateString()}</span>
                <span className={a.status === 'Present' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{a.status}</span>
              </li>
            ))}
            {attendance.length === 0 && <p className="text-gray-500">No attendance records.</p>}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Marks Table</h3>
          <ul className="space-y-2">
            {marks.map(m => (
              <li key={m._id} className="flex justify-between p-3 border rounded shadow-sm bg-gray-50">
                <span className="font-semibold">{m.subject}</span>
                <span>{m.score} / {m.maxScore}</span>
              </li>
            ))}
            {marks.length === 0 && <p className="text-gray-500">No marks recorded.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
