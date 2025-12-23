import React, { useState } from 'react';

// --- SUB-COMPONENT: VERDICT SCORE CARD ---
const VerdictScoreCard = ({ current, userProfile, stakeAmount, onClose }) => {
  const isCorrect = current.correct === 'true';
  const baseReward = isCorrect ? 150 : -75;
  const accuracyBonus = Math.round(baseReward * (userProfile.accuracy / 100));
  const totalPayout = isCorrect ? baseReward + accuracyBonus : baseReward;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '4px solid #458d83' }}>
        <h2 style={{ color: '#458d83', margin: '0 0 10px 0' }}>Daily Resolution</h2>
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>"{current.text}"</div>
          <div style={{ color: isCorrect ? '#166534' : '#991b1b', fontWeight: '900', fontSize: '24px', marginTop: '10px' }}>
            {isCorrect ? '✓ ACCURATE' : '✗ INACCURATE'}
          </div>
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px' }}>TOTAL: {totalPayout > 0 ? '+' : ''}{totalPayout} AT</div>
        <button onClick={onClose} style={{ width: '100%', padding: '18px', backgroundColor: '#458d83', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Claim & Reset</button>
      </div>
    </div>
  );
};

// --- MAIN TERMINAL ---
function ClaimsView() {
  const [view, setView] = useState('terminal');
  const [selectedCategory, setSelectedCategory] = useState('Politics & Policy');
  const [hasVoted, setHasVoted] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showDebate, setShowDebate] = useState(false);
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "TruthSeeker_01", points: 1000, accuracy: 75.0 });
  const [evidenceSliders, setEvidenceSliders] = useState({});
  const [commentSort, setCommentSort] = useState('recent');

  const isVerdictPhase = new Date().getHours() >= 18;

  const categoryData = {
    "Politics & Policy": { 
        text: "Federal energy reduction guidelines for data centers set for 2026.", 
        correct: "true", votes: "1,325", experts: "17", 
        evidence: [
          { id: 'p1', label: "Executive Order 14008 Section 4", url: "https://www.whitehouse.gov/" },
          { id: 'p2', label: "DOE 2024 Grid White Paper", url: "https://www.energy.gov/" }
        ],
        markets: [
          { p: "Polymarket", l: "Trump Fed Nominee", o: "54% YES", url: "https://polymarket.com" },
          { p: "Kalshi", l: "GDP Growth 2026", o: "62% UP", url: "https://kalshi.com" }
        ]
    },
    "Health & Science": { 
        text: "Enzyme-based plastics achieve 100% biodegradation in 90 days.", 
        correct: "true", votes: "842", experts: "12",
        evidence: [{ id: 'h1', label: "Nature Journal Vol 592", url: "https://www.nature.com" }],
        markets: [{ p: "Polymarket", l: "AI Person of Year", o: "39% YES", url: "https://polymarket.com" }]
    },
    "Law & Crime": { 
        text: "SCOTUS limits digital asset seizure scope in interstate fraud.", 
        correct: "false", votes: "2,105", experts: "24",
        evidence: [{ id: 'l1', label: "SCOTUS Case 23-456 Syllabus", url: "https://www.supremecourt.gov" }],
        markets: [{ p: "Polymarket", l: "Crypto Ruling", o: "12% YES", url: "https://polymarket.com" }]
    },
    "Current Events": { 
        text: "North Atlantic autonomous vessel traffic up 40%.", 
        correct: "true", votes: "3,412", experts: "9",
        evidence: [{ id: 'c1', label: "IMO Autonomous Fleet Report", url: "https://www.imo.org" }],
        markets: [{ p: "Kalshi", l: "Shipping Costs", o: "68% UP", url: "https://kalshi.com" }]
    }
  };

  const current = categoryData[selectedCategory];

  // --- FUNCTIONAL ACTIONS ---
  const handleVote = (choice) => {
    const isCorrect = choice === current.correct;
    const baseReward = isCorrect ? 150 : -75;
    const accuracyBonus = Math.round(baseReward * (userProfile.accuracy / 100));
    const totalPayout = isCorrect ? baseReward + accuracyBonus : baseReward;

    setUserProfile(prev => ({
      ...prev,
      points: prev.points + totalPayout,
      accuracy: isCorrect ? Math.min(prev.accuracy + 0.4, 100) : Math.max(prev.accuracy - 0.7, 0)
    }));
    setHasVoted(true); // Locks interaction and triggers resolution view
  };

  const handleActionBoost = (type) => {
    const boost = type === 'cosign' ? 5 : 2;
    setUserProfile(prev => ({ ...prev, points: prev.points + boost })); // Real point boost
  };

  const Widget = ({ title, children }) => (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f3e8ff', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#4c1d95', fontWeight: 'bold' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#fdfaff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px' }}>
      
      {/* HEADER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => setView('terminal')} style={{ cursor: 'pointer' }}>
          <h1 style={{ color: '#458d83', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Arcadia</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Truth Discovery Game</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '900', fontSize: '24px', color: '#1e293b' }}>{userProfile.points.toLocaleString()} <span style={{fontSize: '14px', color: '#458d83'}}>AT</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TRUST: {userProfile.accuracy.toFixed(1)}%</div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '30px' }}>
        
        {/* LEFT NAV */}
        <div>
          <button onClick={() => setView('terminal')} style={{ width: '100%', padding: '15px', backgroundColor: view === 'terminal' ? '#458d83' : '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', fontWeight:'bold', color: view==='terminal'?'#fff':'#334155' }}>Live Terminal</button>
          <button onClick={() => setView('archive')} style={{ width: '100%', padding: '15px', backgroundColor: view === 'archive' ? '#458d83' : '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight:'bold', color: view==='archive'?'#fff':'#334155' }}>Archive</button>
        </div>

        {/* CENTER COLUMN */}
        <div>
          {view === 'terminal' ? (
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                {Object.keys(categoryData).map(cat => (
                  <button key={cat} onClick={() => {setSelectedCategory(cat); setHasVoted(false);}} 
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: selectedCategory === cat ? '#458d83' : '#fff', color: selectedCategory === cat ? '#fff' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}>{cat}</button>
                ))}
              </div>
              
              <h2 style={{ fontSize: '28px', lineHeight: '1.4', marginBottom: '40px' }}>"{current.text}"</h2>

              {!hasVoted && !isVerdictPhase ? (
                <>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <button onClick={() => handleVote('true')} style={{ flex: 1, padding: '25px', backgroundColor: '#60a5fa', color: '#fff', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize:'20px' }}>TRUE</button>
                    <button onClick={() => handleVote('false')} style={{ flex: 1, padding: '25px', backgroundColor: '#f87171', color: '#fff', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize:'20px' }}>FALSE</button>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '13px', color: '#64748b' }}><span>STAKE CONFIDENCE</span><span style={{color:'#458d83'}}>{stakeAmount} AT</span></div>
                    <input type="range" min="10" max="1000" step="10" value={stakeAmount} onChange={(e) => setStakeAmount(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#458d83', cursor:'pointer' }} />
                  </div>
                </>
              ) : isVerdictPhase ? (
                <button onClick={() => setShowVerdictModal(true)} style={{ width: '100%', padding: '25px', backgroundColor: '#458d83', color: '#fff', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', marginBottom:'30px', cursor:'pointer' }}>VIEW DAILY VERDICT</button>
              ) : (
                <div style={{ textAlign: 'center', backgroundColor: '#f0fdf4', padding: '40px', borderRadius: '16px', border: '2px solid #bbf7d0', marginBottom: '30px' }}>
                   <div style={{ fontSize: '32px', fontWeight: '900', color: '#166534' }}>✓ VOTE SUBMITTED</div>
                   <button onClick={() => setHasVoted(false)} style={{ marginTop: '20px', padding: '12px 25px', backgroundColor: '#458d83', color: '#fff', border: 'none', borderRadius: '8px', cursor:'pointer' }}>Unlock Claim</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                 <button onClick={() => setShowEvidence(true)} style={{ flex: 1, padding: '15px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Evidence Dossier</button>
                 <button onClick={() => setShowDebate(true)} style={{ flex: 1, padding: '15px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 'bold', cursor:'pointer' }}>Community Debate</button>
              </div>
            </div>
          ) : <Widget title="Archive">Finalized verdicts settled here.</Widget>}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <Widget title="Claim Metrics">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Total votes:</span><b>{current.votes}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'10px' }}><span>Experts:</span><b>{current.experts}</b></div>
          </Widget>
          <Widget title="Prediction Markets">
            {current.markets.map(m => (
              <div key={m.l} style={{ marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                <a href={m.url} target="_blank" rel="noreferrer" style={{ color: '#7c3aed', fontSize: '12px', textDecoration: 'none', fontWeight:'bold' }}>{m.p}: "{m.l}"</a>
                <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{m.o}</div>
              </div>
            ))}
          </Widget>
          <Widget title="Leaderboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>1. TruthSeeker_X</span><b>15,600 AT</b></div>
          </Widget>
        </div>
      </div>

      {/* EVIDENCE OVERLAY: FULLY INTERACTIVE */}
      {showEvidence && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', maxWidth: '650px', width: '100%', maxHeight:'90vh', overflowY:'auto' }}>
            <h2 style={{ margin: '0 0 30px 0' }}>Evidence Dossier</h2>
            {current.evidence.map((e) => (
              <div key={e.id} style={{ padding: '25px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <a href={e.url} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', color: '#458d83' }}>{e.label} 🔗</a>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleActionBoost('cosign')} style={{ padding: '8px 14px', fontSize: '11px', backgroundColor: '#dcfce7', border: 'none', borderRadius: '6px', color:'#166534', fontWeight:'bold', cursor:'pointer' }}>Co-Sign</button>
                    <button onClick={() => handleActionBoost('rebut')} style={{ padding: '8px 14px', fontSize: '11px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', color:'#991b1b', fontWeight:'bold', cursor:'pointer' }}>Rebut</button>
                  </div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color:'#64748b' }}>FACT VS OPINION: {evidenceSliders[e.id] || 50}%</div>
                <input type="range" style={{ width: '100%', accentColor: '#458d83' }} onChange={(val) => setEvidenceSliders(prev => ({ ...prev, [e.id]: val.target.value }))} />
              </div>
            ))}
            <div style={{ padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', fontWeight:'bold', marginBottom:'20px' }}>+ PROPOSE NEW EVIDENCE (LOCKED)</div>
            <button onClick={() => setShowEvidence(false)} style={{ width: '100%', padding: '18px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Close Dossier</button>
          </div>
        </div>
      )}

      {/* COMMUNITY DEBATE OVERLAY */}
      {showDebate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{margin:0}}>Community Debate</h2>
              <div style={{display:'flex', gap:'10px', fontSize:'12px', alignItems:'center'}}>
                <span onClick={()=>setCommentSort('recent')} style={{cursor:'pointer', fontWeight:commentSort==='recent'?'bold':'normal', color:commentSort==='recent'?'#458d83':'#94a3b8'}}>RECENT</span>
                <span onClick={()=>setCommentSort('popular')} style={{cursor:'pointer', fontWeight:commentSort==='popular'?'bold':'normal', color:commentSort==='popular'?'#458d83':'#94a3b8'}}>POPULAR</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px', marginBottom:'30px' }}>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '14px' }}><b>FactFinder:</b> Is the DOE white paper current?</div>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '14px' }}><b>PolicyWonk:</b> Impact on regional clusters will be high.</div>
            </div>
            <button onClick={() => setShowDebate(false)} style={{ width: '100%', padding: '18px', backgroundColor: '#334155', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border:'none' }}>Close Debate</button>
          </div>
        </div>
      )}

      {showVerdictModal && <VerdictScoreCard current={current} userProfile={userProfile} stakeAmount={stakeAmount} onClose={() => setShowVerdictModal(false)} />}
    </div>
  );
}

export default ClaimsView;