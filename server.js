
/**
 * Palm Wave Advisory - Backend (Express.js)
 * Lightweight demo API storing JSON files locally under /data
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { customAlphabet } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

app.use(helmet());
app.use(cors());
app.use(express.json({limit: '2mb'}));
app.use(morgan('dev'));

const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');

function readJson(file){
  try{
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  }catch(e){
    return [];
  }
}
function writeJson(file, data){
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf8');
}

// Static site
app.use('/', express.static(PUBLIC_DIR));

// Health
app.get('/api/health', (_req,res)=> res.json({ok:true, ts: Date.now()}));

// Feedback (visitor satisfaction signals)
app.get('/api/feedback', (_req,res)=>{
  const data = readJson('feedback.json');
  res.json(data);
});
app.post('/api/feedback', (req,res)=>{
  const { name, email, coast, rating, notes } = req.body || {};
  const entry = {
    id: nanoid(),
    name: (name||'').trim(),
    email: (email||'').trim(),
    coast: (coast||'').trim(),
    rating: Number(rating)||0,
    notes: (notes||'').trim(),
    created_at: new Date().toISOString()
  };
  const data = readJson('feedback.json');
  data.push(entry);
  writeJson('feedback.json', data);
  res.status(201).json(entry);
});

// Proposals (investor/government/advisor)
app.get('/api/proposals', (_req,res)=>{
  const data = readJson('proposals.json');
  res.json(data);
});
app.post('/api/proposals', (req,res)=>{
  const { type, org, contact, email, phone, coast, title, details } = req.body || {};
  const entry = {
    id: nanoid(),
    type: (type||'visitor').trim(), // visitor | investor | government | advisor
    org: (org||'').trim(),
    contact: (contact||'').trim(),
    email: (email||'').trim(),
    phone: (phone||'').trim(),
    coast: (coast||'').trim(),
    title: (title||'').trim(),
    details: (details||'').trim(),
    status: 'received',
    created_at: new Date().toISOString()
  };
  const data = readJson('proposals.json');
  data.push(entry);
  writeJson('proposals.json', data);
  res.status(201).json(entry);
});

// Smart summary (very naive aggregation for demo)
app.get('/api/summary', (_req,res)=>{
  const feedback = readJson('feedback.json');
  const proposals = readJson('proposals.json');
  const counts = {
    totalFeedback: feedback.length,
    avgRating: feedback.length ? (feedback.reduce((a,b)=>a + (Number(b.rating)||0),0) / feedback.length).toFixed(2) : 0,
    totalProposals: proposals.length,
    byType: proposals.reduce((acc,p)=>{ acc[p.type]=(acc[p.type]||0)+1; return acc; }, {})
  };
  res.json(counts);
});

app.listen(PORT, ()=>{
  console.log(`Palm Wave server running on http://localhost:${PORT}`);
});
