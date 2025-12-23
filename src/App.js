import React, { useState, useEffect } from 'react';
import './App.css';
import ArcadiaTimer from './components/ArcadiaTimer';

function App() {
  const STORAGE_KEY = 'arcadia_master_beta_storage_v1.2';

  // --- CATEGORY DATA WITH TAILORED MARKET INFO ---
  const initialClaims = {
    'POLITICS & POLICY': { 
        text: "No Claim Injected", analysis: "", source: "", 
        polyMarket: { desc: "2028 Presidential Nominee Odds", odds: "35% Newsom", link: "https://polymarket.com/search?category=Politics" }, 
        kalshi: { desc: "Fed January Interest Rate Decision", odds: "86% No Change", link: "https://kalshi.com/markets/fed" }, 
        votes: 0, experts: 0, cosigns: 0, rebuttals: 0, opinionValue: 50 
    },
    'HEALTH & SCIENCE': { 
        text: "No Claim Injected", analysis: "", source: "", 
        polyMarket: { desc: "Hottest Year on Record (2025)", odds: "12% Prob", link: "https://polymarket.com/search?category=Science" }, 
        kalshi: { desc: "Top Ranked AI Model (End of 2025)", odds: "92% Gemini", link: "https://kalshi.com/markets/kxllm1/yearend-top-llm" }, 
        votes: 0, experts: 0, cosigns: 0, rebuttals: 0, opinionValue: 50 
    },
    'LAW & CRIME': { 
        text: "No Claim Injected", analysis: "", source: "", 
        polyMarket: { desc: "Release of Government 'Epstein Files'", odds: "99% Yes", link: "https://polymarket.com/search?q=files" }, 
        kalshi: { desc: "Supreme Court Privacy Rulings", odds: "Mixed", link: "https://kalshi.com/markets/politics" }, 
        votes: 0, experts: 0, cosigns: 0, rebuttals: 0, opinionValue: 50 
    },
    'CURRENT EVENTS': { 
        text: "No Claim Injected", analysis: "", source: "", 
        polyMarket: { desc: "Russia-Ukraine Ceasefire in 2025", odds: "1% Yes", link: "https://polymarket.com/search?q=ukraine" }, 
        kalshi: { desc: "Recession Probability (Q1 2025)", odds: "15% Yes", link: "https://kalshi.com/markets/economics" }, 
        votes: 0, experts: 0, cosigns: 0, rebuttals: 0, opinionValue: 50 
    }
  };

  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialClaims;
  });

  const [username, setUsername] = useState(localStorage.getItem('arcadia_user') || "");
  const [tempUser, setTempUser] = useState("");
  const [balance, setBalance] = useState(() => parseInt(localStorage.getItem('arcadia_balance')) || 1000);
  const [currentCategory, setCurrentCategory] = useState('POLITICS & POLICY');
  const [stake, setStake] = useState(100);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const currentClaim = claims[currentCategory];

  // --- MANUAL INPUT STATE ---
  const [manualText, setManualText] = useState("");
  const [manualAnalysis, setManualAnalysis] = useState("");
  const [manualSource, setManualSource] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    localStorage.setItem('arcadia_balance', balance.toString());
    localStorage.setItem('arcadia_user', username);
  }, [claims, balance, username]);

  const updateClaimData = (type) => {
    const updated = { ...claims };
    if (type === 'cosign') updated[currentCategory].cosigns += 1;
    if (type === 'rebut') updated[currentCategory].rebuttals += 1;
    if (type === 'vote') {
      if (balance < stake) return alert("Insufficient AT");
      setBalance(prev => prev - parseInt(stake));
      updated[currentCategory].votes += 1;
    }
    setClaims(updated);
  };

  const backupToFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(claims, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "arcadia_claims_backup.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ONBOARDING */}
      {!username && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ color: '#458d83' }}>Arcadia Beta</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '25px' }}>Enter your permanent username for the leaderboards.</p>
            <input value={tempUser} onChange={(e) => setTempUser(e.target.value)} placeholder="e.g. DataSleuth_99" style={{ width: '80%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button onClick={() => setUsername(tempUser)} style={{ width: '80%', padding: '12px', background: '#458d83', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ENTER TERMINAL</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ color: '#458d83', margin: 0, fontSize: '26px', fontWeight: 'bold' }}>Arcadia</h1>
          <span style={{ fontSize: '11px', color: '#999', letterSpacing: '1px' }}>VERIFIED TRUTH EXCHANGE</span>
        </div>
        <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #eee', textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#999', fontWeight: 'bold' }}>USER: {username}</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{balance.toLocaleString()} <span style={{ color: '#458d83' }}>AT</span></div>
        </div>
      </nav>

      <div style={{ display: 'flex', padding: '30px', gap: '30px', maxWidth: '1440px', margin: '0 auto', flex: 1 }}>
        
        {/* LEFT NAV */}
        <aside style={{ width: '220px', textAlign: 'left' }}>
          <div style={{ padding: '20px', background: '#1a1d23', borderRadius: '12px', marginBottom: '20px', color: '#fff' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#458d83' }}>NEXT SETTLEMENT</span>
            <ArcadiaTimer />
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#6e45e2' }}>TOP REPUTATION</h4>
            {['TruthSeeker_X', 'Alpha_Dog', 'Policy_Wonk'].map((u, i) => (
              <div key={u} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{u}</span>
                <strong>{15000 - (i * 1200)}</strong>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN GAME */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '25px' }}>
            {Object.keys(claims).map(cat => (
              <button key={cat} onClick={() => {setCurrentCategory(cat); setEvidenceOpen(false);}} style={{ flex: 1, padding: '12px 5px', fontSize: '10px', fontWeight: 'bold', border: 'none', background: currentCategory === cat ? '#458d83' : 'transparent', color: currentCategory === cat ? 'white' : '#999', cursor: 'pointer', borderRadius: '4px' }}>{cat}</button>
            ))}
          </div>

          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #eee', textAlign: 'left', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '28px', lineHeight: '1.4', marginBottom: '30px', fontWeight: '500' }}>"{currentClaim.text}"</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <button onClick={() => updateClaimData('vote')} style={{ flex: 1, padding: '20px', borderRadius: '12px', border: 'none', background: '#4a90e2', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>TRUE</button>
              <button onClick={() => updateClaimData('vote')} style={{ flex: 1, padding: '20px', borderRadius: '12px', border: 'none', background: '#f66', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>FALSE</button>
            </div>
            
            <div style={{ background: '#fcfcfc', padding: '20px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}><span>STAKE INTENSITY</span><span style={{ color: '#458d83' }}>{stake} AT</span></div>
              <input type="range" min="10" max="500" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: '100%', accentColor: '#458d83' }} />
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button onClick={() => setEvidenceOpen(!evidenceOpen)} style={{ background: '#1a1d23', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '11px', border: 'none', cursor: 'pointer', letterSpacing: '1px' }}>{evidenceOpen ? 'CLOSE DOSSIER' : 'OPEN EVIDENCE DOSSIER'}</button>
              {evidenceOpen && (
                <div style={{ marginTop: '20px', padding: '25px', background: '#f9f9f9', borderRadius: '12px', borderLeft: '5px solid #458d83' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        <button onClick={() => updateClaimData('cosign')} style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #238636', color: '#238636', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>+ COSIGN ({currentClaim.cosigns})</button>
                        <button onClick={() => updateClaimData('rebut')} style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #da3633', color: '#da3633', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>- REBUT ({currentClaim.rebuttals})</button>
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{currentClaim.analysis}</p>
                    <a href={currentClaim.source} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '20px', color: '#4a90e2', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>Verify Source Document ↗</a>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* PREDICTION MARKETS BOX */}
        <aside style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #eee', textAlign: 'left' }}>
            <h4 style={{ color: '#6e45e2', margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '1px' }}>PREDICTION MARKETS</h4>
            <p style={{ fontSize: '10px', color: '#999', marginBottom: '20px', lineHeight: '1.4' }}>Real-time probability data from external financial and crypto exchanges.</p>
            
            {/* POLYMARKET LINK */}
            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ fontSize: '9px', color: '#458d83', fontWeight: 'bold', marginBottom: '5px' }}>POLYMARKET (DECENTRALIZED)</div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>{currentClaim.polyMarket.desc}</div>
              <a href={currentClaim.polyMarket.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontWeight: '500' }}>View Market</span>
                <strong style={{ color: '#458d83' }}>{currentClaim.polyMarket.odds}</strong>
              </a>
            </div>

            {/* KALSHI LINK */}
            <div>
              <div style={{ fontSize: '9px', color: '#4a90e2', fontWeight: 'bold', marginBottom: '5px' }}>KALSHI (US REGULATED)</div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>{currentClaim.kalshi.desc}</div>
              <a href={currentClaim.kalshi.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontWeight: '500' }}>View Market</span>
                <strong style={{ color: '#4a90e2' }}>{currentClaim.kalshi.odds}</strong>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* ADMIN DATA BAR */}
      <section style={{ backgroundColor: '#1a1d23', padding: '20px', borderTop: '4px solid #458d83', color: '#fff' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#458d83', fontSize: '11px' }}>BETA INJECTION PORT</h4>
                <button onClick={backupToFile} style={{ background: '#333', color: '#fff', padding: '6px 15px', border: '1px solid #444', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>BACKUP ALL DATA TO FILE</button>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <input value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Claim Text..." style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                <input value={manualSource} onChange={(e) => setManualSource(e.target.value)} placeholder="Source URL..." style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                <textarea value={manualAnalysis} onChange={(e) => setManualAnalysis(e.target.value)} placeholder="Full Evidence Analysis..." style={{ flex: 2, padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', height: '38px', borderRadius: '4px' }} />
                <button onClick={() => {
                    if(!manualText) return;
                    const updated = {...claims};
                    updated[currentCategory] = {...updated[currentCategory], text: manualText, source: manualSource, analysis: manualAnalysis, votes: 0, cosigns: 0, rebuttals: 0};
                    setClaims(updated); setManualText(""); setManualSource(""); setManualAnalysis("");
                }} style={{ background: '#458d83', color: 'white', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>DEPLOY</button>
            </div>
        </div>
      </section>
    </div>
  );
}

export default App;