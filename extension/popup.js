document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('token');
  const saveButton = document.getElementById('saveToken');
  const statusDiv = document.getElementById('status');
  
  // Kaydedilmiş token'ı yükle
  chrome.storage.local.get(['jwt_token'], function(result) {
    if (result.jwt_token) {
      tokenInput.value = result.jwt_token;
      updateStatus(true);
    }
  });
  
  // Token kaydetme
  saveButton.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    
    if (!token) {
      alert('Lütfen geçerli bir token girin');
      return;
    }
    
    chrome.storage.local.set({ jwt_token: token }, function() {
      updateStatus(true);
      alert('Token başarıyla kaydedildi');
    });
  });
  
  // Durum güncelleme
  function updateStatus(isActive) {
    statusDiv.className = `status ${isActive ? 'active' : 'inactive'}`;
    statusDiv.textContent = `İzleme Durumu: ${isActive ? 'Aktif' : 'Pasif'}`;
  }
}); 