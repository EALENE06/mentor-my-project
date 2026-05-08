import React, { useState, useEffect } from 'react';
import './App.css';

// ========== OOP 角色类 ==========
class User {
  constructor(name, email, role = 'student', phone = '', school = '', bio = '') {
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.school = school;
    this.bio = bio;
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
    { id: 1, name: 'Aisha Tan', email: 'aisha@mentor.my', major: 'Computer Science', rating: 4.9, location: 'Kuching', desc: 'Guidance on web dev and tech career.' },
    { id: 2, name: 'Daniel Lee', email: 'daniel@mentor.my', major: 'Data Science', rating: 4.8, location: 'Miri', desc: 'Python and data analysis advice.' },
    { id: 3, name: 'Priya Nair', email: 'priya@mentor.my', major: 'Business', rating: 4.7, location: 'Sibu', desc: 'Startup and SME guidance.' }
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

  // 持久化存储
  useEffect(() => { setStoredData('mentorMY_bookings', bookingList); }, [bookingList]);

  // 登录逻辑
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
      alert('Login failed. Please check your credentials.');
    }
  };

  // 注册逻辑
  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.password) return alert('Fill all fields');
    saveUserToDB(regForm.name, regForm.email, regForm.password, regForm.role);
    alert('Register success! Now please login.');
    setShowRegister(false);
    setShowLogin(true);
  };

  // 预约逻辑
  const submitBooking = () => {
    if(!bookForm.date || !bookForm.topic) return alert('Please fill in date and topic');
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
    setBookForm({ date: '', topic: '' });
    alert('Request sent to mentor!');
  };

  // 审批逻辑
  const updateBookingStatus = (id, newStatus) => {
    const updated = bookingList.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookingList(updated);
  };

  // 计算属性
  const mentorPendingCount = bookingList.filter(b => b.mentorEmail === currentUser?.email && b.status === 'Pending').length;
  const myRequests = bookingList.filter(b => b.studentEmail === currentUser?.email);
  const mentorRequests = bookingList.filter(b => b.mentorEmail === currentUser?.email);

  return (
    <div className="App" style={{ background: '#f4f7fe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* 导航栏 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 5%', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#2563eb', cursor: 'pointer' }} onClick={() => setCurrentPage('landing')}>Mentor MY</div>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          {currentUser ? (
            <>
              <li onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>Home</li>
              <li onClick={() => setCurrentPage('mentors')} style={{ cursor: 'pointer' }}>Mentors</li>
              <li onClick={() => setCurrentPage('dashboard')} style={{ cursor: 'pointer' }}>Dashboard</li>
              {currentUser.role === 'mentor' && (
                <li onClick={() => setCurrentPage('mentorPanel')} style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>
                  Requests {mentorPendingCount > 0 && <span style={{ background: 'red', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '12px' }}>{mentorPendingCount}</span>}
                </li>
              )}
              <li onClick={() => { setCurrentUser(null); setCurrentPage('landing'); }} style={{ color: 'red', cursor: 'pointer' }}>Logout</li>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Login</button>
              <button onClick={() => setShowRegister(true)} style={{ background: '#2563eb', color: '#fff', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Join Free</button>
            </>
          )}
        </ul>
      </nav>

      {/* 核心内容渲染 */}
      <main>
        {!currentUser && currentPage === 'landing' && (
          <header style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1>Unlock Your Potential with <span style={{color:'#2563eb'}}>Sarawak Mentors</span></h1>
            <p>Connect with industry leaders and accelerate your career.</p>
            <button onClick={() => setShowRegister(true)} style={{ padding: '15px 40px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Get Started</button>
          </header>
        )}

        {currentUser && currentPage === 'home' && (
          <div style={{ padding: '40px 5%', textAlign: 'center' }}>
            <h2>Hello, {currentUser.name}!</h2>
            <p>Welcome to your mentoring dashboard.</p>
            <button onClick={() => setCurrentPage('mentors')} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px' }}>Find a Mentor</button>
          </div>
        )}

        {currentUser?.role === 'mentor' && currentPage === 'mentorPanel' && (
          <div style={{ padding: '40px 5%' }}>
            <h2>Incoming Booking Requests</h2>
            {mentorRequests.length === 0 ? <p>No requests found.</p> : mentorRequests.map(b => (
              <div key={b.id} style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h4>From: {b.studentName}</h4>
                <p>Topic: {b.topic} | Date: {b.date} | Status: <strong>{b.status}</strong></p>
                {b.status === 'Pending' && (
                  <div>
                    <button onClick={() => updateBookingStatus(b.id, 'Approved')} style={{ background: 'green', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', marginRight: '10px' }}>Approve</button>
                    <button onClick={() => updateBookingStatus(b.id, 'Denied')} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px' }}>Deny</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {currentUser && currentPage === 'mentors' && (
          <div style={{ padding: '40px 5%' }}>
            <h2>Find Mentors</h2>
            <input placeholder="Search major..." onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', width: '300px', marginBottom: '20px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {allMentors.filter(m => m.major.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                <div key={m.id} style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <h3>{m.name}</h3>
                  <p>{m.major} | ⭐ {m.rating}</p>
                  <button onClick={() => { setSelectedMentor(m); setShowBookModal(true); }} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px' }}>Book Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUser && currentPage === 'dashboard' && (
          <div style={{ padding: '40px 5%' }}>
            <h2>My Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '15px' }}>
                <h3>Profile</h3>
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '15px' }}>
                <h3>My Booking Status</h3>
                {myRequests.map(b => (
                  <div key={b.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <strong>{b.mentorName}</strong> - {b.date} - <span style={{ color: b.status === 'Approved' ? 'green' : 'orange' }}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 弹窗部分 */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '300px' }}>
            <h3>Login</h3>
            <input placeholder="Email" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button onClick={() => handleLogin(loginForm.email, loginForm.password)} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff' }}>Login</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      {showRegister && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '300px' }}>
            <h3>Register</h3>
            <input placeholder="Name" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
            <input placeholder="Email" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
            <select style={{ width: '98%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
            <button onClick={handleRegister} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff' }}>Register</button>
            <button onClick={() => setShowRegister(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      {showBookModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '300px' }}>
            <h3>Book Session</h3>
            <input type="date" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            <textarea placeholder="Topic" style={{ width: '90%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setBookForm({ ...bookForm, topic: e.target.value })} />
            <button onClick={submitBooking} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff' }}>Submit</button>
            <button onClick={() => setShowBookModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;