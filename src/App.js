import React, { useState, useEffect } from 'react';
import './App.css';

// ========== OOP 角色类 ==========
class User {
  constructor(name, email, phone = '', school = '', bio = '', role = 'student') {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.school = school;
    this.bio = bio;
    this.role = role;
  }

  getRoleInfo() {
    return this.role === 'mentor' ? "Mentor: Manage own booking requests" : "Student: Find & book mentors";
  }
}

// ========== LocalStorage 工具函数 ==========
const saveUserToDB = (name, email, password, role = 'student') => {
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
    { id: 1, name: 'Aisha Tan', email: 'aisha@mentor.my', major: 'Computer Science', lang: 'English, Malay', rating: 4.9, location: 'Kuching', industry: 'Tech', company: 'Sarawak Digital Economy', desc: 'Guidance on web dev and tech career in Sarawak.' },
    { id: 2, name: 'Daniel Lee', email: 'daniel@mentor.my", major: 'Data Science', lang: 'English, Malay', rating: 4.8, location: 'Miri', industry: 'Data / Oil & Gas', company: 'Local Energy Firm', desc: 'Python, data analysis and industry career advice.' },
    { id: 3, name: 'Priya Nair', email: 'priya@mentor.my', major: 'Business', lang: 'English, Malay, Tamil', rating: 4.7, location: 'Sibu', industry: 'Business / SME', company: 'Local Business Consultant', desc: 'Business study and startup guidance.' }
  ];
  return JSON.parse(localStorage.getItem('mentorMY_mentors') || JSON.stringify(defaultMentors));
};

const saveBookingsToDB = (list) => {
  localStorage.setItem('mentorMY_bookings', JSON.stringify(list));
};

const getBookingsFromDB = () => {
  return JSON.parse(localStorage.getItem('mentorMY_bookings') || '[]');
};

const saveSavedToDB = (list) => {
  localStorage.setItem('mentorMY_saved', JSON.stringify(list));
};

const getSavedFromDB = () => {
  return JSON.parse(localStorage.getItem('mentorMY_saved') || '[]');
};

