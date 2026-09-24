document.addEventListener('DOMContentLoaded', () => {
  const hotspotBtn = document.querySelector('#hotspot-btn');
  const card = document.querySelector('#telemetry-card');
  const closeBtn = document.querySelector('#close-btn');

  const tempVal = document.querySelector('#temp-val');
  const vibVal = document.querySelector('#vib-val');
  const statusVal = document.querySelector('#status-val');

  async function fetchTelemetry() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('http://localhost:5000/api/equipamentos/CNC-01/telemetria', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Erro na resposta');

      const data = await response.json();
      tempVal.textContent = data.temperatura ?? '--';
      vibVal.textContent = data.vibracao ?? '--';
      statusVal.textContent = data.status ?? 'ONLINE';
    } catch (err) {
      console.warn('API inacessível. A carregar dados de simulação.');
      tempVal.textContent = (42 + Math.random() * 5).toFixed(1);
      vibVal.textContent = (2.1 + Math.random() * 0.8).toFixed(1);
      statusVal.textContent = 'OPERANDO';
    }
  }

  function openCard(e) {
    if (e) e.preventDefault();
    fetchTelemetry();
    if (card) {
      card.classList.remove('hidden');
      card.style.display = 'block'; // Força exibição mesmo se o CSS falhar
    }
  }

  function closeCard(e) {
    if (e) e.preventDefault();
    if (card) {
      card.classList.add('hidden');
      card.style.display = 'none';
    }
  }

  if (hotspotBtn) {
    hotspotBtn.addEventListener('click', openCard);
    hotspotBtn.addEventListener('touchstart', openCard, { passive: false });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCard);
    closeBtn.addEventListener('touchstart', closeCard, { passive: false });
  }
});