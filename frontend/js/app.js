document.addEventListener('DOMContentLoaded', () => {
  const hotspotBtn = document.querySelector('#hotspot-btn');
  const card = document.querySelector('#telemetry-card');
  const closeBtn = document.querySelector('#close-btn');

  const tempVal = document.querySelector('#temp-val');
  const vibVal = document.querySelector('#vib-val');
  const statusVal = document.querySelector('#status-val');

  // Função para buscar telemetria da API Flask ou gerar dados de simulação
  async function fetchTelemetry() {
    try {
      // Tenta buscar da API local com timeout rápido
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
      console.warn('API local offline ou inacessível via HTTPS. Exibindo dados de simulação WebAR.');
      
      // Dados simulados para apresentação/demo
      tempVal.textContent = (42 + Math.random() * 5).toFixed(1);
      vibVal.textContent = (2.1 + Math.random() * 0.8).toFixed(1);
      statusVal.textContent = 'OPERANDO';
    }
  }

  // Evento ao clicar no hotspot 3D / botão
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