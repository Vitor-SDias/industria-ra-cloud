# Sistema de Monitorização RA + Cloud - Torno CNC

Este projeto consiste numa solução de Realidade Aumentada (WebAR) integrada a uma arquitetura em nuvem/microserviços para monitorização e telemetria industrial em tempo real de um Torno CNC.

## 🛠️ Arquitetura do Sistema

A aplicação é dividida nas seguintes camadas orquestradas via **Docker Compose**:

1. **Broker MQTT (Mosquitto)**: Responsável pela mensageria pub/sub das leituras industriais.
2. **Simulador de Telemetria (Python)**: Gera e envia dados periódicos de temperatura, vibração e status da máquina via MQTT.
3. **API Backend (Flask)**: Consome as mensagens do MQTT e disponibiliza endpoints RESTful para consulta de telemetria.
4. **Frontend WebAR (MindAR + A-Frame)**: Interface interativa em Realidade Aumentada hospedada via GitHub Pages que consulta a API e exibe os dados em tempo real sobre o ativo.

---

## 📁 Estrutura do Repositório

```text
industria-ra-cloud/
├── compose.yaml
├── README.md
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── simulator/
│   ├── simulator.py
│   ├── requirements.txt
│   └── Dockerfile
├── mqtt/
│   └── mosquitto.conf
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    └── assets/
        ├── images/
        └── targets/
            └── targets.mind