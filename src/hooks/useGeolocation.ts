import { useState, useEffect } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        isLoading: false,
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5分
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
