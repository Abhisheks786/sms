import { useState, useEffect } from 'react';
import { getStudents, markAttendance, addMark } from '../services/api';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStudents().then(setStudents).catch(console.error);
  }, []);

  const handleAttendance = async (e) => {
    e.preventDefault();
    try {
      await markAttendance({ studentId: selectedStudent, date: attendanceDate, status: attendanceStatus });
      setMessage('Attendance marked successfully!');
    } catch (err) {
      setMessage('Error marking attendance');
    }
  };

  const handleMarks = async (e) => {
    e.preventDefault();
    try {
      await addMark({ studentId: selectedStudent, subject, score });
      setMessage('Marks added successfully!');
      setSubject('');
      setScore('');
    } catch (err) {
      setMessage('Error adding marks');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Teacher Portal</h2>
      
      {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">{message}</div>}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
        <select 
          value={selectedStudent} 
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          <option value="">-- Choose a Student --</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
        </select>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Attendance Form */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Mark Attendance</h3>
            <form onSubmit={handleAttendance} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Date</label>
                <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Status</label>
                <select value={attendanceStatus} onChange={e => setAttendanceStatus(e.target.value)} className="mt-1 w-full p-2 border rounded">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Submit Attendance</button>
            </form>
          </div>

          {/* Marks Form */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Add Marks</h3>
            <form onSubmit={handleMarks} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g., Mathematics" className="mt-1 w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Score</label>
                <input type="number" value={score} onChange={e => setScore(e.target.value)} required placeholder="Out of 100" className="mt-1 w-full p-2 border rounded" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Submit Marks</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
