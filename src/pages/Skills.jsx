import React from 'react';
import { motion } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../context/ThemeContext';

const Skills = () => {
    const { theme } = useTheme();
    const skillsData = {
        languages: ["Python", "SQL", "JavaScript", "C++"],
        ml_libraries: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "OpenCV"],
        deep_learning: ["TensorFlow", "Keras"],
        tools: ["Git", "GitHub", "VS Code", "Jupyter Notebooks"],
        web: ["HTML", "CSS", "ReactJS (Foundational)"],
        soft_skills: ["Problem Solving", "Adaptability", "Teamwork"]
    };

    const codeString = JSON.stringify(skillsData, null, 4);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '20px' }}
        >
            <div style={{ marginBottom: '10px', color: 'var(--comment-color)' }}>// Skills.json - Tech Stack</div>
            <SyntaxHighlighter
                language="json"
                style={theme === 'light' ? github : dracula}
                customStyle={{ background: 'transparent', padding: '0', fontSize: '1rem' }}
                showLineNumbers={true}
            >
                {codeString}
            </SyntaxHighlighter>
        </motion.div>
    );
};

export default Skills;
