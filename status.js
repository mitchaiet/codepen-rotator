async function getWebsiteCount() {
    const response = await fetch('/website-count');
    const data = await response.json();
    return data.count;
  }
  
  async function getCurrentWebsiteTitle(websiteId) {
    const response = await fetch(`/website/${websiteId}/index.html`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = doc.querySelector('title').textContent;
    return title;
  }
  
  function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    currentTimeElement.textContent = new Date().toLocaleTimeString();
  }
  
  (async () => {
    const totalWebsitesElement = document.getElementById('totalWebsites');
    const currentWebsiteTitleElement = document.getElementById('currentWebsiteTitle');
    const intervalSlider = document.getElementById('intervalSlider');
    const intervalDisplay = document.getElementById('intervalDisplay');
    const interval = Number(localStorage.getItem('interval')) || 10000;
    
    intervalSlider.value = interval;
    intervalDisplay.textContent = interval;
  
    const totalWebsites = await getWebsiteCount();
    totalWebsitesElement.textContent = totalWebsites;
  
    const currentWebsiteId = Number(localStorage.getItem('currentWebsiteId')) || 0;
    const currentWebsiteTitle = await getCurrentWebsiteTitle(currentWebsiteId);
    currentWebsiteTitleElement.textContent = currentWebsiteTitle;
  
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
  
    intervalSlider.addEventListener('input', () => {
      const newInterval = Number(intervalSlider.value);
      intervalDisplay.textContent = newInterval;
      localStorage.setItem('interval', newInterval);
    });
  })();
  