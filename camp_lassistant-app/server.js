/* basic express server serving data JSONs as a simple API */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
app.use(cors());
app.use(bodyParser.json());

// JWT secret (for demo only)
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'invalid token' });
    req.user = payload;
    next();
  });
}

app.post('/api/auth/login', async (req, res) => {
  const { username } = req.body;
  // simplistic: accept any username, in real app verify password.
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

const dataDir = path.join(__dirname, 'data');

async function readJson(name) {
  const fp = path.join(dataDir, name);
  try {
    const txt = await fs.readFile(fp, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}

// helper to write any data file
async function writeJson(name, obj) {
  const fp = path.join(dataDir, name);
  await fs.writeFile(fp, JSON.stringify(obj, null, 2), 'utf8');
}

async function writeJson(name, obj) {
  const fp = path.join(dataDir, name);
  await fs.writeFile(fp, JSON.stringify(obj, null, 2), 'utf8');
}

// chat endpoints
app.get('/api/chat/messages', async (req, res) => {
  const msgs = await readJson('messages.json');
  res.json(msgs);
});

app.post('/api/chat/messages', async (req, res) => {
  const { user, text } = req.body;
  const msgs = await readJson('messages.json');
  const id = (msgs.length ? msgs[msgs.length-1].id : 0) + 1;
  const msg = { id, user, text, timestamp: new Date().toISOString() };
  msgs.push(msg);
  await writeJson('messages.json', msgs);
  res.status(201).json(msg);
});

// orders endpoints
app.get('/api/orders', async (req, res) => {
  const orders = await readJson('orders.json');
  res.json(orders);
});

// returns unassigned pending orders (for runners)
app.get('/api/orders/available', async (req, res) => {
  const orders = await readJson('orders.json');
  res.json(orders.filter(o => o.status === 'pending' && !o.runner));
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  const orders = await readJson('orders.json');
  const id = (orders.length ? orders[orders.length-1].orderId : 1000) + 1;
  order.orderId = id;
  order.status = order.status || 'pending';
  // set default extra fields
  order.type = order.type || 'general';
  order.pickup = order.pickup || '';
  order.destination = order.destination || '';
  order.campus = order.campus || '';
  orders.push(order);
  await writeJson('orders.json', orders);
  res.status(201).json(order);
});

// allow partial update (e.g. status, runner) of an order
app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const orders = await readJson('orders.json');
  const order = orders.find(o => o.orderId == id);
  if (!order) return res.status(404).json({ error: 'not found' });
  Object.assign(order, updates);
  // if runner assigned and status still pending, mark as assigned
  if (updates.runner && order.status === 'pending') {
    order.status = 'assigned';
  }
  await writeJson('orders.json', orders);
  res.json(order);
});

// chat endpoints (multi-chat / private / group)
app.get('/api/chat/chats', authMiddleware, async (req, res) => {
  const chats = await readJson('chats.json');
  // filter by participant
  const user = req.user.username;
  res.json(chats.filter(c=>c.participants.includes(user)));
});

app.post('/api/chat/chats', authMiddleware, async (req, res) => {
  // create new chat (private or group)
  const chat = req.body;
  const chats = await readJson('chats.json');
  chat.id = chat.id || `chat_${Date.now()}`;
  chats.push(chat);
  await writeJson('chats.json', chats);
  res.status(201).json(chat);
});

app.get('/api/chat/messages', authMiddleware, async (req, res) => {
  const { chatId, since } = req.query;
  let msgs = await readJson('messages.json');
  const user = req.user.username;
  if (chatId) msgs = msgs.filter(m=>m.chatId===chatId);
  if (since) msgs = msgs.filter(m=>new Date(m.timestamp) > new Date(since));
  // mark read
  let updated = false;
  msgs.forEach(m=>{
    if(!m.readBy) m.readBy=[];
    if(!m.readBy.includes(user)){
      m.readBy.push(user);
      updated = true;
    }
  });
  if(updated) await writeJson('messages.json', await readJson('messages.json'));
  res.json(msgs);
});

app.post('/api/chat/messages', authMiddleware, async (req, res) => {
  const { chatId, sender, text, attachments } = req.body;
  const msgs = await readJson('messages.json');
  const id = (msgs.length ? msgs[msgs.length-1].id : 0) + 1;
  const msg = { id, chatId: chatId||'general', type:'group', sender, text, attachments: attachments||[], readBy: [sender], timestamp: new Date().toISOString() };
  msgs.push(msg);
  await writeJson('messages.json', msgs);
  res.status(201).json(msg);
});

app.delete('/api/chat/messages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  let msgs = await readJson('messages.json');
  const idx = msgs.findIndex(m => m.id == id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const [removed] = msgs.splice(idx, 1);
  await writeJson('messages.json', msgs);
  res.json(removed);
});

// user/friend endpoints
app.get('/api/users', async (req, res) => {
  res.json(await readJson('users.json'));
});
app.get('/api/users/online', (req,res)=>{
  res.json(Array.from(onlineUsers));
});
app.get('/api/friends/:user', async (req,res)=>{
  const list = await readJson('friends.json');
  const entry = list.find(f=>f.user===req.params.user);
  res.json(entry ? entry.friends : []);
});
app.post('/api/friends/:user', async (req,res)=>{
  const { friend } = req.body;
  const list = await readJson('friends.json');
  let entry = list.find(f=>f.user===req.params.user);
  if (!entry) { entry={user:req.params.user, friends:[]}; list.push(entry); }
  if (!entry.friends.includes(friend)) entry.friends.push(friend);
  await writeJson('friends.json', list);
  res.json(entry.friends);
});

// forum endpoints
app.get('/api/posts', async (req, res) => {
  const posts = await readJson('posts.json');
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const post = req.body;
  const posts = await readJson('posts.json');
  const id = (posts.length ? posts[posts.length-1].postId : 500) + 1;
  post.postId = id;
  post.comments = [];
  posts.push(post);
  await writeJson('posts.json', posts);
  res.status(201).json(post);
});

app.post('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  const posts = await readJson('posts.json');
  const post = posts.find(p => p.postId == id);
  if (!post) {
    return res.status(404).json({ error: 'not found' });
  }
  const comment = { author, content, timestamp: new Date().toISOString() };
  post.comments.push(comment);
  await writeJson('posts.json', posts);
  res.status(201).json(comment);
});

// ability to delete posts/comments
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  let posts = await readJson('posts.json');
  const idx = posts.findIndex(p => p.postId == id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const [removed] = posts.splice(idx, 1);
  await writeJson('posts.json', posts);
  res.json(removed);
});

