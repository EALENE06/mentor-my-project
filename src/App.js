import React, { useState } from 'react';
import './App.css';

// ========== Inheritance & Polymorphism (Teacher Requirement) ==========
// Parent Class 父类
// ========== OOP Concepts: Encapsulation, Inheritance & Polymorphism ==========

// Parent Class
class User {
  #name;
  #email;

  constructor(name, email) {
    this.#name = name;
    this.#email = email;
  }

  getName() {
    return this.#name;
  }

  setName(name) {
    this.#name = name;
  }

  getEmail() {
    return this.#email;
  }

  setEmail(email) {
    this.#email = email;
  }

  getRoleInfo() {
    return "General Platform User";
  }
}

// Inheritance: Student inherits from User
class Student extends User {
  getRoleInfo() {
    return "Student: Can search, save and book mentors";
  }
}

// Inheritance: Mentor inherits from User
class Mentor extends User {
  getRoleInfo() {
    return "Mentor: Provides Sarawak career and study guidance";
  }
}

// Polymorphism demo
const user1 = new Student("Student Aisha", "student@mail.com");
const user2 = new Mentor("Mentor Daniel", "mentor@mail.com");

console.log(user1.getName(), "-", user1.getRoleInfo());
console.log(user2.getName(), "-", user2.getRoleInfo());
// =====================================================================

