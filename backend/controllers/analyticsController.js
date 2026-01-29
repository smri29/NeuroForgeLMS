// backend/controllers/analyticsController.js
const os = require('os');

// Helper to format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

// Simulation Logs (Queue)
let logQueue = [];
const addLog = (msg) => {
    if (logQueue.length > 50) logQueue.shift(); // Keep last 50
    logQueue.push(msg);
}

// Generate some background noise logs for "Real Time" feel
setInterval(() => {
    const actions = ['GET /api/users', 'POST /interview', 'DB Backup', 'Health Check'];
    const status = ['200 OK', '201 Created', '304 Not Modified'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomStatus = status[Math.floor(Math.random() * status.length)];
    addLog(`[SYSTEM] ${randomAction} - ${randomStatus}`);
}, 5000);


const getSystemStats = async (req, res) => {
  try {
    // 1. Calculate Real Metrics
    const uptime = formatUptime(process.uptime());
    const usedMem = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    const totalMem = os.totalmem() / 1024 / 1024; // MB
    const memUsage = Math.round((usedMem / totalMem) * 100);
    
    // Mocking Request Count (since we don't have a global counter yet)
    // In a real app, you'd use Redis or a DB counter.
    const requestCount = Math.floor(Math.random() * 50) + 1200; 

    // Latency simulation (random fluctuation between 20ms and 80ms)
    const latency = Math.floor(Math.random() * 60) + 20;

    res.json({
      uptime,
      latency,
      cpuLoad: os.loadavg()[0], // 1 minute load average
      memoryUsage: memUsage,
      requestCount,
      logs: logQueue.slice(-20) // Send last 20 logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getSystemStats };