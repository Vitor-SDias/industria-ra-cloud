import os
import datetime
from flask import Flask, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt

app = Flask(__name__)
CORS(app)  # Permite que o Frontend consulte a API sem erros de CORS

# Dados de telemetria armazenados em memória
telemetria_db = {
    "temperatura": 38.5,
    "vibracao": 1.8,
    "status": "operando",
    "atualizacao": datetime.datetime.now().strftime("%H:%M:%S")
}

# Configuração do Cliente MQTT
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Conectado ao Broker MQTT com código: {rc}")
    # Inscreve-se nos tópicos de telemetria do Torno CNC
    client.subscribe("industria/CNC-01/#")

def on_message(client, userdata, msg):
    global telemetria_db
    topico = msg.topic
    valor = msg.payload.decode("utf-8")
    
    if topico == "industria/CNC-01/temperatura":
        telemetria_db["temperatura"] = float(valor)
    elif topico == "industria/CNC-01/vibracao":
        telemetria_db["vibracao"] = float(valor)
    elif topico == "industria/CNC-01/status":
        telemetria_db["status"] = valor
        
    telemetria_db["atualizacao"] = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"Telemetria atualizada [{topico}]: {valor}")

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
except Exception as e:
    print(f"Aviso: Não foi possível conectar ao broker MQTT no arranque: {e}")

# Endpoints da API Flask
@app.route('/api/equipamentos/<id_equipamento>', methods=['GET'])
def get_equipamento(id_equipamento):
    return jsonify({
        "id": id_equipamento,
        "tipo": "Torno CNC",
        "setor": "Usinagem",
        "status": telemetria_db["status"]
    })

@app.route('/api/equipamentos/<id_equipamento>/telemetria', methods=['GET'])
def get_telemetria(id_equipamento):
    return jsonify(telemetria_db)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)