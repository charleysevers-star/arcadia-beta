import React, { useState, useEffect } from 'react';

const ArcadiaTimer = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const [phase, setPhase] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const est = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
            const hour = est.getHours();
            
            let target = new Date(est);
            let currentPhase = "";

            if (hour >= 9 && hour < 18) {
                currentPhase = "INVESTIGATION LIVE";
                target.setHours(18, 0, 0, 0); 
            } else {
                currentPhase = "NEXT DISCOVERY STARTS";
                if (hour >= 18) target.setDate(target.getDate() + 1);
                target.setHours(9, 0, 0, 0);
            }

            const diff = target - est;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            setPhase(currentPhase);
            setTimeLeft(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ 
            background: 'rgba(0, 242, 255, 0.05)', 
            color: '#00f2ff', 
            padding: '15px', 
            border: '1px solid #00f2ff', 
            borderRadius: '4px', 
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '20px'
        }}>
            <div style={{ fontSize: '10px', color: '#aaa' }}>{phase}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft}</div>
        </div>
    );
};

export default ArcadiaTimer;