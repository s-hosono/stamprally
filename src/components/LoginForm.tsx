import { useState } from 'react';
import type { FormEvent } from 'react';
import type { LoginForm, AuthError } from '../types';
import { Button } from './Button';
import './AuthForm.css';

interface LoginFormProps {
  onSubmit: (form: LoginForm) => Promise<void>;
  onSwitchToRegister: () => void;
  errors: AuthError[];
  isLoading: boolean;
}

export function LoginForm({ 
  onSubmit, 
  onSwitchToRegister, 
  errors, 
  isLoading 
}: LoginFormProps) {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h2>ログイン</h2>
        <p>アカウントにログインしてスタンプラリーを続けましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form__form">
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
            placeholder="パスワードを入力"
            disabled={isLoading}
            required
          />
          {getFieldError('password') && (
            <span className="form-error">{getFieldError('password')}</span>
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
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>

      <div className="auth-form__footer">
        <p>
          アカウントをお持ちでない方は{' '}
          <button 
            type="button"
            className="auth-link"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            新規登録
          </button>
        </p>
      </div>
    </div>
  );
}
