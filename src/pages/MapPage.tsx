import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAppContext } from '../store/AppContext';
import type { StampPoint } from '../types';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

// Leafletのアイコン設定
const stampIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const completedIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function MapPage() {
  const { state } = useAppContext();
  const { latitude, longitude, error: locationError } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.4532, 139.6417]); // 横浜みなとみらい

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
      isCompleted: state.collectedStamps.some(s => s.stampPointId === '1')
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
      isCompleted: state.collectedStamps.some(s => s.stampPointId === '2')
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
      isCompleted: state.collectedStamps.some(s => s.stampPointId === '3')
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
      isCompleted: state.collectedStamps.some(s => s.stampPointId === '4')
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
      isCompleted: state.collectedStamps.some(s => s.stampPointId === '5')
    }
  ];

  // 現在位置が取得できた場合は地図の中心を更新
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const completedCount = sampleStampPoints.filter(point => point.isCompleted).length;
  const totalCount = sampleStampPoints.length;

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>スタンプポイント地図</h1>
        <div className="progress-info">
          <span className="progress-count">
            {completedCount} / {totalCount} スタンプ獲得
          </span>
        </div>
      </div>

      {locationError && (
        <div className="alert alert--warning">
          <p>📍 位置情報が取得できません: {locationError}</p>
        </div>
      )}

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '500px', width: '100%' }}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* 現在位置マーカー */}
          {latitude !== null && longitude !== null && (
            <Marker position={[latitude, longitude]} icon={userIcon}>
              <Popup>
                <div className="popup-content">
                  <h4>🧭 現在位置</h4>
                  <p>あなたはここにいます</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* スタンプポイントマーカー */}
          {sampleStampPoints.map((point) => (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={point.isCompleted ? completedIcon : stampIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h4>
                    {point.isCompleted ? '✅' : '📍'} {point.name}
                  </h4>
                  <p>{point.description}</p>
                  <div className="popup-details">
                    <p><strong>カテゴリー:</strong> {point.category}</p>
                    <p><strong>住所:</strong> {point.address}</p>
                    {point.isCompleted && (
                      <p className="completed-text">🎉 スタンプ獲得済み</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="legend">
        <h3>凡例</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker legend-marker--user"></div>
            <span>現在位置</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker legend-marker--stamp"></div>
            <span>未獲得スタンプ</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker legend-marker--completed"></div>
            <span>獲得済みスタンプ</span>
          </div>
        </div>
      </div>

      <div className="stamp-list">
        <h3>スタンプポイント一覧</h3>
        <div className="stamp-grid">
          {sampleStampPoints.map((point) => (
            <div 
              key={point.id} 
              className={`stamp-card ${point.isCompleted ? 'stamp-card--completed' : ''}`}
            >
              <div className="stamp-card-header">
                <h4>{point.name}</h4>
                <span className="stamp-status">
                  {point.isCompleted ? '✅' : '⭕'}
                </span>
              </div>
              <p className="stamp-description">{point.description}</p>
              <div className="stamp-meta">
                <span className="category-tag">{point.category}</span>
                {point.isCompleted && (
                  <span className="completed-tag">獲得済み</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
