import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import lockfile from 'proper-lockfile';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// データファイルのパス
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PASSWORDS_FILE = path.join(DATA_DIR, 'passwords.json');

// ミドルウェア
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// データディレクトリの初期化
async function initializeDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // ユーザーファイルの初期化
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
    
    // パスワードファイルの初期化
    try {
      await fs.access(PASSWORDS_FILE);
    } catch {
      await fs.writeFile(PASSWORDS_FILE, JSON.stringify({}, null, 2));
    }
    
    console.log('Data directory initialized');
  } catch (error) {
    console.error('Failed to initialize data directory:', error);
  }
}

// ファイルロック付きでJSONファイルを読み込む
async function readJSONFileWithLock(filePath) {
  const release = await lockfile.lock(filePath);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } finally {
    await release();
  }
}

// ファイルロック付きでJSONファイルに書き込む
async function writeJSONFileWithLock(filePath, data) {
  const release = await lockfile.lock(filePath);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } finally {
    await release();
  }
}

// ユーザー一覧を取得
async function getUsers() {
  return await readJSONFileWithLock(USERS_FILE);
}

// ユーザーを保存
async function saveUser(user) {
  const users = await getUsers();
  users.push(user);
  await writeJSONFileWithLock(USERS_FILE, users);
}

// メールアドレスでユーザーを検索
async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find(user => user.email === email);
}

// パスワードを保存
async function savePassword(email, hashedPassword) {
  const passwords = await readJSONFileWithLock(PASSWORDS_FILE);
  passwords[email] = hashedPassword;
  await writeJSONFileWithLock(PASSWORDS_FILE, passwords);
}

// パスワードを取得
async function getPassword(email) {
  const passwords = await readJSONFileWithLock(PASSWORDS_FILE);
  return passwords[email];
}

// API エンドポイント

// ヘルスチェック用エンドポイント
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    dataDir: DATA_DIR
  });
});

// ユーザー登録
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // バリデーション
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'すべての項目を入力してください' }]
      });
    }
    
    // メールアドレスの重複チェック
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'このメールアドレスは既に登録されています' }]
      });
    }
    
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ユーザー作成
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      registeredAt: new Date().toISOString()
    };
    
    // ユーザーとパスワードを保存
    await saveUser(user);
    await savePassword(email, hashedPassword);
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      errors: [{ message: 'サーバーエラーが発生しました' }]
    });
  }
});

// ユーザーログイン
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // バリデーション
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'メールアドレスとパスワードを入力してください' }]
      });
    }
    
    // ユーザー検索
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{ message: 'メールアドレスまたはパスワードが間違っています' }]
      });
    }
    
    // パスワード検証
    const hashedPassword = await getPassword(email);
    if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
      return res.status(401).json({
        success: false,
        errors: [{ message: 'メールアドレスまたはパスワードが間違っています' }]
      });
    }
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      errors: [{ message: 'サーバーエラーが発生しました' }]
    });
  }
});

// ユーザー一覧取得（デバッグ用）
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json({
      success: true,
      users: users.map(user => ({ ...user, email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2') }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
});

// サーバー起動
async function startServer() {
  await initializeDataDirectory();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
  });
}

startServer().catch(console.error);
