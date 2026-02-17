import React, { useState, useEffect } from 'react';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { VscFiles, VscSearch, VscSourceControl, VscDebugAlt, VscExtensions, VscAccount, VscSettingsGear, VscPlay, VscMenu, VscClose, VscSplitHorizontal, VscCloudDownload } from "react-icons/vsc";
import { FaPython, FaReact, FaJs, FaMarkdown } from "react-icons/fa";
import { SiJupyter } from "react-icons/si";

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// Components
import BootSequence from './components/BootSequence';
import { useTheme } from './context/ThemeContext';
import { parseCommand } from './utils/commandParser';

// Firebase
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import Admin from './pages/Admin';

console.log("App: Initializing...");

function App() {
  console.log("App: Rendering...");
  const { toggleTheme, setThemeByName, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home.md');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null); // Auth State
  const [inputMode, setInputMode] = useState('command'); // 'command', 'login_email', 'login_password'
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Terminal State
  const [inputVal, setInputVal] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', content: 'Welcome to Karnav OS. Type "help" to see available commands.' }
  ]);
  const [terminalHeight, setTerminalHeight] = useState(150);
  const isResizing = React.useRef(false);

  // Auth Listener
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          setTerminalHistory(prev => [...prev, { type: 'output', content: `Logged in as: ${currentUser.email}` }]);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogin = async () => {
    logToTerminal("Enter Admin Credentials:");
    setInputMode('login_email');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logToTerminal("Logged out successfully.");
      setActiveTab('Home.md');
    } catch (error) {
      logToTerminal(`Error logging out: ${error.message}`);
    }
  };

  const startResizing = React.useCallback((mouseDownEvent) => {
    isResizing.current = true;
  }, []);

  const stopResizing = React.useCallback(() => {
    isResizing.current = false;
  }, []);

  const resize = React.useCallback((mouseMoveEvent) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - mouseMoveEvent.clientY;
      if (newHeight > 30 && newHeight < window.innerHeight - 100) {
        setTerminalHeight(newHeight);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleTerminalSubmit = async (e) => {
    if (e.key === 'Enter') {
      const value = inputVal;
      setInputVal('');

      if (inputMode === 'command') {
        setTerminalHistory(prev => [...prev, { type: 'input', content: value }]);

        const output = parseCommand(value, {
          setTab: setActiveTab,
          setTheme: setThemeByName,
          clearHistory: () => setTerminalHistory([])
        });

        // Handle Special Actions
        if (output && typeof output === 'object' && output.type === 'ACTION') {
          if (output.action === 'LOGIN_PROMPT') {
            handleLogin();
          } else if (output.action === 'LOGOUT') {
            handleLogout();
          }
        } else if (output) {
          setTerminalHistory(prev => [...prev, { type: 'output', content: output }]);
        }
      } else if (inputMode === 'login_email') {
        setTerminalHistory(prev => [...prev, { type: 'output', content: `Email: ${value}` }]);
        setLoginCredentials(prev => ({ ...prev, email: value }));
        setInputMode('login_password');
      } else if (inputMode === 'login_password') {
        setTerminalHistory(prev => [...prev, { type: 'output', content: `Password: *********` }]);

        try {
          logToTerminal("Authenticating...");
          // Small artificial delay for realism
          await new Promise(resolve => setTimeout(resolve, 800));
          await signInWithEmailAndPassword(auth, loginCredentials.email, value);
          logToTerminal("Access Granted.");
          logToTerminal("Opening Admin Dashboard...");
          setActiveTab('Admin.jsx');
          setInputMode('command');
          setLoginCredentials({ email: '', password: '' });
          setLoginAttempts(0);
        } catch (error) {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          if (newAttempts >= 3) {
            logToTerminal(`Access Denied: ${error.message}`);
            logToTerminal("Too many authentication failures. Incident reported.");
            setInputMode('command');
            setLoginAttempts(0);
            setLoginCredentials({ email: '', password: '' });
          } else {
            logToTerminal(`Access Denied. Try again (${newAttempts}/3).`);
            // Keep mode as login_password, just clear input
            // We don't need to change inputMode, just wait for next input
          }
        }
      }
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <BootSequence onComplete={() => setIsLoading(false)} />;
  }

  const logToTerminal = (message) => {
    setTerminalHistory(prev => [...prev, { type: 'output', content: message }]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home.md': return <Home />;
      case 'About.py': return <About />;
      case 'Skills.json': return <Skills />;
      case 'Projects.ipynb': return <Projects logToTerminal={logToTerminal} />;
      case 'Contact.css': return <Contact />;
      case 'Admin.jsx': return user ? <Admin user={user} /> : <div style={{ padding: 20, color: 'red' }}>Access Denied. Please run 'sudo login'.</div>;
      default: return <Home />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'column' }}>
      {/* Top Bar (Title Bar) */}
      <div style={{
        height: '30px',
        backgroundColor: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        fontSize: '0.8rem',
        color: 'var(--comment-color)',
        justifyContent: 'space-between'
      }}>
        {isMobile && (
          <div onClick={toggleSidebar} style={{ cursor: 'pointer', color: 'var(--text-color)' }}>
            <VscMenu size={18} />
          </div>
        )}
        <span style={{ margin: '0 auto' }}>KarnavPrajapati_Portfolio - Visual Studio Code</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Activity Bar (Leftmost icons) - Hidden on mobile */}
        {!isMobile && (
          <div className="activity-bar" style={{
            width: '50px',
            backgroundColor: 'var(--bg-color)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '10px'
          }}>
            <div style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--text-color)' }}><VscFiles size={24} /></div>
            <div style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--comment-color)' }}><VscSearch size={24} /></div>
            <div style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--comment-color)' }}><VscSourceControl size={24} /></div>

            <div style={{ marginTop: 'auto', marginBottom: '10px' }}>
              <a
                href="/resume.pdf"
                download="Karnav_Prajapati_Resume.pdf"
                style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--accent-color)', display: 'block', textAlign: 'center' }}
                title="Download Resume"
              >
                <VscCloudDownload size={24} />
              </a>
              <div style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--comment-color)' }}><VscAccount size={24} /></div>
              <div
                style={{ marginBottom: '10px', cursor: 'pointer', color: theme === 'dracula' ? 'var(--comment-color)' : 'var(--accent-color)' }}
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                <VscSettingsGear size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar (Explorer) */}
        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.div
              initial={isMobile ? { x: -250 } : { x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ duration: 0.2 }}
              className="sidebar"
              style={{
                width: 'var(--sidebar-width)',
                minWidth: isMobile ? '250px' : '250px',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'absolute' : 'relative',
                zIndex: 10,
                height: '100%'
              }}
            >
              <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Explorer</span>
                {isMobile && <VscClose onClick={toggleSidebar} style={{ cursor: 'pointer' }} />}
              </div>

              <div style={{ padding: '0 0', marginTop: '5px' }}>
                <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', backgroundColor: 'var(--bg-terminal)' }}>
                  <span style={{ transform: 'rotate(90deg)', fontSize: '0.8rem' }}>&#9654;</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>PORTFOLIO</span>
                </div>

                {[
                  { id: 'Home.md', icon: <FaMarkdown color="#519aba" />, label: 'Home.md' },
                  { id: 'About.py', icon: <FaPython color="#3776ab" />, label: 'About.py' },
                  { id: 'Skills.json', icon: <span style={{ color: '#cbcb41' }}>{`{}`}</span>, label: 'Skills.json' },
                  { id: 'Projects.ipynb', icon: <SiJupyter color="#F37626" />, label: 'Projects.ipynb' },
                  { id: 'Contact.css', icon: <span style={{ color: '#563d7c' }}>#</span>, label: 'Contact.css' }
                ].map(file => (
                  <div
                    key={file.id}
                    style={{
                      padding: '5px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      backgroundColor: activeTab === file.id ? 'var(--bg-color)' : 'transparent',
                      color: activeTab === file.id ? 'var(--text-color)' : 'var(--comment-color)'
                    }}
                    onClick={() => {
                      setActiveTab(file.id);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                  >
                    {file.icon}
                    <span>{file.label}</span>
                  </div>
                ))}
              </div>

              {/* Resume Download (Mobile Accessible) */}
              <div style={{ marginTop: 'auto', padding: '10px', borderTop: '1px solid var(--border-color)' }}>
                <a
                  href="/resume.pdf"
                  download="Karnav_Prajapati_Resume.pdf"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--accent-color)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <VscCloudDownload size={20} />
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <div className="editor-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
          {/* Tabs Bar - Scrollable on mobile */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-terminal)', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['Home.md', 'About.py', 'Skills.json', 'Projects.ipynb', 'Contact.css'].map(file => (
              <div
                key={file}
                onClick={() => setActiveTab(file)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: activeTab === file ? 'var(--bg-color)' : 'transparent',
                  color: activeTab === file ? 'var(--text-color)' : 'var(--comment-color)',
                  borderTop: activeTab === file ? '2px solid var(--accent-color)' : '2px solid transparent',
                  borderRight: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap'
                }}>
                <span>{file}</span>
              </div>
            ))}
          </div>

          {/* Breadcrumbs */}
          <div style={{ padding: '5px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--comment-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              src &gt; pages &gt; {activeTab}
            </div>
          </div>

          {/* Editor Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)' }}>
            {renderContent()}
          </div>

          {/* Bottom Panel (Terminal) */}
          <div style={{ height: `${terminalHeight}px`, backgroundColor: 'var(--bg-terminal)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Resize Handle */}
            <div
              onMouseDown={startResizing}
              style={{
                height: '4px',
                cursor: 'row-resize',
                backgroundColor: 'var(--border-color)',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 5
              }}
            />

            <div style={{ display: 'flex', padding: '5px 10px', gap: '20px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--comment-color)', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-color)', borderBottom: '1px solid var(--accent-color)' }}>TERMINAL</span>
              {!isMobile && <>
                <span>OUTPUT</span>
                <span>DEBUG CONSOLE</span>
                <span>PROBLEMS</span>
              </>}
            </div>

            {/* Terminal Content */}
            <div
              style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-color)', overflowY: 'auto', flex: 1 }}
              onClick={() => document.getElementById('terminal-input')?.focus()}
            >
              {/* History */}
              {terminalHistory.map((line, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '5px' }}>
                  {line.type === 'input' ? (
                    <div>
                      <span style={{ color: 'var(--function-color)' }}>karnav@portfolio</span>:<span style={{ color: 'var(--secondary-color)' }}>~/projects</span>$ {line.content}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-color)', paddingLeft: '0px' }}>{line.content}</div>
                  )}
                </div>
              ))}

              {/* Input Line */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {inputMode === 'command' && (
                  <>
                    <span style={{ color: 'var(--function-color)' }}>karnav@portfolio</span>:<span style={{ color: 'var(--secondary-color)' }}>~/projects</span>$&nbsp;
                  </>
                )}
                {inputMode === 'login_email' && <span style={{ color: 'var(--text-color)' }}>Email:&nbsp;</span>}
                {inputMode === 'login_password' && <span style={{ color: 'var(--text-color)' }}>Password:&nbsp;</span>}

                <input
                  id="terminal-input"
                  type={inputMode === 'login_password' ? "password" : "text"}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleTerminalSubmit}
                  autoComplete="off"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    flex: 1,
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div style={{
        height: '22px',
        backgroundColor: 'var(--accent-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        fontSize: '0.75rem',
        color: '#1e1e2e',
        fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span>main*</span>
          {!isMobile && <span>0 errors, 0 warnings</span>}
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <span>Ln 12, Col 34</span>
            <span>UTF-8</span>
            <span>React</span>
          </div>
        )}
      </div>
    </div>
  );
  console.log("App: Rendered");
}

export default App;
