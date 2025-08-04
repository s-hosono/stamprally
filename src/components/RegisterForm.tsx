import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RegisterForm, AuthError } from '../types';
import { Button } from './Button';
import './AuthForm.css';

interface RegisterFormProps {
  onSubmit: (form: RegisterForm) => Promise<void>;
  onSwitchToLogin: () => void;
  errors: AuthError[];
  isLoading: boolean;
}

export function RegisterForm({ 
  onSubmit, 
  onSwitchToLogin, 
  errors, 
  isLoading 
}: RegisterFormProps) {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h2>新規登録</h2>
        <p>デジタルスタンプラリーを始めましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form__form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            お名前 <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`form-input ${getFieldError('name') ? 'form-input--error' : ''}`}
            placeholder="山田太郎"
            disabled={isLoading}
            required
          />
          {getFieldError('name') && (
            <span className="form-error">{getFieldError('name')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            メールアドレス <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`form-input ${getFieldError('email') ? 'form-input--error' : ''}`}
            placeholder="example@email.com"
            disabled={isLoading}
            required
          />
          {getFieldError('email') && (
            <span className="form-error">{getFieldError('email')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            パスワード <span className="required">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`form-input ${getFieldError('password') ? 'form-input--error' : ''}`}
            placeholder="8文字以上（文字と数字を含む）"
            disabled={isLoading}
            required
          />
          {getFieldError('password') && (
            <span className="form-error">{getFieldError('password')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            パスワード確認 <span className="required">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`form-input ${getFieldError('confirmPassword') ? 'form-input--error' : ''}`}
            placeholder="パスワードを再入力"
            disabled={isLoading}
            required
          />
          {getFieldError('confirmPassword') && (
            <span className="form-error">{getFieldError('confirmPassword')}</span>
          )}
        </div>

        {errors.find(error => !error.field) && (
          <div className="form-error form-error--general">
            {errors.find(error => !error.field)?.message}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="large"
          disabled={isLoading}
        >
          {isLoading ? '登録中...' : '新規登録'}
        </Button>
      </form>

      <div className="auth-form__footer">
        <p>
          既にアカウントをお持ちですか？{' '}
          <button 
            type="button"
            className="auth-link"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  );
}
