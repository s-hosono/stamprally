import { useAppContext } from '../store/AppContext';
import { formatDate, calculateProgress } from '../utils/helpers';
import type { StampPoint } from '../types';
import './StampsPage.css';

export function StampsPage() {
  const { state } = useAppContext();
  const { collectedStamps } = state;

  // サンプルスタンプポイントデータ
  const sampleStampPoints: StampPoint[] = [
    {
      id: '1',
      name: '赤レンガ倉庫',
      description: '横浜を代表する観光スポット',
      latitude: 35.4532,
      longitude: 139.6417,
      qrCode: 'STAMP_AKARENGA_2024',
      category: '観光',
      address: '神奈川県横浜市中区新港1-1',
      imageUrl: 'https://via.placeholder.com/300x200?text=赤レンガ倉庫',
      isCompleted: collectedStamps.some(s => s.stampPointId === '1')
    },
    {
      id: '2',
      name: 'コスモワールド',
      description: '大観覧車で有名な遊園地',
      latitude: 35.4555,
      longitude: 139.6380,
      qrCode: 'STAMP_COSMOWORLD_2024',
      category: 'エンターテイメント',
      address: '神奈川県横浜市中区新港2-8-1',
      imageUrl: 'https://via.placeholder.com/300x200?text=コスモワールド',
      isCompleted: collectedStamps.some(s => s.stampPointId === '2')
    },
    {
      id: '3',
      name: '横浜ランドマークタワー',
      description: '高さ296mの超高層ビル',
      latitude: 35.4546,
      longitude: 139.6309,
      qrCode: 'STAMP_LANDMARK_2024',
      category: '観光',
      address: '神奈川県横浜市西区みなとみらい2-2-1',
      imageUrl: 'https://via.placeholder.com/300x200?text=ランドマークタワー',
      isCompleted: collectedStamps.some(s => s.stampPointId === '3')
    },
    {
      id: '4',
      name: '横浜美術館',
      description: '現代アートを中心とした美術館',
      latitude: 35.4529,
      longitude: 139.6234,
      qrCode: 'STAMP_MUSEUM_2024',
      category: '文化',
      address: '神奈川県横浜市西区みなとみらい3-4-1',
      imageUrl: 'https://via.placeholder.com/300x200?text=横浜美術館',
      isCompleted: collectedStamps.some(s => s.stampPointId === '4')
    },
    {
      id: '5',
      name: '山下公園',
      description: '海沿いの美しい公園',
      latitude: 35.4427,
      longitude: 139.6499,
      qrCode: 'STAMP_YAMASHITA_2024',
      category: '公園',
      address: '神奈川県横浜市中区山下町279',
      imageUrl: 'https://via.placeholder.com/300x200?text=山下公園',
      isCompleted: collectedStamps.some(s => s.stampPointId === '5')
    }
  ];

  const completedStampPoints = sampleStampPoints.filter(point => point.isCompleted);
  const uncompletedStampPoints = sampleStampPoints.filter(point => !point.isCompleted);
  const progress = calculateProgress(collectedStamps, sampleStampPoints.length);

  // スタンプの獲得日時を取得
  const getStampCollectionDate = (stampPointId: string) => {
    const stamp = collectedStamps.find(s => s.stampPointId === stampPointId);
    return stamp ? stamp.collectedAt : null;
  };

  // カテゴリー別の統計
  const categoryStats = sampleStampPoints.reduce((acc, point) => {
    acc[point.category] = acc[point.category] || { total: 0, completed: 0 };
    acc[point.category].total++;
    if (point.isCompleted) {
      acc[point.category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="stamps-page">
      <div className="stamps-header">
        <h1>スタンプコレクション</h1>
        <div className="overall-progress">
          <div className="progress-circle">
            <div className="progress-text">
              <span className="progress-number">{progress}%</span>
              <span className="progress-label">完了</span>
            </div>
          </div>
          <div className="progress-details">
            <p>{collectedStamps.length} / {sampleStampPoints.length} スタンプ獲得</p>
            {progress === 100 && (
              <p className="completion-message">🎉 全スタンプ制覇おめでとうございます！</p>
            )}
          </div>
        </div>
      </div>

      {/* カテゴリー別統計 */}
      <div className="category-stats">
        <h2>カテゴリー別進捗</h2>
        <div className="category-grid">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="category-card">
              <h3>{category}</h3>
              <div className="category-progress">
                <span className="category-count">
                  {stats.completed} / {stats.total}
                </span>
                <div className="category-bar">
                  <div 
                    className="category-fill" 
                    style={{ 
                      width: `${(stats.completed / stats.total) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 獲得済みスタンプ */}
      {completedStampPoints.length > 0 && (
        <section className="stamps-section">
          <h2>🎉 獲得済みスタンプ ({completedStampPoints.length}個)</h2>
          <div className="stamps-grid">
            {completedStampPoints.map((point) => {
              const collectionDate = getStampCollectionDate(point.id);
              return (
                <div key={point.id} className="stamp-card stamp-card--completed">
                  <div className="stamp-image">
                    <img 
                      src={point.imageUrl} 
                      alt={point.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="stamp-overlay">
                      <div className="stamp-check">✓</div>
                    </div>
                  </div>
                  <div className="stamp-content">
                    <h3>{point.name}</h3>
                    <p className="stamp-description">{point.description}</p>
                    <div className="stamp-meta">
                      <span className="category-tag">{point.category}</span>
                      {collectionDate && (
                        <span className="collection-date">
                          📅 {formatDate(collectionDate)}
                        </span>
                      )}
                    </div>
                    <p className="stamp-address">📍 {point.address}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 未獲得スタンプ */}
      {uncompletedStampPoints.length > 0 && (
        <section className="stamps-section">
          <h2>⭕ 未獲得スタンプ ({uncompletedStampPoints.length}個)</h2>
          <div className="stamps-grid">
            {uncompletedStampPoints.map((point) => (
              <div key={point.id} className="stamp-card stamp-card--incomplete">
                <div className="stamp-image">
                  <img 
                    src={point.imageUrl} 
                    alt={point.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <div className="stamp-overlay stamp-overlay--incomplete">
                    <div className="stamp-question">?</div>
                  </div>
                </div>
                <div className="stamp-content">
                  <h3>{point.name}</h3>
                  <p className="stamp-description">{point.description}</p>
                  <div className="stamp-meta">
                    <span className="category-tag">{point.category}</span>
                  </div>
                  <p className="stamp-address">📍 {point.address}</p>
                  <div className="stamp-actions">
                    <button 
                      className="action-button"
                      onClick={() => window.location.href = '/map'}
                    >
                      🗺️ 地図で確認
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {collectedStamps.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h3>まだスタンプがありません</h3>
          <p>QRコードをスキャンしてスタンプを集めましょう！</p>
          <button 
            className="start-button"
            onClick={() => window.location.href = '/scan'}
          >
            スキャンを開始
          </button>
        </div>
      )}
    </div>
  );
}