app.delete('/api/posts/:id/comments/:cidx', async (req, res) => {
  const { id, cidx } = req.params;
  const posts = await readJson('posts.json');
  const post = posts.find(p => p.postId == id);
  if (!post) return res.status(404).json({ error: 'not found' });
  if (cidx < 0 || cidx >= post.comments.length) return res.status(404).json({ error: 'not found' });
  const [removed] = post.comments.splice(cidx, 1);
  await writeJson('posts.json', posts);
  res.json(removed);
});

// socket.io real-time support
const onlineUsers = new Set();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('auth error'));
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return next(new Error('auth error'));
    socket.user = payload.username;
    next();
  });
});

io.on('connection', socket => {
  onlineUsers.add(socket.user);
  console.log('user connected', socket.user);
  socket.join(socket.user); // personal room

  socket.on('joinChat', chatId => {
    socket.join(chatId);
  });

  socket.on('message', async msg => {
    // save to json and broadcast
    const msgs = await readJson('messages.json');
    const id = (msgs.length ? msgs[msgs.length-1].id : 0) + 1;
    msg.id = id;
    msg.timestamp = new Date().toISOString();
    msgs.push(msg);
    await writeJson('messages.json', msgs);
    io.to(msg.chatId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.user);
    console.log('user disconnected', socket.user);
  });
});

// simple static serving for demo
app.use(express.static(path.join(__dirname, 'app')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server listening on ${port}`));
