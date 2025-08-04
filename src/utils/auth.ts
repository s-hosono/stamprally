import type { User, LoginForm, RegisterForm, AuthError } from '../types';
import { storage } from './helpers';

// バリデーション関数
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // 最低8文字、1つ以上の文字と数字を含む
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

// フォームバリデーション
export const validateRegisterForm = (form: RegisterForm): AuthError[] => {
  const errors: AuthError[] = [];

  if (!validateName(form.name)) {
    errors.push({
      field: 'name',
      message: '名前は2文字以上50文字以下で入力してください'
    });
  }

  if (!validateEmail(form.email)) {
    errors.push({
      field: 'email',
      message: '正しいメールアドレスを入力してください'
    });
  }

  if (!validatePassword(form.password)) {
    errors.push({
      field: 'password',
      message: 'パスワードは8文字以上で、文字と数字を含めてください'
    });
  }

  if (form.password !== form.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'パスワードが一致しません'
    });
  }

  return errors;
};

export const validateLoginForm = (form: LoginForm): AuthError[] => {
  const errors: AuthError[] = [];

  if (!validateEmail(form.email)) {
    errors.push({
      field: 'email',
      message: '正しいメールアドレスを入力してください'
    });
  }

  if (!form.password) {
    errors.push({
      field: 'password',
      message: 'パスワードを入力してください'
    });
  }

  return errors;
};

// ユーザー管理
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const hashPassword = async (password: string): Promise<string> => {
  // 実際のアプリケーションではより強力なハッシュ化を使用
  // ここではデモ用の簡単な実装
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_key_demo');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

// ローカルストレージでのユーザー管理
const USERS_STORAGE_KEY = 'stamp_rally_users';
const CURRENT_USER_KEY = 'stamp_rally_current_user';

export const saveUser = (user: User): void => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email === user.email);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  storage.set(USERS_STORAGE_KEY, users);
};

export const getStoredUsers = (): User[] => {
  return storage.get<User[]>(USERS_STORAGE_KEY) || [];
};

export const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(user => user.email === email) || null;
};

export const saveCurrentUser = (user: User): void => {
  storage.set(CURRENT_USER_KEY, user);
};

export const getCurrentUser = (): User | null => {
  return storage.get<User>(CURRENT_USER_KEY);
};

export const clearCurrentUser = (): void => {
  storage.remove(CURRENT_USER_KEY);
};

// 認証された情報の管理（簡易実装）
const USER_PASSWORDS_KEY = 'stamp_rally_user_passwords';

export const saveUserPassword = (email: string, hashedPassword: string): void => {
  const passwords = storage.get<Record<string, string>>(USER_PASSWORDS_KEY) || {};
  passwords[email] = hashedPassword;
  storage.set(USER_PASSWORDS_KEY, passwords);
};

export const getUserPassword = (email: string): string | null => {
  const passwords = storage.get<Record<string, string>>(USER_PASSWORDS_KEY) || {};
  return passwords[email] || null;
};
