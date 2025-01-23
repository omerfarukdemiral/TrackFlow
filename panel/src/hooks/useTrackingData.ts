import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { TrackingEvent } from '../types/tracking';

export function useTrackingData() {
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = () => {
    setLoading(true);
    const trackingRef = ref(database, 'tracking-data');

    const unsubscribe = onValue(trackingRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Firebase'den gelen verileri düz bir diziye dönüştür
          const dataArray = Object.values(data).reduce((acc: TrackingEvent[], curr: any) => {
            // Eğer curr bir dizi ise, elemanlarını ekle
            if (Array.isArray(curr)) {
              return [...acc, ...curr];
            }
            // Değilse, tek bir eleman olarak ekle
            return [...acc, curr];
          }, []);

          console.log('Firebase\'den alınan ham veri:', data);
          console.log('İşlenmiş veri:', dataArray);
          
          setTrackingData(dataArray);
        } else {
          setTrackingData([]);
        }
        setError('');
      } catch (err) {
        console.error('Veri işleme hatası:', err);
        setError('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase bağlantı hatası:', error);
      setError('Firebase bağlantı hatası');
      setLoading(false);
    });

    return () => {
      unsubscribe();
      off(trackingRef);
    };
  };

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      cleanup();
    };
  }, []);

  const refreshData = () => {
    const cleanup = fetchData();
    return () => {
      cleanup();
    };
  };

  return { trackingData, loading, error, refreshData };
} 