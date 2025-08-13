import type { RegisterForm, LoginForm, AuthError, User } from '../types';

// 環境に応じてAPI URLを設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// バリデーション関数（フロントエンド用）
export function validateRegisterForm(form: RegisterForm): AuthError[] {
  const errors: AuthError[] = [];

  if (!form.name.trim()) {
    errors.push({ field: 'name', message: '名前を入力してください' });
  }

  if (!form.email.trim()) {
    errors.push({ field: 'email', message: 'メールアドレスを入力してください' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push({ field: 'email', message: '正しいメールアドレスを入力してください' });
  }

  if (!form.password) {
    errors.push({ field: 'password', message: 'パスワードを入力してください' });
  } else if (form.password.length < 6) {
    errors.push({ field: 'password', message: 'パスワードは6文字以上で入力してください' });
  }

  if (form.password !== form.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'パスワードが一致しません' });
  }

  return errors;
}

export function validateLoginForm(form: LoginForm): AuthError[] {
  const errors: AuthError[] = [];

  if (!form.email.trim()) {
    errors.push({ field: 'email', message: 'メールアドレスを入力してください' });
  }

  if (!form.password) {
    errors.push({ field: 'password', message: 'パスワードを入力してください' });
  }

  return errors;
}

// サーバーAPI呼び出し関数
export async function registerUser(form: RegisterForm): Promise<{ success: boolean; user?: User; errors?: AuthError[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        errors: data.errors || [{ message: 'サーバーエラーが発生しました' }]
      };
    }

    // ユーザー情報をローカルストレージに保存
    if (data.user) {
      const userWithDate = {
        ...data.user,
        registeredAt: new Date(data.user.registeredAt)
      };
      saveCurrentUser(userWithDate);
      return { success: true, user: userWithDate };
    }

    return { success: false, errors: [{ message: '登録に失敗しました' }] };
  } catch (error) {
    console.error('Registration API error:', error);
    
    // より詳細なエラー情報を提供
    let errorMessage = 'ネットワークエラーが発生しました';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = `サーバーに接続できません (${API_BASE_URL})`;
    } else if (error instanceof Error) {
      errorMessage = `通信エラー: ${error.message}`;
    }
    
    return {
      success: false,
      errors: [{ message: errorMessage }]
    };
  }
}

export async function loginUser(form: LoginForm): Promise<{ success: boolean; user?: User; errors?: AuthError[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        errors: data.errors || [{ message: 'サーバーエラーが発生しました' }]
      };
    }

    // ユーザー情報をローカルストレージに保存
    if (data.user) {
      const userWithDate = {
        ...data.user,
        registeredAt: new Date(data.user.registeredAt)
      };
      saveCurrentUser(userWithDate);
      return { success: true, user: userWithDate };
    }

    return { success: false, errors: [{ message: 'ログインに失敗しました' }] };
  } catch (error) {
    console.error('Login API error:', error);
    return {
      success: false,
      errors: [{ message: 'ネットワークエラーが発生しました' }]
    };
  }
}

// ローカルストレージ管理（セッション管理用）
export function saveCurrentUser(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      return {
        ...user,
        registeredAt: new Date(user.registeredAt)
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export function clearCurrentUser(): void {
  localStorage.removeItem('currentUser');
}

// 旧関数の互換性のため残しておく（削除予定）
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function hashPassword(password: string): Promise<string> {
  // サーバーサイドで行うため、ここでは何もしない
  return Promise.resolve(password);
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // サーバーサイドで行うため、ここでは何もしない
  return Promise.resolve(password === hashedPassword);
}

export function saveUser(user: User): void {
  // サーバーサイドで行うため、ここでは何もしない
  console.warn('saveUser is deprecated, use registerUser instead');
}

export function saveUserPassword(email: string, hashedPassword: string): void {
  // サーバーサイドで行うため、ここでは何もしない
  console.warn('saveUserPassword is deprecated, password is handled server-side');
}

export function findUserByEmail(email: string): User | null {
  // サーバーサイドで行うため、ここでは何もしない
  console.warn('findUserByEmail is deprecated, use server API instead');
  return null;
}

export function getUserPassword(email: string): string | null {
  // サーバーサイドで行うため、ここでは何もしない
  console.warn('getUserPassword is deprecated, password verification is handled server-side');
  return null;
}
