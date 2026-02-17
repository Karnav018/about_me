import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VscPlay } from "react-icons/vsc";
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

const ProjectCell = ({ title, tech, description, link, problemSolved, logToTerminal }) => {
    const handleRun = () => {
        logToTerminal(`> python3 run_project.py "${title}"`);
        logToTerminal(`Initializing environment...`);
        setTimeout(() => {
            logToTerminal(`Loading weights for ${title}...[OK]`);
            window.open(link, '_blank');
            logToTerminal(`Project repository opened for: ${title} `);
        }, 1000);
    };

    return (
        <div className="line-highlight" style={{ marginBottom: '30px', border: '1px solid var(--border-color)', borderRadius: '5px', overflow: 'hidden', transition: 'all 0.2s ease' }}>
            <div style={{ backgroundColor: 'var(--bg-sidebar)', padding: '5px 10px', fontSize: '0.8rem', color: 'var(--comment-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span>In [1]:</span>
                    <span>Python 3 (ippykernel)</span>
                </div>
                <button
                    onClick={handleRun}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--function-color)',
                        color: 'var(--function-color)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        marginLeft: 'auto'
                    }}
                >
                    <VscPlay /> Run Cell
                </button>
            </div>
            <div style={{ padding: '15px', backgroundColor: 'var(--bg-terminal)', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--function-color)' }}>def</span>
                    <span style={{ color: 'var(--secondary-color)' }}>{title.replace(/\s+/g, '_').toLowerCase()}</span>():
                </div>
                <div style={{ paddingLeft: '20px', color: 'var(--string-color)' }}>
                    """<br />
                    {description}<br />
                    <br />
                    Tech Stack: {tech}<br />
                    """
                </div>
                <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {/* Problems Solved Section */}
                    {problemSolved && problemSolved.length > 0 && (
                        <div style={{ marginBottom: '10px', color: 'var(--comment-color)' }}>
                            # Key Challenges Solved:<br />
                            {problemSolved.map((prob, i) => (
                                <span key={i}># - {prob}<br /></span>
                            ))}
                        </div>
                    )}
                    <span style={{ color: 'var(--keyword-color)' }}>print</span>(<span style={{ color: 'var(--string-color)' }}>"See Project Details..."</span>)
                </div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-color)' }}>Out[1]: </span>
                <span style={{ color: 'var(--comment-color)', fontStyle: 'italic' }}> {'< Click "Run Cell" to view demo'}</span>
            </div>
        </div>
    );
};

const Projects = ({ logToTerminal }) => {
    const [dbProjects, setDbProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setIsLoading(false);
            return;
        }

        let unsubscribe;

        try {
            // QA Fix: Limit execution to top 20 projects for performance (Scalability)
            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(20));

            // Use onSnapshot for Real-Time Updates (The Hacker Way)
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDbProjects(projects);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching projects:", error);
                if (logToTerminal) logToTerminal(`Error fetching projects: ${error.message}`);
                setIsLoading(false);
            });

        } catch (error) {
            console.error("Error setting up listener:", error);
            setIsLoading(false);
        }

        // Cleanup listener on unmount
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [logToTerminal]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px', maxWidth: '800px' }}
        >
            <h2 style={{ color: 'var(--text-color)', marginBottom: '20px' }}>Projects.ipynb</h2>

            {isLoading ? (
                <div style={{ color: 'var(--comment-color)', fontStyle: 'italic', padding: '20px' }}>
                    Loading projects from Firestore...
                </div>
            ) : dbProjects.length > 0 ? (
                dbProjects.map(project => (
                    <ProjectCell
                        key={project.id}
                        title={project.title}
                        tech={project.tech}
                        description={project.description}
                        link={project.link}
                        problemSolved={project.problemSolved}
                        logToTerminal={logToTerminal}
                    />
                ))
            ) : (
                <div style={{ color: 'var(--comment-color)', fontStyle: 'italic', padding: '20px' }}>
                    # No projects found in database.<br />
                </div>
            )}

        </motion.div>
    );
};

export default Projects;