// 预设导师账号（独立分支，Netlify 直接生效）
const MENTOR_DEFAULT_ACC = {
  email: 'aisha@mentor.my',
  password: 'mentor123',
  name: 'Aisha Tan',
  role: 'mentor'
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [allMentors, setAllMentors] = useState(getMentorsFromDB());
  const [bookingList, setBookingList] = useState(getBookingsFromDB());
  const [savedMentors, setSavedMentors] = useState(getSavedFromDB());

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '' });
  const [landingRegForm, setLandingRegForm] = useState({ name: '', email: '', password: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', school: '', bio: '' });
  const [bookForm, setBookForm] = useState({ date: '', topic: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const pathways = [
    { id: 1, title: 'Computer Science', icon: '💻', desc: 'Build software, web app, AI systems.', demand: 'High demand in Sarawak Digital Economy', skills: ['Python', 'JS', 'SQL', 'UI/UX'] },
    { id: 2, title: 'Business & Accounting', icon: '📊', desc: 'Corporate, banking, startup path.', demand: 'Stable demand for local SMEs', skills: ['Marketing', 'Finance', 'Management'] },
    { id: 3, title: 'Engineering', icon: '🔧', desc: 'Oil & gas, civil, electrical field.', demand: 'Strong demand in Sarawak industry', skills: ['Math', 'Design', 'Site Operation'] },
    { id: 4, title: 'Medical & Health', icon: '🩺', desc: 'Nurse, doctor, pharmacy career.', demand: 'Permanent public sector need', skills: ['Biology', 'Chemistry', 'Carework'] }
  ];

  useEffect(() => { saveBookingsToDB(bookingList); }, [bookingList]);
  useEffect(() => { saveSavedToDB(savedMentors); }, [savedMentors]);

  const filteredMentors = allMentors.filter(m =>
    m.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 登录逻辑（已修复）
  const handleLogin = (email, password) => {
    if (email === MENTOR_DEFAULT_ACC.email && password === MENTOR_DEFAULT_ACC.password) {
      const mentorUser = new User(MENTOR_DEFAULT_ACC.name, email, '', '', '', 'mentor');
      setCurrentUser(mentorUser);
      setShowLogin(false);
      setCurrentPage('mentorPanel');
      setLoginForm({ email: '', password: '' });
      return;
    }
    const res = loginCheck(email, password);
    if (!res) {
      alert('Email or password incorrect! Please register first.');
      return;
    }
    const user = new User(res.name, res.email, '', '', '', res.role);
    setCurrentUser(user);
    setShowLogin(false);
    setLoginForm({ email: '', password: '' });
    setCurrentPage('home');
  };

  const handleRegister = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('mentorMY_users') || '[]');
    if (users.some(u => u.email === email)) {
      alert('Email already registered');
      return;
    }
    saveUserToDB(name, email, password, 'student');
    alert('Register success! Please login');
    setLandingRegForm({ name: '', email: '', password: '' });
    setRegForm({ name: '', email: '', password: '' });
    setShowLogin(true);
  };

  const submitBooking = () => {
    if (!bookForm.date || !bookForm.topic) {
      alert('Please fill date and topic');
      return;
    }
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
    alert('Booking sent, waiting mentor approval');
  };

  const handleApprove = (bookingId) => {
    const updated = bookingList.map(item =>
      item.id === bookingId ? { ...item, status: 'Approved' } : item
    );
    setBookingList(updated);
  };

  const handleDeny = (bookingId) => {
    const updated = bookingList.map(item =>
      item.id === bookingId ? { ...item, status: 'Denied' } : item
    );
    setBookingList(updated);
  };

  const getMyBookingRequests = () => {
    if (!currentUser || currentUser.role !== 'mentor') return [];
    return bookingList.filter(b => b.mentorEmail === currentUser.email);
  };

  const getMyStudentBookings = () => {
    if (!currentUser || currentUser.role !== 'student') return [];
    return bookingList.filter(b => b.studentEmail === currentUser.email);
  };

  const toggleSaveMentor = (mentor) => {
    const exist = savedMentors.some(item => item.id === mentor.id);
    if (exist) {
      setSavedMentors(savedMentors.filter(item => item.id !== mentor.id));
    } else {
      setSavedMentors([...savedMentors, mentor]);
    }
  };

  const saveProfileEdit = () => {
    const updatedUser = new User(
      editForm.name,
      currentUser.email,
      editForm.phone,
      editForm.school,
      editForm.bio,
      currentUser.role
    );
    setCurrentUser(updatedUser);
    setShowEditModal(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      <nav className="navbar" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 3rem',background:'#fff',boxShadow:'0 2px 8px #00000015'}}>
        <div className="logo" style={{fontWeight:'bold',fontSize:'1.3rem'}}>Mentor MY</div>
        <ul style={{display:'flex',gap:'1.5rem',listStyle:'none',margin:0,padding:0}}>
          {currentUser ? (
            <>
              <li><button onClick={()=>setCurrentPage('home')} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Home</button></li>
              <li><button onClick={()=>setCurrentPage('mentors')} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Mentors</button></li>
              <li><button onClick={()=>setCurrentPage('pathways')} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Career Path</button></li>
              <li><button onClick={()=>setCurrentPage('dashboard')} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Dashboard</button></li>
              {currentUser.role === 'mentor' && (
                <li><button onClick={()=>setCurrentPage('mentorPanel')} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem',color:'#2563eb'}}>Mentor Panel</button></li>
              )}
              <li><button onClick={logout} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem',color:'#dc2626'}}>Logout</button></li>
            </>
          ) : (
            <>
              <li><button onClick={()=>setShowLogin(true)} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Login</button></li>
              <li><button onClick={()=>setShowRegister(true)} style={{border:'none',background:'none',cursor:'pointer',fontSize:'1rem'}}>Register</button></li>
            </>
          )}
        </ul>
      </nav>

      {!currentUser && currentPage === 'landing' && (
        <section style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
          <div style={{background:'rgba(255,255,255,0.92)',padding:'2.5rem',borderRadius:'16px',boxShadow:'0 8px 32px #00000015',maxWidth:'450px',width:'100%',textAlign:'center'}}>
            <h1 style={{marginBottom:'0.5rem'}}>Join Mentor MY 🎓</h1>
            <p style={{color:'#666',marginBottom:'1.5rem'}}>Find your Sarawak career mentor</p>
            <input
              placeholder="Full Name"
              value={landingRegForm.name}
              onChange={e=>setLandingRegForm({...landingRegForm,name:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <input
              placeholder="Email"
              type="email"
              value={landingRegForm.email}
              onChange={e=>setLandingRegForm({...landingRegForm,email:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <input
              placeholder="Password"
              type="password"
              value={landingRegForm.password}
              onChange={e=>setLandingRegForm({...landingRegForm,password:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <button
              onClick={()=>handleRegister(landingRegForm.name,landingRegForm.email,landingRegForm.password)}
              style={{width:'100%',padding:'0.9rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontSize:'1rem',marginTop:'0.8rem',cursor:'pointer'}}
            >
              Register Now
            </button>
            <p style={{marginTop:'1.2rem'}}>
              Already have account?
              <button onClick={()=>setShowLogin(true)} style={{color:'#2563eb',border:'none',background:'none',cursor:'pointer',marginLeft:'0.3rem'}}>Login</button>
            </p>
          </div>
        </section>
      )}

      {currentUser?.role === 'mentor' && currentPage === 'mentorPanel' && (
        <section style={{padding:'3rem',maxWidth:'1100px',margin:'0 auto'}}>
          <h2 style={{marginBottom:'2rem'}}>👋 Mentor Booking Approval Panel</h2>
          {getMyBookingRequests().length === 0 ? (
            <p style={{fontSize:'1.1rem',color:'#666'}}>No pending booking requests yet.</p>
          ) : (
            <div style={{display:'grid',gap:'1.5rem'}}>
              {getMyBookingRequests().map(item=>(
                <div key={item.id} style={{padding:'1.5rem',background:'#f8f9fa',borderRadius:'12px',border:'1px solid #eee'}}>
                  <h3 style={{margin:'0 0 0.5rem'}}>From: {item.studentName}</h3>
                  <p style={{margin:'0.3rem 0'}}>Date: {item.date}</p>
                  <p style={{margin:'0.3rem 0'}}>Topic: {item.topic}</p>
                  <p style={{margin:'0.3rem 0',fontWeight:'bold'}}>
                    Status: 
                    <span style={{color:item.status==='Approved'?'#16a34a':item.status==='Denied'?'#dc2626':'#ca8a04'}}>
                      &nbsp;{item.status}
                    </span>
                  </p>
                  {item.status === 'Pending' && (
                    <div style={{marginTop:'1rem',display:'flex',gap:'1rem'}}>
                      <button onClick={()=>handleApprove(item.id)} style={{padding:'0.6rem 1.2rem',background:'#16a34a',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Approve</button>
                      <button onClick={()=>handleDeny(item.id)} style={{padding:'0.6rem 1.2rem',background:'#dc2626',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Deny</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {currentUser && currentPage === 'home' && (
        <section style={{padding:'3rem',textAlign:'center'}}>
          <h1>Welcome back, {currentUser.name} 🎓</h1>
          <p style={{fontSize:'1.1rem',color:'#666',maxWidth:'700px',margin:'1rem auto'}}>
            Explore professional mentors, book consultation, plan your Sarawak career path.
          </p>
          <button onClick={()=>setCurrentPage('mentors')} style={{padding:'1rem 2rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontSize:'1rem',marginTop:'1.5rem',cursor:'pointer'}}>
            Browse All Mentors
          </button>
        </section>
      )}

      {currentUser && currentPage === 'mentors' && (
        <section style={{padding:'3rem',maxWidth:'1200px',margin:'0 auto'}}>
          <h2 style={{marginBottom:'1.5rem'}}>All Mentors</h2>
          <input
            placeholder="Search mentor by name / field"
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
            style={{width:'100%',maxWidth:'500px',padding:'0.9rem',borderRadius:'8px',border:'1px solid #ddd',marginBottom:'2rem'}}
          />
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:'1.5rem'}}>
            {filteredMentors.map(m=>(
              <div key={m.id} style={{padding:'1.5rem',background:'#fff',borderRadius:'12px',boxShadow:'0 4px 12px #00000010'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                  <div style={{width:'45px',height:'45px',borderRadius:'50%',background:'#2563eb',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'1.2rem'}}>
                    {m.name[0]}
                  </div>
                  <div>
                    <h3 style={{margin:0}}>{m.name}</h3>
                    <p style={{margin:'0',color:'#666'}}>⭐ {m.rating}</p>
                  </div>
                </div>
                <p style={{margin:'0.4rem 0'}}><strong>Field:</strong> {m.major}</p>
                <p style={{margin:'0.4rem 0'}}><strong>Location:</strong> {m.location}</p>
                <p style={{margin:'0.4rem 0',fontSize:'0.9rem',color:'#555'}}>{m.desc}</p>
                <div style={{display:'flex',gap:'0.8rem',marginTop:'1.2rem'}}>
                  <button onClick={()=>toggleSaveMentor(m)} style={{flex:1,padding:'0.6rem',border:`1px solid ${savedMentors.some(x=>x.id===m.id)?'#2563eb':'#ddd'}`,background:savedMentors.some(x=>x.id===m.id)?'#eff6ff':'#fff',borderRadius:'6px',cursor:'pointer'}}>
                    {savedMentors.some(x=>x.id===m.id) ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={()=>{setSelectedMentor(m);setShowBookModal(true);}} style={{flex:1,padding:'0.6rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentUser && currentPage === 'pathways' && (
        <section style={{padding:'3rem',maxWidth:'1200px',margin:'0 auto'}}>
          <h2 style={{marginBottom:'2rem'}}>Sarawak Career Pathways</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1.5rem'}}>
            {pathways.map(p=>(
              <div key={p.id} style={{padding:'1.5rem',background:'#fff',borderRadius:'12px',boxShadow:'0 4px 12px #00000010'}}>
                <div style={{fontSize:'2.5rem'}}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <p style={{color:'#2563eb',fontWeight:'bold'}}>{p.demand}</p>
                <button onClick={()=>setSelectedPathway(p)} style={{marginTop:'1rem',padding:'0.6rem 1rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>View Details</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentUser && currentPage === 'dashboard' && (
        <section style={{padding:'3rem',maxWidth:'1000px',margin:'0 auto'}}>
          <h2>Dashboard</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginTop:'2rem'}}>
            <div style={{padding:'1.5rem',background:'#f8f9fa',borderRadius:'12px'}}>
              <h3>My Profile</h3>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Phone:</strong> {currentUser.phone || 'Not set'}</p>
              <p><strong>School:</strong> {currentUser.school || 'Not set'}</p>
              <p><strong>Bio:</strong> {currentUser.bio || 'Not set'}</p>
              <button onClick={()=>{setEditForm({name:currentUser.name,email:currentUser.email,phone:currentUser.phone,school:currentUser.school,bio:currentUser.bio});setShowEditModal(true);}} style={{marginTop:'1rem',padding:'0.6rem 1rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>Edit Profile</button>
            </div>
            <div style={{padding:'1.5rem',background:'#f8f9fa',borderRadius:'12px'}}>
              <h3>My Bookings</h3>
              {getMyStudentBookings().length === 0 ? (
                <p>No booking yet.</p>
              ) : (
                <div style={{display:'grid',gap:'1rem'}}>
                  {getMyStudentBookings().map(b=>(
                    <div key={b.id} style={{padding:'1rem',background:'#fff',borderRadius:'8px'}}>
                      <p style={{margin:'0'}}><strong>Mentor:</strong> {b.mentorName}</p>
                      <p style={{margin:'0'}}><strong>Date:</strong> {b.date}</p>
                      <p style={{margin:'0'}}>
                        Status: 
                        <span style={{color:b.status==='Approved'?'#16a34a':b.status==='Denied'?'#dc2626':'#ca8a04',fontWeight:'bold'}}>
                          &nbsp;{b.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {showLogin && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#00000040',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'90%',maxWidth:'400px'}}>
            <h2 style={{marginTop:0}}>Login</h2>
            <input
              placeholder="Email"
              type="email"
              value={loginForm.email}
              onChange={e=>setLoginForm({...loginForm,email:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <input
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={e=>setLoginForm({...loginForm,password:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <button onClick={()=>handleLogin(loginForm.email,loginForm.password)} style={{width:'100%',padding:'0.9rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontSize:'1rem',marginTop:'0.8rem',cursor:'pointer'}}>Login</button>
            <button onClick={()=>setShowLogin(false)} style={{width:'100%',padding:'0.9rem',background:'transparent',color:'#666',border:'none',borderRadius:'8px',marginTop:'0.5rem',cursor:'pointer'}}>Close</button>
            <p style={{fontSize:'0.9rem',color:'#666',marginTop:'1rem'}}>Test Mentor: aisha@mentor.my / mentor123</p>
          </div>
        </div>
      )}

      {showBookModal && selectedMentor && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#00000040',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'90%',maxWidth:'400px'}}>
            <h2>Book {selectedMentor.name}</h2>
            <input
              type="date"
              value={bookForm.date}
              onChange={e=>setBookForm({...bookForm,date:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <input
              placeholder="Meeting Topic / Purpose"
              value={bookForm.topic}
              onChange={e=>setBookForm({...bookForm,topic:e.target.value})}
              style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}
            />
            <button onClick={submitBooking} style={{width:'100%',padding:'0.9rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontSize:'1rem',marginTop:'0.8rem',cursor:'pointer'}}>Submit Booking</button>
            <button onClick={()=>setShowBookModal(false)} style={{width:'100%',padding:'0.9rem',background:'transparent',color:'#666',border:'none',borderRadius:'8px',marginTop:'0.5rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {selectedPathway && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#00000040',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'90%',maxWidth:'450px'}}>
            <div style={{fontSize:'3rem'}}>{selectedPathway.icon}</div>
            <h2>{selectedPathway.title}</h2>
            <p>{selectedPathway.desc}</p>
            <p style={{color:'#2563eb',fontWeight:'bold'}}>{selectedPathway.demand}</p>
            <div style={{marginTop:'1rem'}}>
              <p><strong>Key Skills:</strong></p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {selectedPathway.skills.map((s,i)=>(
                  <span key={i} style={{padding:'0.4rem 0.8rem',background:'#eff6ff',color:'#2563eb',borderRadius:'20px',fontSize:'0.9rem'}}>{s}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>setSelectedPathway(null)} style={{marginTop:'1.5rem',padding:'0.7rem 1.5rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#00000040',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'90%',maxWidth:'400px'}}>
            <h2>Edit Profile</h2>
            <input placeholder="Name" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}/>
            <input placeholder="Phone" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})} style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}/>
            <input placeholder="School/University" value={editForm.school} onChange={e=>setEditForm({...editForm,school:e.target.value})} style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd'}}/>
            <textarea placeholder="Bio" value={editForm.bio} onChange={e=>setEditForm({...editForm,bio:e.target.value})} style={{width:'100%',padding:'0.9rem',margin:'0.6rem 0',borderRadius:'8px',border:'1px solid #ddd',minHeight:'80px'}}/>
            <button onClick={saveProfileEdit} style={{width:'100%',padding:'0.9rem',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontSize:'1rem',marginTop:'0.8rem',cursor:'pointer'}}>Save Changes</button>
            <button onClick={()=>setShowEditModal(false)} style={{width:'100%',padding:'0.9rem',background:'transparent',color:'#666',border:'none',borderRadius:'8px',marginTop:'0.5rem',cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

 