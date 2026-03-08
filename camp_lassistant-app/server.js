const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// 初始化Express
const app = express();
const server = http.createServer(app);

// 文件上传配置
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

// Socket.IO配置
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
  transports: ['websocket', 'polling']
});

// 核心配置
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'campus-life-assistant-2026-secret';
const DATA_DIR = path.join(__dirname, 'data');
const STATIC_DIR = path.join(__dirname, 'app');

// 中间件
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(STATIC_DIR));
app.use('/uploads', express.static(uploadDir)); // 静态托管上传文件

// 初始化数据
async function initDataFiles() {
  await fs.ensureDir(DATA_DIR);
  
  const defaultData = {
    users: [
      { id: '1', username: 'user1', password: '123456' },
      { id: '2', username: 'runner1', password: '123456' }
    ],
    friends: [
      { userId: '1', friendIds: ['2'] },
      { userId: '2', friendIds: ['1'] }
    ],
    orders: [
      { 
        id: uuidv4(), 
        title: '测试订单-买水', 
        content: '请帮忙买2瓶矿泉水，送到教学楼A区', 
        status: 'pending', 
        creator: '1', 
        taker: '', 
        createTime: new Date().toISOString() 
      }
    ],
    posts: [
      { 
        id: uuidv4(), 
        title: '校园生活助手论坛上线啦！', 
        content: '大家可以在这里交流跑腿需求、校园信息~', 
        author: '1', 
        createTime: new Date().toISOString() 
      }
    ],
    messages: [],
    groups: [
      { id: 'g1', name: '校园跑腿群', members: ['1', '2'], creator: '1' }
    ],
    offlineMessages: {},
    chats: []
  };

  for (const [file, content] of Object.entries(defaultData)) {
    const filePath = path.join(DATA_DIR, `${file}.json`);
    await fs.writeJson(filePath, content, { spaces: 2 });
    console.log(`✅ 初始化文件: ${filePath}`);
  }
}

// JWT认证中间件
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: '未提供令牌' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: '令牌无效' });
  }
};

// ===================== 核心接口 =====================
// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: '用户名/密码不能为空' });

    const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return res.status(401).json({ success: false, message: '用户名/密码错误' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误：' + err.message });
  }
});

// 文件上传接口
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '请选择文件' });
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: '上传失败：' + err.message });
  }
});

// 离线消息接口
app.get('/api/offline-messages', authMiddleware, async (req, res) => {
  try {
    const offline = await fs.readJson(path.join(DATA_DIR, 'offlineMessages.json'));
    res.json({ success: true, data: offline[req.user.id] || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取离线消息失败：' + err.message });
  }
});

app.post('/api/offline-messages/clear', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const offline = await fs.readJson(path.join(DATA_DIR, 'offlineMessages.json'));
    if (offline[userId]) delete offline[userId];
    await fs.writeJson(path.join(DATA_DIR, 'offlineMessages.json'), offline);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: '清空离线消息失败：' + err.message });
  }
});

// 用户/好友/群聊接口
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
    res.json({ success: true, data: users.map(u => ({ id: u.id, username: u.username })) });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取用户失败：' + err.message });
  }
});

app.get('/api/friends/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await fs.readJson(path.join(DATA_DIR, 'friends.json'));
    const userFriends = friends.find(f => f.userId === userId) || { userId, friendIds: [] };
    
    const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
    const friendDetails = userFriends.friendIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? { id: user.id, username: user.username } : null;
    }).filter(Boolean);

    res.json({ success: true, data: friendDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取好友失败：' + err.message });
  }
});

app.get('/api/groups', authMiddleware, async (req, res) => {
  try {
    const groups = await fs.readJson(path.join(DATA_DIR, 'groups.json'));
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取群聊失败：' + err.message });
  }
});

// 订单/论坛接口（保留原有逻辑）
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await fs.readJson(path.join(DATA_DIR, 'orders.json'));
    const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
    
    const orderWithUser = orders.map(order => {
      const creator = users.find(u => u.id === order.creator)?.username || '未知用户';
      const taker = order.taker ? users.find(u => u.id === order.taker)?.username || '未知' : '';
      return { ...order, creatorName: creator, takerName: taker };
    });

    res.json({ success: true, data: orderWithUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取订单失败：' + err.message });
  }
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: '标题/内容不能为空' });

    const orders = await fs.readJson(path.join(DATA_DIR, 'orders.json'));
    const newOrder = {
      id: uuidv4(), title, content, status: 'pending', creator: req.user.id,
      taker: '', createTime: new Date().toISOString(), updateTime: new Date().toISOString()
    };

    orders.push(newOrder);
    await fs.writeJson(path.join(DATA_DIR, 'orders.json'), orders);
    io.emit('order_update', newOrder);
    
    res.json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建订单失败：' + err.message });
  }
});

