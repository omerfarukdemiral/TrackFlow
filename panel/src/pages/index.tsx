import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel, 
  CircularProgress,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClickStats from '../components/ClickStats';
import HeatMap from '../components/HeatMap';
import { useTrackingData } from '../hooks/useTrackingData';
import { TimeFilter } from '../types/filters';
import { TrackingEvent } from '../types/tracking';

const timeFilterOptions = [
  { value: '1min', label: 'Son 1 Dakika' },
  { value: '3min', label: 'Son 3 Dakika' },
  { value: '5min', label: 'Son 5 Dakika' },
  { value: '1hour', label: 'Son 1 Saat' },
  { value: '4hours', label: 'Son 4 Saat' },
  { value: '1day', label: 'Son 24 Saat' },
  { value: 'all', label: 'Tüm Zamanlar' }
] as const;

export default function Home() {
  const { trackingData, loading, error, refreshData } = useTrackingData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [clearLoading, setClearLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleClearData = async () => {
    if (!confirm('Tüm izleme verilerini silmek istediğinizden emin misiniz?')) {
      return;
    }

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.',
        severity: 'error'
      });
      return;
    }

    setClearLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/tracking-data', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor. Lütfen tekrar giriş yapın.');
      }

      if (!response.ok) {
        throw new Error('Veri temizleme işlemi başarısız oldu');
      }

      setSnackbar({
        open: true,
        message: 'Tüm veriler başarıyla temizlendi',
        severity: 'success'
      });

      // Verileri yeniden yükle
      refreshData();
    } catch (error) {
      console.error('Silme hatası:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Veri temizleme sırasında bir hata oluştu',
        severity: 'error'
      });
      
      // Token hatası durumunda localStorage'ı temizle
      if (error instanceof Error && error.message.includes('yetkiniz bulunmuyor')) {
        localStorage.removeItem('jwt_token');
      }
    } finally {
      setClearLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          Veri yüklenirken bir hata oluştu: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          TrackFlow Analytics
        </Typography>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleClearData}
          disabled={clearLoading}
        >
          {clearLoading ? 'Temizleniyor...' : 'Verileri Temizle'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Sol taraf - Isı Haritası */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              height: '800px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Etkileşim Isı Haritası</Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Zaman Filtresi</InputLabel>
                <Select
                  value={timeFilter}
                  label="Zaman Filtresi"
                  onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                >
                  {timeFilterOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <HeatMap data={trackingData} timeFilter={timeFilter} />
            
            {/* Renk Skalası Açıklaması */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Etkileşim Yoğunluğu:</Typography>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(to right, #313695, #4575b4, #74add1, #abd9e9, #fee090, #fdae61, #f46d43, #d73027)',
                height: '20px',
                width: '200px',
                borderRadius: 1
              }} />
              <Typography variant="body2" sx={{ ml: 1 }}>Düşük → Yüksek</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sağ taraf - İstatistikler */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              height: '800px',
              overflow: 'auto'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tıklama İstatistikleri
            </Typography>
            <ClickStats data={trackingData} timeFilter={timeFilter} />
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 