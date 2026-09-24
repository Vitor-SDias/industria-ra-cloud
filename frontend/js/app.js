document.addEventListener('DOMContentLoaded', () => {
  const hotspotBtn = document.querySelector('#hotspot-btn');
  const card = document.querySelector('#telemetry-card');
  const closeBtn = document.querySelector('#close-btn');

  const tempVal = document.querySelector('#temp-val');
  const vibVal = document.querySelector('#vib-val');
  const statusVal = document.querySelector('#status-val');

  // Função para procurar telemetria da API Flask
  async function fetchTelemetry() {
    try {
      const response = await fetch('http://localhost:5000/api/equipamentos/CNC-01/telemetria');
      if (!response.ok) throw new Error('Erro na requisição');
      
      const data = await response.json();
      tempVal.textContent = data.temperatura ?? '--';
      vibVal.textContent = data.vibracao ?? '--';
      statusVal.textContent = data.status ?? 'ONLINE';
    } catch (err) {
      console.error('Falha ao procurar dados da API:', err);
      tempVal.textContent = 'Erro';
      vibVal.textContent = 'Erro';
      statusVal.textContent = 'Offline';
    }
  }

  // Evento ao clicar no hotspot 3D
  if (hotspotBtn) {
    hotspotBtn.addEventListener('click', () => {
      fetchTelemetry();
      card.classList.remove('hidden');
    });
  }

  // Ocultar o card
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      card.classList.add('hidden');
    });
  }
});