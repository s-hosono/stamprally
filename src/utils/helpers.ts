import type { StampPoint, UserStamp } from '../types';

// 距離計算（Haversine formula）
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// スタンプポイントまでの距離が許可範囲内かチェック
export function isWithinRange(
  userLat: number,
  userLon: number,
  stampPoint: StampPoint,
  rangeKm: number = 0.1 // デフォルト100m
): boolean {
  const distance = calculateDistance(userLat, userLon, stampPoint.latitude, stampPoint.longitude);
  return distance <= rangeKm;
}

// QRコードの有効性をチェック
export function isValidQRCode(qrData: string, expectedCode: string): boolean {
  return qrData.trim() === expectedCode.trim();
}

// 進捗率計算
export function calculateProgress(
  collectedStamps: UserStamp[],
  totalStamps: number
): number {
  if (totalStamps === 0) return 0;
  return Math.round((collectedStamps.length / totalStamps) * 100);
}

// 日付フォーマット
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// ローカルストレージ操作
export const storage = {
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage save failed:', error);
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage read failed:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage remove failed:', error);
    }
  }
};
