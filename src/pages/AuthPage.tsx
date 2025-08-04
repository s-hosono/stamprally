import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { RegisterForm } from '../components/RegisterForm';
import { LoginForm } from '../components/LoginForm';
import type { RegisterForm as RegisterFormData, LoginForm as LoginFormData, AuthError, User } from '../types';
import {
  validateRegisterForm,
  validateLoginForm,
  registerUser,
  loginUser
} from '../utils/auth-api';
import './AuthPage.css';

type AuthMode = 'login' | 'register';

export function AuthPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 既にログイン済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (state.user) {
      navigate('/', { replace: true });
    }
  }, [state.user, navigate]);

  const handleRegister = async (form: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    setErrors([]);

    try {
      // フロントエンドバリデーション
      const validationErrors = validateRegisterForm(form);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // サーバーに登録リクエスト送信
      const result = await registerUser(form);
      
      if (!result.success) {
        setErrors(result.errors || [{ message: '登録に失敗しました' }]);
        return;
      }

      // 登録成功時の処理
      if (result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        // ホームページにリダイレクト
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error('Registration error:', error);
      setErrors([{
        message: '登録中にエラーが発生しました。もう一度お試しください。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (form: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setErrors([]);

    try {
      // フロントエンドバリデーション
      const validationErrors = validateLoginForm(form);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // サーバーにログインリクエスト送信
      const result = await loginUser(form);
      
      if (!result.success) {
        setErrors(result.errors || [{ message: 'ログインに失敗しました' }]);
        return;
      }

      // ログイン成功時の処理
      if (result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        // ホームページにリダイレクト
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors([{
        message: 'ログイン中にエラーが発生しました。もう一度お試しください。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    setMode('register');
    setErrors([]);
  };

  const switchToLogin = () => {
    setMode('login');
    setErrors([]);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <h1>デジタルスタンプラリー</h1>
          <p>街を歩いて、新しい発見をしよう！</p>
        </div>

        <div className="auth-page__form">
          {mode === 'register' ? (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={switchToLogin}
              errors={errors}
              isLoading={isLoading}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToRegister={switchToRegister}
              errors={errors}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="auth-page__features">
          <h3>スタンプラリーの特徴</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>QRコードスキャン</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🗺️</span>
              <span>地図でスポット確認</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>コレクション管理</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>進捗トラッキング</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
