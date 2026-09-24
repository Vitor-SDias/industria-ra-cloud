window.addEventListener('load', () => {
  console.log('App WebAR inicializada.');

  const hotspotBtn = document.querySelector('#hotspot-btn');
  const card = document.querySelector('#telemetry-card');
  const closeBtn = document.querySelector('#close-btn');

  const tempVal = document.querySelector('#temp-val');
  const vibVal = document.querySelector('#vib-val');
  const statusVal = document.querySelector('#status-val');

  // Verifica no console se os elementos foram encontrados no HTML
  console.log('Hotspot Element:', hotspotBtn);
  console.log('Card Element:', card);

  async function fetchTelemetry() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('http://localhost:5000/api/equipamentos/CNC-01/telemetria', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Erro na API');

      const data = await response.json();
      tempVal.textContent = data.temperatura ?? '--';
      vibVal.textContent = data.vibracao ?? '--';
      statusVal.textContent = data.status ?? 'ONLINE';
    } catch (err) {
      console.warn('API inacessível. A carregar dados simulados.');
      if (tempVal) tempVal.textContent = (42 + Math.random() * 5).toFixed(1);
      if (vibVal) vibVal.textContent = (2.1 + Math.random() * 0.8).toFixed(1);
      if (statusVal) statusVal.textContent = 'OPERANDO';
    }
  }

  function mostrarCard() {
    console.log('Botão clicado! Abrindo card...');
    fetchTelemetry();
    if (card) {
      card.classList.remove('hidden');
      card.style.display = 'block';
    } else {
      console.error('Elemento #telemetry-card não foi encontrado!');
    }
  }

  function ocultarCard() {
    console.log('Fechando card...');
    if (card) {
      card.classList.add('hidden');
      card.style.display = 'none';
    }
  }

  // Registra múltiplos eventos de interação para garantir no mobile e desktop
  if (hotspotBtn) {
    ['click', 'touchstart', 'mousedown'].forEach(eventType => {
      hotspotBtn.addEventListener(eventType, (e) => {
        e.preventDefault();
        mostrarCard();
      });
    });
  } else {
    console.error('Elemento #hotspot-btn não existe no index.html!');
  }

  if (closeBtn) {
    ['click', 'touchstart'].forEach(eventType => {
      closeBtn.addEventListener(eventType, (e) => {
        e.preventDefault();
        ocultarCard();
      });
    });
  }
});