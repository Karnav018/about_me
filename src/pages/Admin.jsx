import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Admin = () => {
    const [formData, setFormData] = useState({
        title: '',
        tech: '',
        description: '',
        link: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Uploading...');

        try {
            await addDoc(collection(db, "projects"), {
                ...formData,
                createdAt: new Date()
            });
            setStatus('Project added successfully!');
            setFormData({ title: '', tech: '', description: '', link: '' }); // Clear form
            setTimeout(() => setStatus(''), 3000); // Clear status after 3s
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus(`Error: ${error.message}`);
        }
    };

    const handleSeed = async () => {
        if (!confirm("This will add the default projects to the database. Continue?")) return;
        setStatus('Seeding database...');

        const defaultProjects = [
            {
                title: "Facial Emotion Recognition",
                tech: "Python, TensorFlow, Keras, CNN, OpenCV",
                description: "Engineered a Convolutional Neural Network (CNN) to classify facial expressions with high accuracy. Trained on 10,000+ images.",
                link: "https://github.com/Karnav018"
            },
            {
                title: "Automated Program Repair",
                tech: "Python, JavaParser, Defects4J",
                description: "Research pipeline for Automated Program Repair using AST analysis on 835+ Java bugs. Implemented k-hop neighborhood extraction.",
                link: "https://github.com/Karnav018"
            }
        ];

        try {
            for (const project of defaultProjects) {
                await addDoc(collection(db, "projects"), {
                    ...project,
                    createdAt: new Date()
                });
            }
            setStatus('Database seeded successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus(`Seeding error: ${error.message}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px', maxWidth: '600px', fontFamily: 'var(--font-mono)' }}
        >
            <h2 style={{ color: 'var(--accent-color)', marginBottom: '20px' }}>Admin Dashboard</h2>

            <div style={{ marginBottom: '20px', padding: '10px', border: '1px dashed var(--comment-color)', borderRadius: '5px' }}>
                <p style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Quick Actions:</p>
                <button
                    onClick={handleSeed}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: 'var(--function-color)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    Seed Default Projects
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-color)' }}>Project Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-terminal)', border: '1px solid var(--border-color)', color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-color)' }}>Tech Stack</label>
                    <input
                        type="text"
                        name="tech"
                        value={formData.tech}
                        onChange={handleChange}
                        placeholder="Python, React, TensorFlow..."
                        style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-terminal)', border: '1px solid var(--border-color)', color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-color)' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-terminal)', border: '1px solid var(--border-color)', color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-color)' }}>Link (GitHub)</label>
                    <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', backgroundColor: 'var(--bg-terminal)', border: '1px solid var(--border-color)', color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: 'var(--function-color)',
                        color: '#000',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Add Project to Database
                </button>
                {status && <div style={{ marginTop: '10px', color: status.includes('Error') ? 'red' : 'green' }}>{status}</div>}
            </form>
        </motion.div>
    );
};

export default Admin;
