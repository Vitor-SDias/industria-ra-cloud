window.addEventListener('DOMContentLoaded', () => {
  console.log('[WebAR] Aplicação carregada.');

  const hotspotBtn = document.querySelector('#hotspot-btn');
  const card = document.querySelector('#telemetry-card');
  const closeBtn = document.querySelector('#close-btn');

  const tempVal = document.querySelector('#temp-val');
  const vibVal = document.querySelector('#vib-val');
  const statusVal = document.querySelector('#status-val');

  // Função para buscar dados da API Flask ou usar dados de simulação
  async function fetchTelemetry() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos de timeout

      const response = await fetch('http://localhost:5000/api/equipamentos/CNC-01/telemetria', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Falha no pedido HTTP');

      const data = await response.json();
      if (tempVal) tempVal.textContent = data.temperatura ?? '--';
      if (vibVal) vibVal.textContent = data.vibracao ?? '--';
      if (statusVal) statusVal.textContent = data.status ?? 'ONLINE';
      console.log('[WebAR] Dados recebidos do Flask Backend:', data);
    } catch (err) {
      console.warn('[WebAR] API inacessível ou bloqueada por HTTPS. Utilizando dados simulados para a demonstração.');
      
      // Fallback de dados para simular o funcionamento no GitHub Pages / Telemóvel
      if (tempVal) tempVal.textContent = (40 + Math.random() * 8).toFixed(1);
      if (vibVal) vibVal.textContent = (1.8 + Math.random() * 1.2).toFixed(1);
      if (statusVal) statusVal.textContent = 'OPERANDO';
    }
  }

  // Função para abrir o card
  function handleOpen(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('[WebAR] Ação disparada: Abrir Telemetria');
    fetchTelemetry();
    if (card) {
      card.classList.remove('hidden');
      card.style.display = 'block'; // Força exibição
    }
  }

  // Função para fechar o card
  function handleClose(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('[WebAR] Ação disparada: Fechar Card');
    if (card) {
      card.classList.add('hidden');
      card.style.display = 'none';
    }
  }

  // Atribuição de ouvintes de eventos para Mouse e Touchscreen
  if (hotspotBtn) {
    hotspotBtn.addEventListener('click', handleOpen);
    hotspotBtn.addEventListener('touchstart', handleOpen, { passive: false });
  } else {
    console.error('[WebAR] Erro: Elemento #hotspot-btn não foi encontrado no HTML!');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchstart', handleClose, { passive: false });
  }
});