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
    { id: 1, name: 'Aisha Tan', email: 'aisha@mentor.my', major: 'Computer Science', lang: 'English, Malay', rating: 4.9, location: 'Kuching', desc: 'Guidance on web dev and tech career.' },
    { id: 2, name: 'Daniel Lee', email: 'daniel@mentor.my', major: 'Data Science', lang: 'English, Malay', rating: 4.8, location: 'Miri', desc: 'Python and data analysis advice.' },
    { id: 3, name: 'Priya Nair', email: 'priya@mentor.my', major: 'Business', lang: 'English, Malay', rating: 4.7, location: 'Sibu', desc: 'Startup and SME guidance.' }
  ];
  return JSON.parse(localStorage.getItem('mentorMY_mentors') || JSON.stringify(defaultMentors));
};

const getStoredData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStoredData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ========== 主程序 ==========
function App() {
  // 页面转换状态
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  
  // 弹窗状态
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);

  // 数据状态
  const [allMentors] = useState(getMentorsFromDB());
  const [bookingList, setBookingList] = useState(getStoredData('mentorMY_bookings'));
  const [savedMentors, setSavedMentors] = useState(getStoredData('mentorMY_saved'));
  const [searchTerm, setSearchTerm] = useState('');

  // 表单状态
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [editForm, setEditForm] = useState({ name: '', phone: '', school: '', bio: '' });
  const [bookForm, setBookForm] = useState({ date: '', topic: '' });

  const pathways = [
    { id: 1, title: 'Computer Science', icon: '💻', desc: 'Build software & AI systems.', demand: 'High demand in Sarawak', skills: ['Python', 'JS', 'SQL'] },
    { id: 2, title: 'Business', icon: '📊', desc: 'Corporate & startup path.', demand: 'Stable for local SMEs', skills: ['Marketing', 'Finance'] }
  ];

  // 持久化存储
  useEffect(() => { setStoredData('mentorMY_bookings', bookingList); }, [bookingList]);
  useEffect(() => { setStoredData('mentorMY_saved', savedMentors); }, [savedMentors]);

  // 登录逻辑
  const handleLogin = (email, password) => {
    // 预设导师快捷登录
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
    alert('Request sent to mentor!');
  };

  // 审批逻辑 (导师端)
  const updateBookingStatus = (id, newStatus) => {
    const updated = bookingList.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookingList(updated);
  };

  // 数据过滤
  const mentorPendingCount = bookingList.filter(b => b.mentorEmail === currentUser?.email && b.status === 'Pending').length;
  const myRequests = bookingList.filter(b => b.studentEmail === currentUser?.email);
  const mentorRequests = bookingList.filter(b => b.mentorEmail === currentUser?.email);

  return (
    <div className="App" style={{ background: '#f4f7fe', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* 导航栏 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 5%', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#2563eb', cursor: 'pointer' }} onClick={() => setCurrentPage('landing')}>Mentor MY</div>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <li onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>Home</li>
              <li onClick={() => setCurrentPage('mentors')} style={{ cursor: 'pointer' }}>Find Mentors</li>
              <li onClick={() => setCurrentPage('dashboard')} style={{ cursor: 'pointer' }}>Dashboard</li>
              {currentUser.role === 'mentor' && (
                <li onClick={() => setCurrentPage('mentorPanel')} style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>
                  Manage Requests {mentorPendingCount > 0 && <span style={{ background: 'red', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '12px' }}>{mentorPendingCount}</span>}
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

      {/* 落地页 (未登录) */}
      {!currentUser && currentPage === 'landing' && (
        <header style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Unlock Your Potential with <br/><span style={{color:'#2563eb'}}>Sarawak Mentors</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>Connect with industry leaders in Kuching, Miri, and Sibu.</p>
          <button onClick={() => setShowRegister(true)} style={{ padding: '15px 40px', fontSize: '1.1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Get Started Now</button>
        </header>
      )}

      {/* 导师面板 (导师专用) */}
      {currentUser?.role === 'mentor' && currentPage === 'mentorPanel' && (
        <div style={{ padding: '40px 5%' }}>
          <h2>Incoming Booking Requests</h2>
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {mentorRequests.length === 0 && <p>No requests yet.</p>}
            {mentorRequests.map(b => (
              <div key={b.id} style={{ background: '#fff', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div>
                  <h4 style={{ margin: 0 }}>From: {b.studentName}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>Topic: {b.topic} | Date: {b.date}</p>
                  <span style={{ fontWeight: 'bold', color: b.status === 'Approved' ? 'green' : b.status === 'Denied' ? 'red' : 'orange' }}>{b.status}</span>
                </div>
                {b.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => updateBookingStatus(b.id, 'Approved')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px' }}>Approve</button>
                    <button onClick={() => updateBookingStatus(b.id, 'Denied')} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px' }}>Deny</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 导师列表 (学生专用) */}
      {currentUser && currentPage === 'mentors' && (
        <div style={{ padding: '40px 5%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Available Mentors</h2>
            <input placeholder="Search major or name..." onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '300px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {allMentors.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.major.toLowerCase().includes(searchTerm.toLowerCase())).map(m => {
              const isPending = bookingList.some(b => b.mentorEmail === m.email && b.studentEmail === currentUser.email && b.status === 'Pending');
              return (
                <div key={m.id} style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{m.name[0]}</div>
                    <div>
                      <h3 style={{ margin: 0 }}>{m.name}</h3>
                      <p style={{ margin: 0, color: '#666' }}>{m.major} • ⭐ {m.rating}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{m.desc}</p>
                  <button 
                    disabled={isPending || currentUser.role === 'mentor'} 
                    onClick={() => { setSelectedMentor(m); setShowBookModal(true); }} 
                    style={{ width: '100%', marginTop: '15px', padding: '10px', background: isPending ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: isPending ? 'not-allowed' : 'pointer' }}
                  >
                    {isPending ? 'Request Pending' : currentUser.role === 'mentor' ? 'Switch to Student Account' : 'Book Session'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 学生 Dashboard */}
      {currentUser && currentPage === 'dashboard' && (
        <div style={{ padding: '40px 5%', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px' }}>
            <h3>My Profile</h3>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Role:</strong> {currentUser.role.toUpperCase()}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <button onClick={() => setShowEditModal(true)} style={{ width: '100%', padding: '10px', border: '1px solid #2563eb', color: '#2563eb', background: 'none', borderRadius: '8px', marginTop: '10px' }}>Edit Details</button>
          </div>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px' }}>
            <h3>My Bookings</h3>
            {myRequests.length === 0 && <p>You haven't booked any sessions yet.</p>}
            {myRequests.map(b => (
              <div key={b.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{b.mentorName}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{b.date} • {b.topic}</p>
                </div>
                <div style={{ fontWeight: 'bold', color: b.status === 'Approved' ? 'green' : b.status === 'Denied' ? 'red' : 'orange' }}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLogin && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', width: '350px' }}>
            <h2 style={{ marginTop: 0 }}>Welcome Back</h2>
            <input placeholder="Email" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button onClick={() => handleLogin(loginForm.email, loginForm.password)} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>Login</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* 注册弹窗 (带角色选择) */}
      {showRegister && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', width: '350px' }}>
            <h2 style={{ marginTop: 0 }}>Create Account</h2>
            <input placeholder="Full Name" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
            <input placeholder="Email" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
            <div style={{ margin: '10px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Join as:</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}>
                <option value="student">Student (Want to learn)</option>
                <option value="mentor">Mentor (Want to teach)</option>
              </select>
            </div>
            <button onClick={handleRegister} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>Create Account</button>
            <button onClick={() => setShowRegister(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* 预约弹窗 */}
      {showBookModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', width: '350px' }}>
            <h3>Book {selectedMentor?.name}</h3>
            <input type="date" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            <textarea placeholder="What do you want to discuss?" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }} onChange={(e) => setBookForm({ ...bookForm, topic: e.target.value })} />
            <button onClick={submitBooking} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>Confirm Booking</button>
            <button onClick={() => setShowBookModal(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: '#666' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;