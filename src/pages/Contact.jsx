import React from 'react';
import { motion } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
    const { theme } = useTheme();
    const cssString = `
.contact-info {
  email: "karnav.p.018@gmail.com";
  linkedin: "linkedin.com/in/karnav-prajapati";
  github: "github.com/Karnav018";
  phone: "+91 9313343975";
}

.socials:hover {
  cursor: pointer;
  color: #ff79c6; /* Neon Pink */
}

/* 
  Feel free to reach out for:
  - Machine Learning Roles
  - Data Science Projects
  - Hackathon Collaborations
*/
`;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '20px' }}
        >
            <div style={{ marginBottom: '10px', color: 'var(--comment-color)' }}>/* Contact.css */</div>
            <SyntaxHighlighter
                language="css"
                style={theme === 'light' ? github : dracula}
                customStyle={{ background: 'transparent', padding: '0', fontSize: '1rem' }}
                showLineNumbers={true}
            >
                {cssString}
            </SyntaxHighlighter>

            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <a href="mailto:karnav.p.018@gmail.com" style={{ padding: '10px 20px', backgroundColor: 'var(--accent-color)', color: '#1e1e2e', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none' }}>Email Me</a>
                <a href="https://linkedin.com/in/karnav-prajapati-29009632b" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', border: '1px solid var(--secondary-color)', color: 'var(--secondary-color)', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none' }}>LinkedIn</a>
            </div>
        </motion.div>
    );
};

export default Contact;
