import React, { useState, useEffect } from 'react';
import './App.css';

// ========== 1. 基础数据结构 ==========
class User {
  constructor(name, email, role = 'student') {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

// ========== 2. 辅助函数 (模拟数据库) ==========
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
    { id: 2, name: 'Daniel Lee', email: 'daniel@mentor.my', major: 'Data Science', rating: 4.8, desc: 'Data analysis and Python mentor.' },
    { id: 3, name: 'Priya Nair', email: 'priya@mentor.my', major: 'Business', rating: 4.7, desc: 'Startup and SME guidance.' }
  ];
  return JSON.parse(localStorage.getItem('mentorMY_mentors') || JSON.stringify(defaultMentors));
};

// ========== 3. 主程序 ==========
function App() {
  // 状态管理
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  
  // 弹窗控制
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  
  // 数据状态
  const [allMentors] = useState(getMentorsFromDB());
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingList, setBookingList] = useState(JSON.parse(localStorage.getItem('mentorMY_bookings') || '[]'));
  const [searchTerm, setSearchTerm] = useState('');

  // 表单状态
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [bookForm, setBookForm] = useState({ date: '', topic: '' });

  // 监听预约列表变化，同步到本地存储
  useEffect(() => {
    localStorage.setItem('mentorMY_bookings', JSON.stringify(bookingList));
  }, [bookingList]);

  // --- 逻辑处理 ---
  const handleLogin = () => {
    // 快捷导师入口
    if (loginForm.email === 'aisha@mentor.my' && loginForm.password === 'mentor123') {
      const u = new User('Aisha Tan', loginForm.email, 'mentor');
      setCurrentUser(u);
      setShowLogin(false);
      setCurrentPage('mentorPanel');
      return;
    }
    // 普通登录
    const res = loginCheck(loginForm.email, loginForm.password);
    if (res) {
      const u = new User(res.name, res.email, res.role);
      setCurrentUser(u);
      setShowLogin(false);
      setCurrentPage(res.role === 'mentor' ? 'mentorPanel' : 'home');
    } else {
      alert('Email or Password incorrect!');
    }
  };

  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.password) return alert('Please fill in all fields');
    saveUserToDB(regForm.name, regForm.email, regForm.password, regForm.role);
    alert(`Success! You are now a ${regForm.role}. Please login.`);
    setShowRegister(false);
    setShowLogin(true);
  };

  const submitBooking = () => {
    if (!bookForm.date) return alert('Select a date');
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

  // 导师审批逻辑
  const updateStatus = (id, status) => {
    setBookingList(bookingList.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 导航栏 - 始终显示，防止页面“空空如也” */}
      <nav style={{ background: '#fff', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', cursor: 'pointer' }} onClick={() => setCurrentPage('landing')}>
          Mentor MY
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {currentUser ? (
            <>
              <button onClick={() => setCurrentPage(currentUser.role === 'mentor' ? 'mentorPanel' : 'home')} style={navBtnStyle}>Dashboard</button>
              <button onClick={() => setCurrentPage('mentors')} style={navBtnStyle}>Find Mentors</button>
              <button onClick={() => { setCurrentUser(null); setCurrentPage('landing'); }} style={{ ...navBtnStyle, color: 'red' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} style={navBtnStyle}>Login</button>
              <button onClick={() => setShowRegister(true)} style={{ ...navBtnStyle, background: '#2563eb', color: '#fff', borderRadius: '5px', padding: '5px 15px' }}>Join Free</button>
            </>
          )}
        </div>
      </nav>

      {/* 页面内容区 */}
      <main style={{ flex: 1, padding: '40px 5%', zIndex: 5 }}>
        
        {/* 1. 落地页 (未登录时显示) */}
        {!currentUser && currentPage === 'landing' && (
          <div style={{ textAlign: 'center', marginTop: '10vh' }}>
            <h1 style={{ fontSize: '3rem', color: '#1e293b' }}>Welcome to Mentor MY</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Connecting Sarawak's students with professional mentors.</p>
            <div style={{ marginTop: '30px' }}>
              <button onClick={() => setShowRegister(true)} style={heroBtnStyle}>I want to Join</button>
            </div>
          </div>
        )}

        {/* 2. 导师视角：管理面板 */}
        {currentUser?.role === 'mentor' && currentPage === 'mentorPanel' && (
          <div>
            <h2>Mentor Management Panel</h2>
            <p>Welcome back, Coach {currentUser.name}.</p>
            <div style={{ marginTop: '30px' }}>
              <h3>Booking Requests</h3>
              {bookingList.filter(b => b.mentorEmail === currentUser.email).length === 0 ? <p>No requests yet.</p> : 
                bookingList.filter(b => b.mentorEmail === currentUser.email).map(b => (
                  <div key={b.id} style={cardStyle}>
                    <p><strong>Student:</strong> {b.studentName} | <strong>Date:</strong> {b.date}</p>
                    <p><strong>Topic:</strong> {b.topic}</p>
                    <p>Status: <span style={{ fontWeight: 'bold' }}>{b.status}</span></p>
                    {b.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => updateStatus(b.id, 'Approved')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Approve</button>
                        <button onClick={() => updateStatus(b.id, 'Denied')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Deny</button>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* 3. 学生视角：导师列表 */}
        {currentPage === 'mentors' && (
          <div>
            <h2>Available Mentors</h2>
            <input 
              placeholder="Search by major (e.g. Computer Science)" 
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {allMentors.filter(m => m.major.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                <div key={m.id} style={cardStyle}>
                  <h3>{m.name}</h3>
                  <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{m.major}</p>
                  <p>{m.desc}</p>
                  <button 
                    disabled={currentUser?.role === 'mentor'}
                    onClick={() => { 
                      if(!currentUser) return setShowLogin(true);
                      setSelectedMentor(m); 
                      setShowBookModal(true); 
                    }}
                    style={{ width: '100%', padding: '10px', background: currentUser?.role === 'mentor' ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    {currentUser?.role === 'mentor' ? 'Mentors cannot book' : 'Book Session'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- 弹窗组件 (Modals) --- */}

      {/* 注册弹窗：强化方法 B (角色选择) */}
      {showRegister && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0 }}>Create Account</h2>
            <input placeholder="Full Name" style={inputStyle} onChange={(e) => setRegForm({...regForm, name: e.target.value})} />
            <input placeholder="Email" style={inputStyle} onChange={(e) => setRegForm({...regForm, email: e.target.value})} />
            <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setRegForm({...regForm, password: e.target.value})} />
            
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ fontSize: '14px', color: '#64748b' }}>Register as a:</label>
              <select 
                style={{ ...inputStyle, marginTop: '5px' }} 
                value={regForm.role}
                onChange={(e) => setRegForm({...regForm, role: e.target.value})}
              >
                <option value="student">Student (Seeking Guidance)</option>
                <option value="mentor">Mentor (Providing Guidance)</option>
              </select>
            </div>

            <button onClick={handleRegister} style={primaryBtnStyle}>Sign Up</button>
            <button onClick={() => setShowRegister(false)} style={textBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLogin && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0 }}>Login</h2>
            <input placeholder="Email" style={inputStyle} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} />
            <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
            <button onClick={handleLogin} style={primaryBtnStyle}>Login</button>
            <button onClick={() => setShowLogin(false)} style={textBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* 预约弹窗 */}
      {showBookModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Book Session with {selectedMentor?.name}</h3>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px' }}>Preferred Date:</label>
            <input type="date" style={inputStyle} onChange={(e) => setBookForm({...bookForm, date: e.target.value})} />
            <textarea placeholder="What do you want to discuss?" style={{ ...inputStyle, minHeight: '80px' }} onChange={(e) => setBookForm({...bookForm, topic: e.target.value})} />
            <button onClick={submitBooking} style={primaryBtnStyle}>Confirm Booking</button>
            <button onClick={() => setShowBookModal(false)} style={textBtnStyle}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== 样式定义 ==========
const navBtnStyle = { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' };
const heroBtnStyle = { padding: '15px 40px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1.1rem', cursor: 'pointer' };
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContentStyle = { background: '#fff', padding: '30px', borderRadius: '15px', width: '320px', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const primaryBtnStyle = { width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const textBtnStyle = { background: 'none', border: 'none', marginTop: '10px', color: '#64748b', cursor: 'pointer' };

export default App;