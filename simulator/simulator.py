import os
import time
import random
import paho.mqtt.client as mqtt

MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

print("A aguardar conexão com o Broker MQTT...")
while True:
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        print("Simulador conectado ao Broker MQTT!")
        break
    except Exception:
        time.sleep(2)

status_opcoes = ["operando", "operando", "operando", "alerta"]

while True:
    # Gera valores simulados de telemetria
    temp = round(random.uniform(36.0, 52.0), 1)
    vib = round(random.uniform(1.2, 3.8), 1)
    st = random.choice(status_opcoes)

    # Publica nos tópicos do Torno CNC
    client.publish("industria/CNC-01/temperatura", str(temp))
    client.publish("industria/CNC-01/vibracao", str(vib))
    client.publish("industria/CNC-01/status", st)

    print(f"[Simulador] Dados enviados -> Temp: {temp}ºC | Vibração: {vib} | Status: {st}")
    time.sleep(5)  # Envia novas leituras a cada 5 segundos