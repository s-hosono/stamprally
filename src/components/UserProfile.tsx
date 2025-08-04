import { useAppContext } from '../store/AppContext';
import { clearCurrentUser } from '../utils/auth-api';
import { formatDate } from '../utils/helpers';
import { Button } from './Button';
import './UserProfile.css';

interface UserProfileProps {
  onLogout?: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
  const { state, dispatch } = useAppContext();
  const { user, collectedStamps } = state;

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearCurrentUser();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_RALLY', payload: null });
    
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="user-avatar__placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <p className="user-joined">
            登録日: {formatDate(user.registeredAt)}
          </p>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-number">{collectedStamps.length}</span>
          <span className="stat-label">獲得スタンプ</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {new Set(collectedStamps.map(s => s.stampPointId)).size}
          </span>
          <span className="stat-label">訪問地点</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {Math.floor((Date.now() - user.registeredAt.getTime()) / (1000 * 60 * 60 * 24))}
          </span>
          <span className="stat-label">参加日数</span>
        </div>
      </div>

      <div className="user-actions">
        <Button
          onClick={handleLogout}
          variant="secondary"
          fullWidth
        >
          ログアウト
        </Button>
      </div>
    </div>
  );
}
