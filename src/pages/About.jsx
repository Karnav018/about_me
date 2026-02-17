import React from 'react';
import { motion } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../context/ThemeContext';

const About = () => {
    const { theme } = useTheme();
    const codeString = `
class KarnavPrajapati:
    def __init__(self):
        self.name = "Karnav Prajapati"
        self.role = "Machine Learning Engineer"
        self.education = [
            {
                "degree": "Bachelor of Engineering in IT",
                "institution": "A D Patel Institute of Technology",
                "graduating": "May 2027"
            },
            {
                "degree": "Diploma in IT",
                "institution": "R.C. Technical Institute",
                "graduated": "May 2023"
            }
        ]
        self.location = "Ahmedabad, India"

    def get_summary(self):
        return """
        Aspiring ML Engineer with a knack for data analysis 
        and model building. Passionate about solving real-world 
        problems using AI.
        """

    def contact_me(self):
        return {
            "email": "karnav.p.018@gmail.com",
            "linkedin": "linkedin.com/in/karnav-prajapati",
            "github": "github.com/Karnav018"
        }
`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '20px' }}
        >
            <div style={{ marginBottom: '10px', color: 'var(--comment-color)' }}># About.py - Class Definition</div>
            <SyntaxHighlighter
                language="python"
                style={theme === 'light' ? github : dracula}
                customStyle={{ background: 'transparent', padding: '0', fontSize: '1rem', lineHeight: '1.5' }}
                showLineNumbers={true}
                wrapLines={true}
            >
                {codeString}
            </SyntaxHighlighter>
        </motion.div>
    );
};

export default About;
