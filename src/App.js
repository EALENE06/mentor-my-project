import React, { useState, useEffect } from 'react';
import './App.css';

// ==============================
// 🔥 YOUR FULL DATABASE (from your docx)
// 直接对接你的 6 张表
// ==============================
const DATABASE = {
  Users: [
    { User_ID: 'U001', Name: 'Alice Ting', Email: 'alice@student.com', Password: 'alice123', Role: 'Student' },
    { User_ID: 'U002', Name: 'Brandon Ling', Email: 'brandon@student.com', Password: 'brandon123', Role: 'Student' },
    { User_ID: 'U003', Name: 'Sarah Jabu', Email: 'sarah@mentor.com', Password: 'sarah123', Role: 'Mentor' },
    { User_ID: 'U004', Name: 'Daniel Wong', Email: 'daniel@mentor.com', Password: 'daniel123', Role: 'Mentor' },
    { User_ID: 'U005', Name: 'Fatimah Ahmad', Email: 'fatimah@mentor.com', Password: 'pass556', Role: 'Mentor' },
    { User_ID: 'U006', Name: 'Kevin Baru', Email: 'kevin@mentor.com', Password: 'kb_2026', Role: 'Mentor' },
    { User_ID: 'U007', Name: 'Chlos Sim', Email: 'chloe@student.com', Password: 'csim99', Role: 'Student' },
    { User_ID: 'U008', Name: 'Mohamad Ali', Email: 'ali@mentor.com', Password: 'm_ali88', Role: 'Mentor' },
    { User_ID: 'U009', Name: 'Jessica Low', Email: 'jess@student.com', Password: 'jlow_ps', Role: 'Student' },
    { User_ID: 'U010', Name: 'Harrison Page', Email: 'hp@mentor.com', Password: 'hpage77', Role: 'Mentor' },
    { User_ID: 'U011', Name: 'Lim Wei', Email: 'lim@student.com', Password: 'ocean123', Role: 'Student' },
    { User_ID: 'U012', Name: 'Nurul Izzah', Email: 'nurul@mentor.com', Password: 'starLight', Role: 'Mentor' },
    { User_ID: 'U013', Name: 'Michael Scott', Email: 'mike@student.com', Password: 'office44', Role: 'Student' },
    { User_ID: 'U014', Name: 'Emily Blunt', Email: 'emily@student.com', Password: 'quietPlace', Role: 'Student' },
    { User_ID: 'U015', Name: 'Rajiv Kumar', Email: 'rajiv@mentor.com', Password: 'bridge00', Role: 'Mentor' },
    { User_ID: 'U016', Name: 'Siti Aminah', Email: 'siti@student.com', Password: 'moon66', Role: 'Student' },
    { User_ID: 'U017', Name: 'Dave Grohl', Email: 'dave@student.com', Password: 'guitar11', Role: 'Mentor' },
    { User_ID: 'U018', Name: 'Fiona Apple', Email: 'fiona@student.com', Password: 'piano33', Role: 'Student' },
    { User_ID: 'U019', Name: 'Gary Vayner', Email: 'gary@mentor.com', Password: 'hustle88', Role: 'Mentor' },
    { User_ID: 'U020', Name: 'Hannah Tan', Email: 'hannah@student.com', Password: 'yellow55', Role: 'Student' },
  ],

  Students: [
    { Student_ID: 'S001', User_ID: 'U001', University: 'Swinburne University', Field_of_Study: 'Computer Science', Year_of_Study: 'Year 3' },
    { Student_ID: 'S002', User_ID: 'U002', University: 'UNIMAS', Field_of_Study: 'Business & Accounting', Year_of_Study: 'Year 2' },
    { Student_ID: 'S003', User_ID: 'U007', University: 'UTS', Field_of_Study: 'Engineering', Year_of_Study: 'Year 1' },
    { Student_ID: 'S004', User_ID: 'U009', University: 'Curtin Malaysia', Field_of_Study: 'Medical & Healthcare', Year_of_Study: 'Year 3' },
    { Student_ID: 'S005', User_ID: 'U013', University: 'Swinburne University', Field_of_Study: 'Computer Science', Year_of_Study: 'Year 2' },
    { Student_ID: 'S006', User_ID: 'U014', University: 'UiTM', Field_of_Study: 'Business & Accounting', Year_of_Study: 'Year 4' },
    { Student_ID: 'S007', User_ID: 'U015', University: 'UNIMAS', Field_of_Study: 'Engineering', Year_of_Study: 'Year 2' },
    { Student_ID: 'S008', User_ID: 'U016', University: 'Sunway University', Field_of_Study: 'Medical & Healthcare', Year_of_Study: 'Year 1' },
    { Student_ID: 'S009', User_ID: 'U017', University: 'Swinburne University', Field_of_Study: 'Computer Science', Year_of_Study: 'Year 2' },
    { Student_ID: 'S010', User_ID: 'U018', University: 'Monash Malaysia', Field_of_Study: 'Business & Accounting', Year_of_Study: 'Year 3' },
  ],

  Mentors: [
    { Mentor_ID: 'M001', User_ID: 'U003', Company: 'SDEC', Job_Title: 'Software Engineer', Expertise: 'Computer Science', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/128.jpg' },
    { Mentor_ID: 'M002', User_ID: 'U004', Company: 'Local Energy Company', Job_Title: 'Data Scientist', Expertise: 'Data Science / Engineering', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/91.jpg' },
    { Mentor_ID: 'M003', User_ID: 'U005', Company: 'Local Business Consultant', Job_Title: 'Business Advisor', Expertise: 'Business & Accounting', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/218.jpg' },
    { Mentor_ID: 'M004', User_ID: 'U006', Company: 'Industrial Engineering Firm', Job_Title: 'Engineer', Expertise: 'Engineering', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/102.jpg' },
    { Mentor_ID: 'M005', User_ID: 'U007', Company: 'Local Healthcare Centre', Job_Title: 'Medical Officer', Expertise: 'Medical & Healthcare', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/98.jpg' },
    { Mentor_ID: 'M006', User_ID: 'U008', Company: 'Local Creative Studio', Job_Title: 'UI/UX Designer', Expertise: 'Computer Science / Design', Verified_Status: 'YES', Profile_URL: 'https://mockmind-api.uifaces.co/content/human/214.jpg' },
  ],

  Bookings: [
    { Booking_ID: 'B001', Student_ID: 'S001', Mentor_ID: 'M001', Booking_Date: '2026-05-10', Booking_Time: '10:00 AM', Topic: 'Career in Software Development', Status: 'Pending' },
    { Booking_ID: 'B002', Student_ID: 'S002', Mentor_ID: 'M002', Booking_Date: '2026-05-12', Booking_Time: '2:30 PM', Topic: 'UI/UX Career Guidance', Status: 'Approved' },
    { Booking_ID: 'B003', Student_ID: 'S003', Mentor_ID: 'M005', Booking_Date: '2026-05-15', Booking_Time: '09:00 AM', Topic: 'Freelancing Tips', Status: 'Pending' },
    { Booking_ID: 'B004', Student_ID: 'S001', Mentor_ID: 'M003', Booking_Date: '2026-04-20', Booking_Time: '11:00 AM', Topic: 'Mock Interview', Status: 'Completed' },
    { Booking_ID: 'B005', Student_ID: 'S004', Mentor_ID: 'M006', Booking_Date: '2026-05-18', Booking_Time: '04:00 PM', Topic: 'IT Infrastructure', Status: 'Approved' },
  ],

  Saved_Mentors: [
    { Saved_ID: 'SV001', Student_ID: 'S001', Mentor_ID: 'M001', Date_Saved: '2026-04-01' },
    { Saved_ID: 'SV002', Student_ID: 'S001', Mentor_ID: 'M003', Date_Saved: '2026-04-05' },
    { Saved_ID: 'SV003', Student_ID: 'S002', Mentor_ID: 'M002', Date_Saved: '2026-04-10' },
    { Saved_ID: 'SV004', Student_ID: 'S003', Mentor_ID: 'M005', Date_Saved: '2026-04-12' },
    { Saved_ID: 'SV005', Student_ID: 'S004', Mentor_ID: 'M001', Date_Saved: '2026-04-15' },
  ],

  Career_Pathways: [
    { Path_ID: 'P001', Field_Name: 'Computer Science', Stage_Name: 'Intern', Description: 'Learn basic programming, web & app fundamentals' },
    { Path_ID: 'P002', Field_Name: 'Computer Science', Stage_Name: 'Junior Developer', Description: 'Build websites, apps and small software systems' },
    { Path_ID: 'P003', Field_Name: 'Computer Science', Stage_Name: 'Specialist', Description: 'Focus on AI, data, cybersecurity or cloud' },
    { Path_ID: 'P004', Field_Name: 'Computer Science', Stage_Name: 'Senior Engineer', Description: 'Lead projects, design systems & mentor juniors' },
    { Path_ID: 'P005', Field_Name: 'Business & Accounting', Stage_Name: 'Intern', Description: 'Learn basic accounting, marketing & office work' },
    { Path_ID: 'P006', Field_Name: 'Business & Accounting', Stage_Name: 'Junior Executive', Description: 'Handle finance, sales, admin or business support' },
    { Path_ID: 'P007', Field_Name: 'Business & Accounting', Stage_Name: 'Specialist', Description: 'Manage accounts, audit or business operations' },
    { Path_ID: 'P008', Field_Name: 'Business & Accounting', Stage_Name: 'Senior Officer', Description: 'Lead teams, planning & financial strategy' },
    { Path_ID: 'P009', Field_Name: 'Engineering', Stage_Name: 'Intern', Description: 'Learn technical drawing, tools & site basics' },
    { Path_ID: 'P010', Field_Name: 'Engineering', Stage_Name: 'Junior Engineer', Description: 'Assist in design, construction & maintenance' },
    { Path_ID: 'P011', Field_Name: 'Engineering', Stage_Name: 'Specialist', Description: 'Focus on electrical, mechanical or civil work' },
    { Path_ID: 'P012', Field_Name: 'Engineering', Stage_Name: 'Professional Engineer', Description: 'Certified expert for project approval & management' },
    { Path_ID: 'P013', Field_Name: 'Medical & Healthcare', Stage_Name: 'Intern', Description: 'Clinical practice, hospital attachment & patient care' },
    { Path_ID: 'P014', Field_Name: 'Medical & Healthcare', Stage_Name: 'Junior Medical Officer', Description: 'Work in clinics, hospitals & health departments' },
    { Path_ID: 'P015', Field_Name: 'Medical & Healthcare', Stage_Name: 'Specialist', Description: 'Doctor, nurse, pharmacist or medical lab expert' },
    { Path_ID: 'P016', Field_Name: 'Medical & Healthcare', Stage_Name: 'Junior Consultant', Description: 'Lead healthcare teams & specialized treatment' },
  ]
};

// ==============================
// OOP CLASS (Teacher Requirement)
// ==============================
class User {
  #name;
  #email;
  #role;
  #userId;

  constructor(userId, name, email, role) {
    this.#userId = userId;
    this.#name = name;
    this.#email = email;
    this.#role = role;
  }

  getName() { return this.#name; }
  getEmail() { return this.#email; }
  getRole() { return this.#role; }
  getUserId() { return this.#userId; }
}

class Student extends User {}
class Mentor extends User {}

// ==============================
// MAIN APP
// ==============================
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', school: '', bio: '' });

  // ==============================
  // ✅ LOGIN USING YOUR DATABASE
  // ==============================
  const handleLogin = (email, password) => {
    const foundUser = DATABASE.Users.find(u => u.Email === email && u.Password === password);

    if (!foundUser) {
      alert("❌ Email / Password wrong (FROM DATABASE)");
      return;
    }

    if (foundUser.Role === "Student") {
      setUser(new Student(foundUser.User_ID, foundUser.Name, foundUser.Email, foundUser.Role));
    } else {
      setUser(new Mentor(foundUser.User_ID, foundUser.Name, foundUser.Email, foundUser.Role));
    }

    setShowLogin(false);
    setCurrentPage('home');
    alert("✅ Login success with DATABASE account!");
  };

  // Get student info from DB
  const getStudentData = () => {
    if (!user || user.getRole() !== "Student") return null;
    return DATABASE.Students.find(s => s.User_ID === user.getUserId());
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="App" style={{ padding: 20, fontFamily: 'Arial' }}>
      <nav style={{ marginBottom: 20 }}>
        <h1>Mentor MY (Connected to YOUR Database)</h1>
        {!user ? (
          <button onClick={() => setShowLogin(true)} style={{ padding: 8 }}>Login with DB Account</button>
        ) : (
          <button onClick={() => setUser(null)} style={{ padding: 8 }}>Logout</button>
        )}
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ border: '1px solid #ccc', padding: 20, maxWidth: 400 }}>
          <h3>Login (Verify from YOUR Database)</h3>
          <input type="email" placeholder="Email" style={{ width: '100%', margin: 5, padding: 8 }}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          <input type="password" placeholder="Password" style={{ width: '100%', margin: 5, padding: 8 }}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          <button onClick={() => handleLogin(loginForm.email, loginForm.password)} style={{ padding: 8 }}>Login</button>
        </div>
      )}

      {/* AFTER LOGIN SHOW PROFILE FROM DATABASE */}
      {user && (
        <div style={{ border: '1px solid #eee', padding: 20, maxWidth: 500 }}>
          <h2>My Profile (From Database)</h2>
          <p><strong>User ID:</strong> {user.getUserId()}</p>
          <p><strong>Name:</strong> {user.getName()}</p>
          <p><strong>Email:</strong> {user.getEmail()}</p>
          <p><strong>Role:</strong> {user.getRole()}</p>

          {getStudentData() && (
            <>
              <p><strong>University:</strong> {getStudentData().University}</p>
              <p><strong>Field:</strong> {getStudentData().Field_of_Study}</p>
              <p><strong>Year:</strong> {getStudentData().Year_of_Study}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;