function App() {
  // 页面状态：默认打开直接进入注册落地页
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPathway, setSelectedPathway] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  // 收藏导师列表
  const [savedMentors, setSavedMentors] = useState([]);

  const allMentors = [
    {
      id: 1,
      name: 'Aisha Tan',
      major: 'Computer Science',
      lang: 'English, Malay',
      rating: 4.9,
      location: 'Kuching',
      industry: 'Tech',
      company: 'Sarawak Digital Economy',
      desc: 'Guidance on web development and tech careers in Sarawak.'
    },
    {
      id: 2,
      name: 'Daniel Lee',
      major: 'Data Science',
      lang: 'English, Malay',
      rating: 4.8,
      location: 'Miri',
      industry: 'Data / Oil & Gas',
      company: 'Local Energy Company',
      desc: 'Guidance on Python, data analysis and data careers linked to local industries.'
    },
    {
      id: 3,
      name: 'Priya Nair',
      major: 'Business',
      lang: 'English, Malay, Tamil',
      rating: 4.7,
      location: 'Sibu',
      industry: 'Business / SME',
      company: 'Local Business Consultant',
      desc: 'Guidance on business studies, accounting and starting careers in local companies.'
    },
    {
      id: 4,
      name: 'Muhammad Amir',
      major: 'Engineering',
      lang: 'English, Malay',
      rating: 4.6,
      location: 'Bintulu',
      industry: 'Engineering / Energy',
      company: 'Industrial Engineering Firm',
      desc: 'Guidance on engineering study paths and industrial career opportunities in Sarawak.'
    },
    {
      id: 5,
      name: 'Siti Hajar',
      major: 'Medicine',
      lang: 'English, Malay',
      rating: 4.9,
      location: 'Kuching',
      industry: 'Healthcare',
      company: 'Local Healthcare Centre',
      desc: 'Guidance on medical entry, healthcare study routes and serving local communities.'
    },
    {
      id: 6,
      name: 'Lim Wei',
      major: 'Design',
      lang: 'English, Mandarin',
      rating: 4.7,
      location: 'Kuching',
      industry: 'Creative / UIUX',
      company: 'Local Creative Studio',
      desc: 'Guidance on graphic design, UI/UX portfolio and creative jobs in Sarawak.'
    }
  ];

  // 4大职业路线（含Medical）
  const pathways = [
    {
      id: 1,
      title: 'Computer Science',
      icon: '💻',
      desc: 'Build software, apps, websites and AI systems.',
      demand: '🔥 High demand in Sarawak Digital Economy (PCDS)',
      skills: ['Python', 'JavaScript', 'Java', 'SQL', 'UI/UX'],
      jobs: ['Software Engineer', 'Web Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity'],
      steps: [
        { title: 'Learn Basics', desc: 'Python, logic, algorithms' },
        { title: 'Build Projects', desc: 'Websites, apps, small systems' },
        { title: 'Specialize', desc: 'AI, mobile, security, data' },
        { title: 'Internship', desc: 'Gain real working experience' },
      ]
    },
    {
      id: 2,
      title: 'Business & Accounting',
      icon: '📊',
      desc: 'Manage businesses, finance, marketing and teams.',
      demand: '📈 Strong demand in local SMEs and entrepreneurship',
      skills: ['Accounting', 'Marketing', 'Economics', 'Management', 'Excel'],
      jobs: ['Accountant', 'Marketing Executive', 'Business Analyst', 'Bank Officer', 'Manager'],
      steps: [
        { title: 'Foundations', desc: 'Accounting, economics, math' },
        { title: 'Specialize', desc: 'Finance, marketing, HR, management' },
        { title: 'Intern', desc: 'Work in company or bank' },
        { title: 'Professional Cert', desc: 'ACCA, CIMA, ICSA' },
      ]
    },
    {
      id: 3,
      title: 'Engineering',
      icon: '🔧',
      desc: 'Design, build and maintain electrical, mechanical & civil systems.',
      demand: '⚡ High demand in oil, gas and infrastructure sectors (Bintulu/Miri)',
      skills: ['Math', 'Physics', 'CAD', 'Circuits', 'Mechanics'],
      jobs: ['Electrical Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Tech Consultant'],
      steps: [
        { title: 'Strong Math & Physics', desc: 'Foundation for all engineering' },
        { title: 'Software Skills', desc: 'CAD, simulation, analysis' },
        { title: 'Lab & Workshop', desc: 'Hands-on practical training' },
        { title: 'Professional Engineer License', desc: 'Board certification' },
      ]
    },
    {
      id: 4,
      title: 'Medical & Healthcare',
      icon: '🩺',
      desc: 'Pursue medicine, nursing, pharmacy and health-related careers.',
      demand: '🏥 Continuous demand in Sarawak healthcare services',
      skills: ['Biology', 'Chemistry', 'Medical Science', 'Patient Care', 'Research'],
      jobs: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Lab Tech', 'Healthcare Officer'],
      steps: [
        { title: 'Strong Science Base', desc: 'Biology, chemistry, pre-med foundation' },
        { title: 'Specialize & Practice', desc: 'Medicine, nursing, pharmacy training' },
        { title: 'Clinical Attachment', desc: 'Hospital & healthcare practical' },
        { title: 'Professional Registration', desc: 'Medical board certification' },
      ]
    }
  ];

  const filteredMentors = allMentors.filter(m =>
    m.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = (email, password) => {
    setUser(new Student(email.split('@')[0], email));
    setShowLogin(false);
    setCurrentPage('home');
  };

  const handleRegister = (name, email, password) => {
    setUser({ name, email });
    setShowRegister(false);
    setCurrentPage('home');
  };

  const handleBook = (mentor, date, topic) => {
    const newBooking = {
      id: Date.now(),
      mentorName: mentor.name,
      date,
      topic,
      status: 'Upcoming'
    };
    setBookings([...bookings, newBooking]);
    setShowBookModal(false);
  };

  const cancelBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const goToMentorsByMajor = (major) => {
    setSearchTerm(major);
    setCurrentPage('mentors');
    setSelectedPathway(null);
  };

  const handleSaveEdit = () => {
    setUser({ ...user, name: editForm.name, email: editForm.email });
    setShowEditModal(false);
  };

  // 收藏/取消收藏导师
  const toggleSaveMentor = (mentor) => {
    const isSaved = savedMentors.some(m => m.id === mentor.id);
    if (isSaved) {
      setSavedMentors(savedMentors.filter(m => m.id !== mentor.id));
    } else {
      setSavedMentors([...savedMentors, mentor]);
    }
  };

  const isMentorSaved = (mentorId) => {
    return savedMentors.some(m => m.id === mentorId);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">Mentor MY</div>
        <ul className="nav-links">
          <li><button className="nav-btn" onClick={() => setCurrentPage('home')}>Home</button></li>
          <li><button className="nav-btn" onClick={() => setCurrentPage('mentors')}>Mentors</button></li>
          <li><button className="nav-btn" onClick={() => setCurrentPage('careers')}>Career Pathways</button></li>
          <li><button className="nav-btn" onClick={() => setCurrentPage('about')}>About</button></li>
        </ul>
        <div className="auth-buttons">
          {user ? (
            <>
              <button className="nav-btn" onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
              <button className="btn-logout" onClick={() => setUser(null)}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => setShowLogin(true)}>Login</button>
              <button className="btn-register" onClick={() => setShowRegister(true)}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* 独立注册落地页（网站打开默认首页） */}
      {currentPage === 'landing' && !user && (
        <section style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '450px',
            textAlign: 'center'
          }}>
            <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Join Mentor MY 🎓</h1>
            <p style={{color: '#666', marginBottom: '2rem'}}>Create your account to find your perfect mentor today</p>

            <input 
              type="text" 
              placeholder="Full Name"
              style={{width:'100%', padding:'0.9rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd'}}
            />
            <input 
              type="email" 
              placeholder="Email Address"
              style={{width:'100%', padding:'0.9rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd'}}
            />
            <input 
              type="password" 
              placeholder="Password"
              style={{width:'100%', padding:'0.9rem', marginBottom:'1.5rem', borderRadius:'8px', border:'1px solid #ddd'}}
            />

            <button 
              className="btn-hero"
              style={{width:'100%', padding:'1rem', fontSize:'1.1rem'}}
              onClick={() => {
                handleRegister('New Student', 'new@user.com', '123456');
              }}
            >
              Register Now
            </button>

            <p style={{marginTop:'1.5rem'}}>
              Already have an account? 
              <button onClick={() => setShowLogin(true)} style={{color:'#4f46e5', fontWeight:'bold', marginLeft:'0.3rem', background:'none', border:'none', cursor:'pointer'}}>
                Login here
              </button>
            </p>

            <button 
              onClick={() => setCurrentPage('home')}
              style={{marginTop:'1rem', background:'none', border:'none', color:'666', cursor:'pointer'}}
            >
              Skip & Browse First
            </button>
          </div>
        </section>
      )}

      {currentPage === 'home' && (
        <>
          <section className="hero">
            <h1>Welcome to Mentor MY</h1>
            <p>Connect with experienced mentors, get academic guidance, and build your future career pathway — all in one platform.</p>
            <button className="btn-hero" onClick={() => setCurrentPage('mentors')}>Browse Mentors</button>
          </section>

          <section className="mentors-section">
            <h2>Our Mentors</h2>
            <p>Find experts in different fields to guide you.</p>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by major or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mentors-grid">
              {filteredMentors.length > 0 ? (
                filteredMentors.map(m => (
                  <div className="mentor-card" key={m.id}>
                    <div className="mentor-header">
                      <div className="avatar">{m.name.charAt(0)}</div>
                      <div className="mentor-info">
                        <h3>{m.name}</h3>
                        <div className="rating">⭐ {m.rating}</div>
                      </div>
                    </div>
                    <div className="major">{m.major}</div>
                    <div className="lang">Languages: {m.lang}</div>
                    <div className="desc">{m.desc}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.8rem' }}>
                      <p>📍 {m.location} | 🏭 {m.industry} | 🏢 {m.company}</p> </div>
                    <div className="card-actions">
                      <button className="btn-save" onClick={() => toggleSaveMentor(m)}>
                        {isMentorSaved(m.id) ? 'Unsave' : 'Save'}
                      </button>
                      <button className="btn-book" onClick={() => { setSelectedMentor(m); setShowBookModal(true); }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-result">No mentors found</div>
              )}
            </div>
            <button className="btn-hero view-all-btn" onClick={() => setCurrentPage('mentors')}>View All Mentors</button>
          </section>
        </>
      )}

      {currentPage === 'mentors' && (
        <section className="mentors-section">
          <h2>All Mentors</h2>
          <p>Find the best mentor for your study & career</p>
          
          <button className="btn-hero" onClick={() => setCurrentPage('home')} style={{ marginBottom: '1rem' }}>
            Back to Home
          </button>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search major or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-tags">
            <div className="tag" onClick={() => setSearchTerm('')}>All</div>
            <div className="tag" onClick={() => setSearchTerm('Computer Science')}>CS</div>
            <div className="tag" onClick={() => setSearchTerm('Data Science')}>Data</div>
            <div className="tag" onClick={() => setSearchTerm('Business')}>Business</div>
            <div className="tag" onClick={() => setSearchTerm('Engineering')}>Engineering</div>
            <div className="tag" onClick={() => setSearchTerm('Medicine')}>Medicine</div>
            <div className="tag" onClick={() => setSearchTerm('Design')}>Design</div>
          </div>
          <div className="mentors-grid">
            {filteredMentors.length > 0 ? (
              filteredMentors.map(m => (
                <div className="mentor-card" key={m.id}>
                  <div className="mentor-header">
                    <div className="avatar">{m.name.charAt(0)}</div>
                    <div className="mentor-info">
                      <h3>{m.name}</h3>
                      <div className="rating">⭐ {m.rating}</div>
                    </div>
                  </div>
                  <div className="major">{m.major}</div>
                  <div className="lang">Languages: {m.lang}</div>
                  <div className="desc">{m.desc}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.8rem' }}>
                      <p>📍 {m.location} | 🏭 {m.industry} | 🏢 {m.company}</p> </div>
                  <div className="card-actions">
                    <button className="btn-save" onClick={() => toggleSaveMentor(m)}>
                      {isMentorSaved(m.id) ? 'Unsave' : 'Save'}
                    </button>
                    <button className="btn-book" onClick={() => { setSelectedMentor(m); setShowBookModal(true); }}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-result">No mentors found</div>
            )}
          </div>
        </section>
      )}

      {currentPage === 'careers' && (
        <section className="careers-section">
          <div className="careers-header">
            <h2>Career Pathways</h2>
            <p>Choose your field and know exactly what to do step by step</p>
            <button className="btn-hero" onClick={() => setCurrentPage('home')} style={{ marginTop: '1rem' }}>
              Back to Home
            </button>
          </div>
          <div className="pathways-grid">
            {pathways.map(p => (
              <div className="path-card" key={p.id}>
                <div className="path-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <div style={{ fontSize: '0.85rem', color: '#4f46e5', marginBottom: '1rem', fontWeight: '600' }}> 
                  {p.demand} 
                  </div>
                <div className="path-steps">
                  {p.steps.slice(0, 2).map((s, i) => (
                    <div className="step" key={i}>
                      <div className="step-num">{i + 1}</div>
                      <div className="step-content">
                        <h4>{s.title}</h4>
                        <p>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="path-btn" onClick={() => setSelectedPathway(p)}>View Full Path</button>
                <button
                  className="path-btn mentor-path-btn"
                  onClick={() => goToMentorsByMajor(p.title.split(' ')[0])}
                >
                  Find Mentor
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPage === 'dashboard' && user && (
        <section className="dashboard-section">
          <div className="dashboard-header">
            <h2>My Dashboard</h2>
            <button className="btn-hero" onClick={() => setCurrentPage('home')}>
              Back to Home
            </button>
          </div>

          <div className="dashboard-grid">
            {/* Profile */}
            <div className="dashboard-card">
              <h3>My Profile</h3>
              <p>Name: {user.getName}</p>
              <p>Email: {user.getEmail}</p>
              <button className="dashboard-btn" onClick={() => {
                setEditForm({ name: user.name, email: user.email });
                setShowEditModal(true);
              }}>
                Edit Profile
              </button>
            </div>

            {/* Bookings */}
            <div className="dashboard-card">
              <h3>My Bookings</h3>
              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <div className="bookings-list">
                  {bookings.map(b => (
                    <div className="booking-item" key={b.id}>
                      <p><strong>Mentor:</strong> {b.mentorName}</p>
                      <p><strong>Date:</strong> {b.date}</p>
                      <p><strong>Topic:</strong> {b.topic}</p>
                      <p className="status-upcoming">{b.status}</p>
                      <button className="cancel-btn" onClick={() => cancelBooking(b.id)}>Cancel</button>
                    </div>
                  ))}
                </div>
              )}
              <button className="dashboard-btn" onClick={() => setCurrentPage('mentors')}>
                Book New Session
              </button>
            </div>
          </div>

          {/* Saved Mentors */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Saved Mentors</h3>

            {savedMentors.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                You haven’t saved any mentors yet.
              </p>
            ) : (
              <div className="mentors-grid">
                {savedMentors.map(m => (
                  <div className="mentor-card" key={m.id}>
                    <div className="mentor-header">
                      <div className="avatar">{m.name.charAt(0)}</div>
                      <div className="mentor-info">
                        <h3>{m.name}</h3>
                        <div className="rating">⭐ {m.rating}</div>
                      </div>
                    </div>
                    <div className="major">{m.major}</div>
                    <div className="lang">Languages: {m.lang}</div>
                    <div className="desc">{m.desc}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.8rem' }}>
                      <p>📍 {m.location} | 🏭 {m.industry} | 🏢 {m.company}</p> </div>
                    <div className="card-actions">
                      <button className="btn-save" onClick={() => toggleSaveMentor(m)}>
                        Unsave
                      </button>
                      <button className="btn-book" onClick={() => { setSelectedMentor(m); setShowBookModal(true); }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {currentPage === 'about' && (
        <section className="about-section" style={{padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.2rem', marginBottom: '1rem'}}>About Mentor MY</h2>
          <p style={{maxWidth: '800px', margin: '0 auto 1rem auto', fontSize: '1.1rem', lineHeight: '1.8'}}>
            Mentor MY is a dedicated student mentoring platform built for Malaysian secondary & pre-university students.
          </p>
          <p style={{maxWidth: '800px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem', lineHeight: '1.8'}}>
            We connect you with senior, experienced mentors across Computer Science, Business, Engineering, Medical and more.
            Whether you are figuring out your SPM pathway, choosing university course, or planning your dream career,
            we are here to guide you every step of the way.
          </p>

          <div className="pathways-grid" style={{marginBottom: '3rem'}}>
            <div className="path-card">
              <div className="path-icon">🎓</div>
              <h4>Trusted Mentors</h4>
              <p>Experienced seniors & industry experts</p>
            </div>
            <div className="path-card">
              <div className="path-icon">🛤️</div>
              <h4>Clear Career Roadmap</h4>
              <p>Step-by-step pathway for every major</p>
            </div>
            <div className="path-card">
              <div className="path-icon">🇲🇾</div>
              <h4>Malaysia Focused</h4>
              <p>Local courses, unis & job market</p>
            </div>
            <div className="path-card">
              <div className="path-icon">💛</div>
              <h4>Student First</h4>
              <p>Friendly, simple & affordable guidance</p>
            </div>
          </div>

          <button className="btn-hero" onClick={() => setCurrentPage('home')}>
            Back to Home
          </button>

          {/* About页面内Contact（地址已改为Sibu） */}
          <div className="contact-section" style={{marginTop: '4rem', padding: '2rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.75)'}}>
            <h2>Contact Us</h2>
            <p style={{margin: '0.5rem 0'}}>📧 Email: support@mentormy.com</p>
            <p style={{margin: '0.5rem 0'}}>📍 Location: Sibu, Sarawak, Malaysia</p>
          </div>
        </section>
      )}

      {/* 全局底部Footer Contact（地址也改为Sibu，两处完全统一） */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: support@mentormy.com</p>
        <p>Location: Sibu, Sarawak, Malaysia</p>
      </section>

      {/* 所有弹窗组件 */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="modal-btn" onClick={() => handleLogin('test@user.com', '123456')}>Login</button>
            <button className="modal-close" onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Register</h2>
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="modal-btn" onClick={() => handleRegister('Student', 'student@test.com', '123456')}>Register</button>
            <button className="modal-close" onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}

      {showBookModal && selectedMentor && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book {selectedMentor.name}</h2>
            <input type="date" />
            <input type="text" placeholder="Topic you want to learn" />
            <button className="modal-btn" onClick={() => handleBook(selectedMentor, '2026-05-01', 'Career Guidance')}>
              Confirm Booking
            </button>
            <button className="modal-close" onClick={() => setShowBookModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {selectedPathway && (
        <div className="modal-overlay">
          <div className="modal pathway-detail-modal">
            <div className="detail-header">
              <div className="detail-icon">{selectedPathway.icon}</div>
              <h2>{selectedPathway.title}</h2>
            </div>
            <p className="detail-desc">{selectedPathway.desc}</p>

            <div className="detail-section">
              <h4>Key Skills</h4>
              <div className="skill-tags">
                {selectedPathway.skills.map((s, i) => (
                  <div className="skill-tag" key={i}>{s}</div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Career Options</h4>
              <ul className="career-list">
                {selectedPathway.jobs.map((j, i) => (
                  <li key={i}>{j}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Full Path Steps</h4>
              {selectedPathway.steps.map((s, i) => (
                <div className="step" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-content">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="path-btn mentor-path-btn"
              onClick={() => {
                goToMentorsByMajor(selectedPathway.title.split(' ')[0]);
              }}
            >
              Find Mentor for This Path
            </button>
            <button className="modal-close" onClick={() => setSelectedPathway(null)}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <button className="modal-btn" onClick={handleSaveEdit}>Save Changes</button>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;