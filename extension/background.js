// Yeni sekme açıldığında content script'in yüklenmesini sağla
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    console.log(`📝 Sekme güncellendi: ${tab.url}`);
    
    // Content script'in durumunu kontrol et
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        return window.hasOwnProperty('TrackFlowInitialized');
      }
    }).then(result => {
      if (!result[0].result) {
        console.log('🔄 Content script yeniden yükleniyor...');
        // Content script'i yükle
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).catch(err => {
          console.error('❌ Content script yükleme hatası:', err);
        });
      }
    }).catch(err => {
      console.error('❌ Durum kontrolü hatası:', err);
    });
  }
});

// Extension yüklendiğinde veya güncellendiğinde
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎉 TrackFlow Extension yüklendi/güncellendi');
  
  // Tüm açık sekmelerde content script'i çalıştır
  chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, tabs => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(err => {
          console.error(`❌ Tab ${tab.id} için content script yükleme hatası:`, err);
        });
      }
    }
  });
}); 