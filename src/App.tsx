import React, { useState, useEffect } from 'react';
import { Play, Lightbulb, Flame, Terminal, Shield, AlertTriangle, Zap, Target, Lock } from 'lucide-react';

const levels = [
  {
    id: 1,
    title: "Defend: SYN Flood",
    type: "defend",
    story: "Hackers are flooding your family's server with SYN packets!",
    task: "Block SYN packets using iptables.",
    starterCode: "# Run command to block SYN packets\n",
    expectedOutput: "Rule added: Block SYN packets.",
    solution: "iptables -A INPUT -p tcp --syn -j DROP",
    hint: "Use: iptables -A INPUT -p tcp --syn -j DROP",
    assetsChange: 500,
    securityChange: 10
  },
  {
    id: 2,
    title: "Attack: Nmap Scan",
    type: "attack",
    story: "You found the hacker's IP. Time to scan their network.",
    task: "Perform a basic scan on the target '192.168.1.1'.",
    starterCode: "# Run nmap on the target\n",
    expectedOutput: "Nmap scan report for 192.168.1.1\nHost is up.\nPORT   STATE SERVICE\n80/tcp open  http",
    solution: "nmap 192.168.1.1",
    hint: "Use: nmap 192.168.1.1",
    assetsChange: 200,
    securityChange: 5
  },
  {
    id: 3,
    title: "Defend: Close Port",
    type: "defend",
    story: "A hacker is trying to access your database via port 3306.",
    task: "Close port 3306.",
    starterCode: "# Run command to close port\n",
    expectedOutput: "Port 3306 closed.",
    solution: "ufw deny 3306",
    hint: "Use: ufw deny 3306",
    assetsChange: 800,
    securityChange: 15
  },
];

const AssetShield = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userCode, setUserCode] = useState(levels[0].starterCode);
  const [assets, setAssets] = useState(10000);
  const [security, setSecurity] = useState(50);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [output, setOutput] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    const messages = [
      "Welcome, guardian. Today is a good day to secure the future. Remember, kindness is the best firewall.",
      "Greetings, defender. Your family relies on your vigilance. Help someone in need today, and always save for a rainy day.",
      "The network is quiet, for now. Stay sharp. A small act of kindness goes a long way. Don't forget to save for the unexpected."
    ];
    setWelcomeMessage(messages[new Date().getDate() % messages.length]);
  }, []);

  const level = levels.find(l => l.id === currentLevel);

  useEffect(() => {
    if (level) {
      setUserCode(level.starterCode);
      setFeedback(null);
      setOutput("");
    }
  }, [currentLevel]);

  const simulateExecution = (code: string) => {
    const parts = code.trim().split(/\s+/);
    if (parts[0] !== 'nmap') return "Error: Command not recognized. Did you mean 'nmap'?";
    
    const flags = parts.filter(p => p.startsWith('-'));
    const target = parts.find(p => !p.startsWith('-') && p !== 'nmap');
    
    if (!target) return "Error: No target specified.";
    
    if (flags.includes('-sV')) return "PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.41";
    if (flags.includes('-sS')) return "Starting Nmap scan (SYN scan)\nPORT   STATE SERVICE\n80/tcp open  http";
    if (flags.includes('-sT')) return "Starting Nmap scan (TCP connect scan)\nPORT   STATE SERVICE\n80/tcp open  http";
    if (flags.includes('-sU')) return "Starting Nmap scan (UDP scan)\nPORT    STATE         SERVICE\n53/udp  open|filtered domain";
    
    return "Nmap scan report for " + target + "\nHost is up.\nPORT   STATE SERVICE\n80/tcp open  http";
  };

  const handleRun = () => {
    if (!level) return;
    
    let result = "";
    if (level.type === 'attack') {
      result = simulateExecution(userCode);
    } else {
      // For defend levels, keep simple string match for now
      result = userCode.trim() === level.solution ? level.expectedOutput : "Error: Incorrect defense command.";
    }
    
    setOutput(result);

    if (result.trim() === level.expectedOutput.trim()) {
      setAssets(prev => prev + level.assetsChange);
      setSecurity(prev => Math.min(100, prev + level.securityChange));
      setFeedback({ type: 'success', message: `🎉 Success! Assets +${level.assetsChange}, Security +${level.securityChange}` });
      setTimeout(() => {
        if (currentLevel < levels.length) setCurrentLevel(prev => prev + 1);
      }, 2000);
    } else {
      setAssets(prev => Math.max(0, prev - 500));
      setSecurity(prev => Math.max(0, prev - 10));
      setFeedback({ type: 'error', message: "❌ Failed! Assets -500, Security -10. Try again." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Shield className="text-red-500 w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tighter">AssetShield</h1>
        </div>
        <div className="text-xs text-slate-500 italic max-w-sm text-right">{welcomeMessage}</div>
        <div className="flex gap-6 font-mono text-sm">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500"/> Assets: ${assets}</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500"/> Security: {security}%</div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{level?.title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${level?.type === 'defend' ? 'bg-blue-900 text-blue-200' : 'bg-red-900 text-red-200'}`}>
              {level?.type.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-400 mb-6 italic">"{level?.story}"</p>
          <div className="bg-slate-950 p-4 rounded-xl font-mono text-sm mb-6 border border-slate-800">
            <p className="text-slate-500 mb-2"># Task</p>
            <p>{level?.task}</p>
          </div>
          <button onClick={handleRun} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
            <Play className="w-4 h-4" /> Execute
          </button>
          {feedback && (
            <div className={`mt-4 p-4 rounded-xl ${feedback.type === 'success' ? 'bg-green-950 text-green-200' : 'bg-red-950 text-red-200'}`}>
              {feedback.message}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-48 bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-sm focus:outline-none focus:border-red-500"
          />
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-sm min-h-[8rem]">
            <p className="text-slate-500 mb-2"># Terminal Output</p>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AssetShield;
