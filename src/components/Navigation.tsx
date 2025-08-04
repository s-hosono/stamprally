import { NavLink } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { UserProfile } from './UserProfile';
import './Navigation.css';

export function Navigation() {
  const { state } = useAppContext();
  const { user } = state;
  return (
    <nav className="navigation">
      <div className="navigation__brand">
        <h1>デジタルスタンプラリー</h1>
      </div>
      
      {user ? (
        // ログイン済みユーザー向けナビゲーション
        <>
          <ul className="navigation__menu">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
              >
                ホーム
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/scan" 
                className={({ isActive }) => 
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
              >
                スキャン
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/map" 
                className={({ isActive }) => 
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
              >
                地図
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/stamps" 
                className={({ isActive }) => 
                  isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
                }
              >
                コレクション
              </NavLink>
            </li>
          </ul>
          <div className="navigation__user">
            <UserProfile />
          </div>
        </>
      ) : (
        // 未ログインユーザー向けナビゲーション
        <ul className="navigation__menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
              }
            >
              ホーム
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/auth" 
              className={({ isActive }) => 
                isActive ? 'navigation__link navigation__link--active' : 'navigation__link'
              }
            >
              ログイン・登録
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}
