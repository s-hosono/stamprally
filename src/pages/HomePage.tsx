import { useAppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { calculateProgress, formatDate } from '../utils/helpers';
import './HomePage.css';

export function HomePage() {
  const { state } = useAppContext();
  const { user, currentRally, collectedStamps } = state;
  const navigate = useNavigate();

  // サンプルデータ（実際のアプリケーションではAPIから取得）
  const sampleRally = currentRally || {
    id: '1',
    title: '横浜みなとみらいスタンプラリー',
    description: 'みなとみらい21地区の観光スポットを巡るスタンプラリーです',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    totalStamps: 10,
    requiredStamps: 7,
    isActive: true,
    stampPoints: []
  };

  const progress = calculateProgress(collectedStamps, sampleRally.totalStamps);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>デジタルスタンプラリーへようこそ！</h1>
        <p>
          QRコードをスキャンしてスタンプを集めよう！<br />
          街を歩いて新しい発見をしてみませんか？
        </p>
      </section>

      {user ? (
        <section className="user-info">
          <h2>こんにちは、{user.name}さん！</h2>
          
          <div className="rally-card">
            <h3>{sampleRally.title}</h3>
            <p>{sampleRally.description}</p>
            
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {collectedStamps.length} / {sampleRally.totalStamps} スタンプ獲得 ({progress}%)
              </p>
            </div>
            
            <div className="rally-dates">
              <p>期間: {formatDate(sampleRally.startDate)} 〜 {formatDate(sampleRally.endDate)}</p>
            </div>
          </div>

          <div className="action-buttons">
            <Button 
              onClick={() => navigate('/scan')}
              size="large"
              fullWidth
            >
              📱 QRコードをスキャン
            </Button>
            
            <Button 
              onClick={() => navigate('/map')}
              variant="secondary"
              size="large"
              fullWidth
            >
              🗺️ 地図でスポットを確認
            </Button>
          </div>
        </section>
      ) : (
        <section className="guest-info">
          <h2>スタンプラリーを始めよう！</h2>
          <p>ユーザー登録をしてスタンプ収集を開始してください。</p>
          
          <div className="action-buttons">
            <Button 
              onClick={() => navigate('/auth')}
              size="large"
              fullWidth
            >
              👤 ユーザー登録・ログイン
            </Button>
          </div>
        </section>
      )}

      <section className="features">
        <h2>スタンプラリーの楽しみ方</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>QRスキャン</h3>
            <p>スポットのQRコードをスキャンしてスタンプを獲得</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>地図表示</h3>
            <p>スタンプポイントの位置を地図で確認</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>コレクション</h3>
            <p>獲得したスタンプをコレクションとして管理</p>
          </div>
        </div>
      </section>
    </div>
  );
}
