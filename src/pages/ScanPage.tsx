import { useState, useEffect } from 'react';
import { useQRScanner } from '../hooks/useQRScanner';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAppContext } from '../store/AppContext';
import { Button } from '../components/Button';
import { isValidQRCode, isWithinRange } from '../utils/helpers';
import type { StampPoint } from '../types';
import './ScanPage.css';

export function ScanPage() {
  const { state, dispatch } = useAppContext();
  const { startScanning, stopScanning, resetResult, isScanning, result, error } = useQRScanner();
  const { latitude, longitude, error: locationError } = useGeolocation();
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      isCompleted: false
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
      isCompleted: false
    }
  ];

  const handleStartScan = () => {
    resetResult();
    setScanMessage('');
    startScanning('qr-reader');
  };

  const handleStopScan = () => {
    stopScanning();
    setScanMessage('');
  };

  // QRコード読み取り結果の処理
  useEffect(() => {
    if (result && !isProcessing) {
      setIsProcessing(true);
      processQRResult(result);
    }
  }, [result, isProcessing]);

  const processQRResult = async (qrData: string) => {
    try {
      // スタンプポイントの検索
      const stampPoint = sampleStampPoints.find(point => 
        isValidQRCode(qrData, point.qrCode)
      );

      if (!stampPoint) {
        setScanMessage('❌ 無効なQRコードです');
        setIsProcessing(false);
        return;
      }

      // 既に獲得済みかチェック
      const alreadyCollected = state.collectedStamps.some(
        stamp => stamp.stampPointId === stampPoint.id
      );

      if (alreadyCollected) {
        setScanMessage('ℹ️ このスタンプは既に獲得済みです');
        setIsProcessing(false);
        return;
      }

      // 位置情報が利用可能な場合は距離をチェック
      if (latitude !== null && longitude !== null) {
        if (!isWithinRange(latitude, longitude, stampPoint, 0.1)) {
          setScanMessage('📍 スタンプポイントに近づいてからスキャンしてください');
          setIsProcessing(false);
          return;
        }
      }

      // スタンプを獲得
      const newStamp = {
        id: `stamp_${Date.now()}`,
        userId: state.user?.id || 'guest',
        stampPointId: stampPoint.id,
        collectedAt: new Date(),
        location: latitude && longitude ? { latitude, longitude } : undefined
      };

      dispatch({ type: 'ADD_STAMP', payload: newStamp });
      setScanMessage(`🎉 「${stampPoint.name}」のスタンプを獲得しました！`);
      
      // 少し待ってからスキャンを停止
      setTimeout(() => {
        stopScanning();
      }, 2000);

    } catch (error) {
      console.error('QR processing error:', error);
      setScanMessage('❌ スタンプの処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="scan-page">
      <h1>QRコードスキャン</h1>
      
      <div className="scan-section">
        {locationError && (
          <div className="alert alert--warning">
            <p>📍 位置情報が取得できません: {locationError}</p>
            <p>位置情報なしでもスキャンは可能ですが、距離チェックが無効になります。</p>
          </div>
        )}

        {!isScanning ? (
          <div className="scan-start">
            <div className="scan-placeholder">
              <div className="scan-icon">📱</div>
              <p>カメラを起動してQRコードをスキャンしてください</p>
            </div>
            
            <Button 
              onClick={handleStartScan}
              size="large"
              fullWidth
              disabled={isProcessing}
            >
              📷 カメラを起動
            </Button>
          </div>
        ) : (
          <div className="scan-active">
            <div id="qr-reader" className="qr-reader"></div>
            
            <div className="scan-controls">
              <Button 
                onClick={handleStopScan}
                variant="danger"
                fullWidth
              >
                ⏹️ スキャンを停止
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert--error">
            <p>❌ {error}</p>
          </div>
        )}

        {scanMessage && (
          <div className={`alert ${scanMessage.includes('🎉') ? 'alert--success' : 
                               scanMessage.includes('❌') ? 'alert--error' : 'alert--info'}`}>
            <p>{scanMessage}</p>
          </div>
        )}

        {result && (
          <div className="scan-result">
            <h3>スキャン結果</h3>
            <p className="qr-data">{result}</p>
          </div>
        )}
      </div>

      <div className="instructions">
        <h2>使い方</h2>
        <ol>
          <li>「カメラを起動」ボタンをタップ</li>
          <li>スタンプポイントのQRコードにカメラを向ける</li>
          <li>自動的にスキャンされます</li>
          <li>スタンプ獲得完了！</li>
        </ol>
        
        <div className="tips">
          <h3>💡 ヒント</h3>
          <ul>
            <li>明るい場所でスキャンすると読み取りやすくなります</li>
            <li>QRコード全体がカメラに収まるようにしてください</li>
            <li>スタンプポイントの近くでスキャンしてください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
