import React, { useState, useEffect } from 'react';
import './App.css';

// ========== OOP 角色类 ==========
class User {
  constructor(name, email, role = 'student') {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

// ========== LocalStorage 工具函数 ==========
const saveUserToDB = (name, email, password, role) => {
  const users = JSON.parse(localStorage.getItem('mentorMY_users') || '[]');
  users.push({ name, email, password, role });
  localStorage.setItem('mentorMY_users', JSON.stringify(users));
};

const loginCheck = (email, password) => {
  const users = JSON.parse(localStorage.getItem('mentorMY_users') || '[]');
  return users.find(u => u.email === email && u.password === password);
};

const getMentorsFromDB = () => {
  const defaultMentors = [
    { id: 1, name: 'Aisha Tan', email: 'aisha@mentor.my', major: 'Computer Science', rating: 4.9, desc: 'Web dev expert in Kuching.' },
    { id: 2, name: 'Daniel Lee', email: 'daniel@mentor.my', major: 'Data Science', rating: 4.8, desc: 'Data analysis and Python mentor.' }
  ];
  return JSON.parse(localStorage.getItem('mentorMY_mentors') || JSON.stringify(defaultMentors));
};

const getStoredData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStoredData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ========== 主程序 ==========
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [allMentors] = useState(getMentorsFromDB());
  const [bookingList, setBookingList] = useState(getStoredData('mentorMY_bookings'));
  const [searchTerm, setSearchTerm] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [bookForm, setBookForm] = useState({ date: '', topic: '' });

  useEffect(() => { setStoredData('mentorMY_bookings', bookingList); }, [bookingList]);

  // 登录
  const handleLogin = (email, password) => {
    if (email === 'aisha@mentor.my' && password === 'mentor123') {
      const u = new User('Aisha Tan', email, 'mentor');
      setCurrentUser(u);
      setShowLogin(false);
      setCurrentPage('mentorPanel');
      return;
    }
    const res = loginCheck(email, password);
    if (res) {
      const u = new User(res.name, res.email, res.role);
      setCurrentUser(u);
      setShowLogin(false);
      setCurrentPage(res.role === 'mentor' ? 'mentorPanel' : 'home');
    } else {
      alert('Login failed!');
    }
  };

  // 注册 (核心：支持选择 Student 或 Mentor)
  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.password) return alert('Fill all fields');
    saveUserToDB(regForm.name, regForm.email, regForm.password, regForm.role);
    alert(`Registered successfully as a ${regForm.role}! Please login.`);
    setShowRegister(false);
    setShowLogin(true);
  };

  // 预约
  const submitBooking = () => {
    const newBooking = {
      id: Date.now(),
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      mentorName: selectedMentor.name,
      mentorEmail: selectedMentor.email,
      date: bookForm.date,
      topic: bookForm.topic,
      status: 'Pending'
    };
    setBookingList([...bookingList, newBooking]);
    setShowBookModal(false);
    alert('Booking request sent!');
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookingList(bookingList.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const mentorRequests = bookingList.filter(b => b.mentorEmail === currentUser?.email);
  const myRequests = bookingList.filter(b => b.studentEmail === currentUser?.email);

  return (
    <div className="App" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* 导航栏 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#2563eb', cursor: 'pointer' }} onClick={() => setCurrentPage('landing')}>Mentor MY</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {currentUser ? (
            <>
              {currentUser.role === 'student' && <button onClick={() => setCurrentPage('home')} style={{border:'none', background:'none', cursor:'pointer'}}>Home</button>}
              <button onClick={() => setCurrentPage('mentors')} style={{border:'none', background:'none', cursor:'pointer'}}>Mentors</button>
              <button onClick={() => setCurrentPage('dashboard')} style={{border:'none', background:'none', cursor:'pointer'}}>Dashboard</button>
              {currentUser.role === 'mentor' && (
                <button onClick={() => setCurrentPage('mentorPanel')} style={{ color: '#2563eb', fontWeight: 'bold', border:'none', background:'none', cursor:'pointer' }}>Manage Requests</button>
              )}
              <button onClick={() => { setCurrentUser(null); setCurrentPage('landing'); }} style={{ color: 'red', border:'none', background:'none', cursor:'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} style={{border:'none', background:'none', cursor:'pointer'}}>Login</button>
              <button onClick={() => setShowRegister(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor:'pointer' }}>Join Now</button>
            </>
          )}
        </div>
      </nav>

      {/* 身份提示栏 (调试用) */}
      {currentUser && (
        <div style={{textAlign:'center', background:'#e2e8f0', fontSize:'12px', padding:'5px'}}>
          Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
        </div>
      )}

      {/* 页面内容 */}
      <div style={{ padding: '20px 5%' }}>
        {!currentUser && currentPage === 'landing' && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Mentor MY</h1>
            <p>Your Sarawak-based career growth platform.</p>
          </div>
        )}

        {/* 导师管理页面 */}
        {currentUser?.role === 'mentor' && currentPage === 'mentorPanel' && (
          <div>
            <h2>My Pending Approvals</h2>
            {mentorRequests.length === 0 ? <p>No requests yet.</p> : mentorRequests.map(b => (
              <div key={b.id} style={{ background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #ddd' }}>
                <p><strong>From:</strong> {b.studentName} | <strong>Topic:</strong> {b.topic}</p>
                <p>Date: {b.date} | Status: {b.status}</p>
                {b.status === 'Pending' && (
                  <div>
                    <button onClick={() => updateBookingStatus(b.id, 'Approved')} style={{ background: 'green', color: '#fff', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px' }}>Approve</button>
                    <button onClick={() => updateBookingStatus(b.id, 'Denied')} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Deny</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 导师列表页面 */}
        {currentUser && currentPage === 'mentors' && (
          <div>
            <h2>Browse Mentors</h2>
            <input placeholder="Search major..." onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px', marginBottom: '20px', width: '250px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {allMentors.filter(m => m.major.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                <div key={m.id} style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <h3>{m.name}</h3>
                  <p>{m.major}</p>
                  <button 
                    disabled={currentUser.role === 'mentor'}
                    onClick={() => { setSelectedMentor(m); setShowBookModal(true); }} 
                    style={{ width: '100%', padding: '10px', background: currentUser.role === 'mentor' ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '5px' }}
                  >
                    {currentUser.role === 'mentor' ? 'Students Only' : 'Book Mentor'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 学生 Dashboard */}
        {currentUser && currentPage === 'dashboard' && (
          <div>
            <h2>My Dashboard</h2>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
              <h3>Your Bookings</h3>
              {myRequests.map(b => (
                <div key={b.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <strong>{b.mentorName}</strong> - {b.date} - <span style={{ color: b.status === 'Approved' ? 'green' : 'orange' }}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 注册弹窗 (支持角色选择) */}
      {showRegister && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '320px' }}>
            <h3>Create Account</h3>
            <input placeholder="Full Name" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
            <input placeholder="Email" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
            
            <label style={{fontSize:'12px'}}>I want to be a:</label>
            <select style={{ width: '98%', marginBottom: '15px', padding: '10px' }} value={regForm.role} onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}>
              <option value="student">Student (Finding Mentors)</option>
              <option value="mentor">Mentor (Giving Guidance)</option>
            </select>

            <button onClick={handleRegister} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px' }}>Register</button>
            <button onClick={() => setShowRegister(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '300px' }}>
            <h3>Login</h3>
            <input placeholder="Email" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button onClick={() => handleLogin(loginForm.email, loginForm.password)} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px' }}>Login</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* 预约弹窗 */}
      {showBookModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '300px' }}>
            <h3>Book {selectedMentor?.name}</h3>
            <input type="date" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            <textarea placeholder="Purpose" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setBookForm({ ...bookForm, topic: e.target.value })} />
            <button onClick={submitBooking} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px' }}>Submit Request</button>
            <button onClick={() => setShowBookModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;