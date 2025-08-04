import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, User, StampRally, UserStamp } from '../types';
import { getCurrentUser } from '../utils/auth-api';

// 初期状態
const initialState: AppState = {
  user: null,
  currentRally: null,
  collectedStamps: [],
  isLoading: false,
  error: null,
};

// アクション定義
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_RALLY'; payload: StampRally | null }
  | { type: 'ADD_STAMP'; payload: UserStamp }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// リデューサー
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_RALLY':
      return { ...state, currentRally: action.payload };
    case 'ADD_STAMP':
      return { 
        ...state, 
        collectedStamps: [...state.collectedStamps, action.payload] 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// コンテキスト作成
export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// プロバイダーコンポーネント
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // アプリ起動時にローカルストレージからユーザー情報を復元
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: savedUser });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// カスタムフック
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