app.get('/api/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await fs.readJson(path.join(DATA_DIR, 'posts.json'));
    const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
    
    const postsWithAuthor = posts.map(post => {
      const author = users.find(u => u.id === post.author)?.username || '未知';
      return { ...post, authorName: author };
    });

    res.json({ success: true, data: postsWithAuthor });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取帖子失败：' + err.message });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: '标题/内容不能为空' });

    const posts = await fs.readJson(path.join(DATA_DIR, 'posts.json'));
    const newPost = {
      id: uuidv4(), title, content, author: req.user.id,
      createTime: new Date().toISOString(), updateTime: new Date().toISOString()
    };

    posts.push(newPost);
    await fs.writeJson(path.join(DATA_DIR, 'posts.json'), posts);
    io.emit('new_post', newPost);
    
    res.json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: '发布帖子失败：' + err.message });
  }
});

// ===================== Socket.IO 核心逻辑 =====================
const onlineUsers = new Map();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('未提供令牌'));
    
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('令牌无效'));
  }
}).on('connection', (socket) => {
  console.log(`🔌 用户 ${socket.user.username} 已连接`);
  
  // 记录在线用户
  onlineUsers.set(socket.id, {
    id: socket.user.id,
    username: socket.user.username,
    socketId: socket.id
  });
  
  // 广播在线用户更新
  io.emit('online_users_update', Array.from(onlineUsers.values()).map(u => ({
    id: u.id, username: u.username
  })));

  // 发送消息（私聊/群聊）
  socket.on('send_message', async (data) => {
    const { to, content, type = 'text', chatType = 'private' } = data;
    if (!to || !content) return;

    const newMessage = {
      id: uuidv4(),
      from: socket.user.id,
      to,
      content,
      type,
      chatType,
      time: new Date().toISOString(),
      isRead: false
    };

    // 保存消息
    const messages = await fs.readJson(path.join(DATA_DIR, 'messages.json'));
    messages.push(newMessage);
    await fs.writeJson(path.join(DATA_DIR, 'messages.json'), messages, { spaces: 2 });

    // 群聊：推送给所有群成员
    if (chatType === 'group') {
      const groups = await fs.readJson(path.join(DATA_DIR, 'groups.json'));
      const group = groups.find(g => g.id === to);
      if (group) {
group.members.forEach(async (memberId) => {
  if (memberId === socket.user.id) return;
  const member = Array.from(onlineUsers.values()).find(u => u.id === memberId);
  if (member) {
    io.to(member.socketId).emit('new_message', {
      ...newMessage,
      fromUsername: socket.user.username
    });
  } else {
    // 群成员离线消息
    const offline = await fs.readJson(path.join(DATA_DIR, 'offlineMessages.json'));
    if (!offline[memberId]) offline[memberId] = [];
    offline[memberId].push(newMessage);
    await fs.writeJson(path.join(DATA_DIR, 'offlineMessages.json'), offline);
  }
});
      }
    } 
    // 私聊：推送给指定用户
    else {
      const receiver = Array.from(onlineUsers.values()).find(u => u.id === to);
      if (receiver) {
        io.to(receiver.socketId).emit('new_message', {
          ...newMessage,
          fromUsername: socket.user.username
        });
      } else {
        // 私聊离线消息
        const offline = await fs.readJson(path.join(DATA_DIR, 'offlineMessages.json'));
        if (!offline[to]) offline[to] = [];
        offline[to].push(newMessage);
        await fs.writeJson(path.join(DATA_DIR, 'offlineMessages.json'), offline);
      }
    }

    socket.emit('message_sent', newMessage);
  });

  // 音视频通话
  socket.on('call_user', (data) => {
    const { to, type, offer } = data;
    const receiver = Array.from(onlineUsers.values()).find(u => u.id === to);
    if (receiver) {
      io.to(receiver.socketId).emit('incoming_call', {
        from: socket.user.id,
        fromUsername: socket.user.username,
        type,
        offer
      });
    }
  });

  socket.on('answer_call', (data) => {
    const { to, answer } = data;
    const caller = Array.from(onlineUsers.values()).find(u => u.id === to);
    if (caller) io.to(caller.socketId).emit('call_answered', { answer });
  });

  socket.on('ice_candidate', (data) => {
    const { to, candidate } = data;
    const peer = Array.from(onlineUsers.values()).find(u => u.id === to);
    if (peer) io.to(peer.socketId).emit('ice_candidate', { candidate });
  });

  socket.on('reject_call', (data) => {
    const { to } = data;
    const caller = Array.from(onlineUsers.values()).find(u => u.id === to);
    if (caller) io.to(caller.socketId).emit('call_rejected');
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log(`🔌 用户 ${socket.user.username} 已断开`);
    onlineUsers.delete(socket.id);
    io.emit('online_users_update', Array.from(onlineUsers.values()).map(u => ({
      id: u.id, username: u.username
    })));
  });
});

// ===================== 启动服务 =====================
initDataFiles().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`🎓 校园生活助手已启动！`);
    console.log(`🔗 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 Codespaces: https://${process.env.CODESPACE_NAME || 'localhost'}-${PORT}.app.github.dev/`);
    console.log(`🔑 测试账号：user1/123456 | runner1/123456`);
    console.log(`=================================`);
  });
}).catch(err => {
  console.error('❌ 初始化失败：', err);
  process.exit(1);
});

// 全局异常捕获
process.on('uncaughtException', (err) => console.error('❌ 全局异常:', err));
process.on('unhandledRejection', (reason) => console.error('❌ Promise拒绝:', reason));