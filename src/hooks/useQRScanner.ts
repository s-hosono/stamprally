import { useState, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export interface QRScannerState {
  isScanning: boolean;
  result: string | null;
  error: string | null;
}

export function useQRScanner() {
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    result: null,
    error: null,
  });

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanning = useCallback((elementId: string) => {
    if (scannerRef.current) {
      return; // 既にスキャン中
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    const scanner = new Html5QrcodeScanner(elementId, config, false);

    const onScanSuccess = (decodedText: string) => {
      setState(prev => ({
        ...prev,
        result: decodedText,
        error: null,
        isScanning: false,
      }));
      
      // スキャン成功後にスキャナーを停止
      scanner.clear().catch(console.error);
      scannerRef.current = null;
    };

    const onScanFailure = (error: string) => {
      // 継続的なエラーログを避けるため、重要なエラーのみログ出力
      if (error.includes('NotFoundException') === false) {
        console.warn('QR scan error:', error);
      }
    };

    try {
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
      setState(prev => ({ ...prev, isScanning: true, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start camera',
        isScanning: false,
      }));
    }
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        scannerRef.current = null;
        setState(prev => ({ ...prev, isScanning: false }));
      } catch (error) {
        console.error('Failed to stop scanner:', error);
      }
    }
  }, []);

  const resetResult = useCallback(() => {
    setState(prev => ({ ...prev, result: null, error: null }));
  }, []);

  return {
    ...state,
    startScanning,
    stopScanning,
    resetResult,
  };
}
