import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootSequence = ({ onComplete }) => {
    const [lines, setLines] = useState([]);

    const bootText = [
        "Initializing KarnavOS v1.0.0...",
        "Loading kernel modules...",
        "Mounting file system...",
        "Starting network interfaces...",
        "Loading React runtime...",
        "Compiling assets...",
        "Starting user interface...",
        "Access granted.",
        "Welcome, User."
    ];

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;

        let sequence = [...bootText];
        if (isMobile) {
            sequence = [
                "Initializing KarnavOS v1.0.0...",
                "Loading kernel modules...",
                "WARNING: MOBILE DEVICE DETECTED",
                "System Optimized for Desktop View...",
                "Proceeding with reduced interface...",
                "Loading React runtime...",
                "Compiling assets...",
                "Starting user interface...",
                "Access granted.",
                "Welcome, User."
            ];
        }

        let totalDelay = 0;
        sequence.forEach((text, index) => {
            let lineDelay = Math.random() * 300 + 100;

            // Add extra pause for the warning message so users can read it
            if (text.includes("WARNING") || text.includes("Optimized for Desktop")) {
                lineDelay = 1500;
            }

            totalDelay += lineDelay;

            setTimeout(() => {
                setLines(prev => [...prev, text]);
                window.scrollTo(0, document.body.scrollHeight);
            }, totalDelay);
        });

        // Finish boot sequence
        setTimeout(() => {
            onComplete();
        }, totalDelay + 800);
    }, []);

    return (
        <div style={{
            backgroundColor: '#000',
            color: '#0f0',
            fontFamily: 'monospace',
            height: '100vh',
            width: '100vw',
            padding: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        }}>
            {lines.map((line, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{ marginBottom: '5px', color: line.includes('WARNING') ? '#ff5555' : line.includes('Optimized') ? '#f1fa8c' : '#0f0' }}
                >
                    <span style={{ color: '#555' }}>[{new Date().toLocaleTimeString()}]</span> {line}
                </motion.div>
            ))}
            <motion.div
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ marginTop: '5px', width: '10px', height: '20px', backgroundColor: '#0f0' }}
            />
        </div>
    );
};

export default BootSequence;
