import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px', fontFamily: 'var(--font-mono)', color: 'var(--text-color)' }}
        >
            <h1 style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '10px' }}>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, staggerChildren: 0.1 }}
                >
                    {Array.from("Hi, I'm Karnav Prajapati").map((char, index) => (
                        <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>{char}</motion.span>
                    ))}
                </motion.span>
            </h1>
            <h2 style={{ color: 'var(--secondary-color)', fontSize: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: '20px' }}>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    Machine Learning Engineer
                </motion.span>
            </h2>

            <div style={{ backgroundColor: 'var(--bg-terminal)', padding: '20px', borderRadius: '5px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
                    README.md
                </h3>
                <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                    I am an aspiring <strong style={{ color: 'var(--function-color)' }}>Machine Learning Engineer</strong> and B.E. Information Technology student with a strong foundation in Python, data analysis, and machine learning algorithms.
                </p>
                <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                    Experienced in data preprocessing, feature engineering, and building supervised learning models using Scikit-learn and TensorFlow.
                </p>

                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'var(--string-color)' }}>
                    <li className="line-highlight" style={{ padding: '2px 5px', borderRadius: '3px' }}>🔭 Currently working on Advanced Agentic Coding</li>
                    <li className="line-highlight" style={{ padding: '2px 5px', borderRadius: '3px' }}>🌱 Learning Deep Learning and Computer Vision</li>
                    <li className="line-highlight" style={{ padding: '2px 5px', borderRadius: '3px' }}>👯 Looking to collaborate on open source ML projects</li>
                    <li className="line-highlight" style={{ padding: '2px 5px', borderRadius: '3px' }}>⚡ Fun fact: I treat my neural networks better than my sleep schedule.</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default Home;
