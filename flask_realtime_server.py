import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
import time
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

def generate_data():
    while True:
        data = {
            "type": "pollution_update",
            "payload": {
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "location": random.choice(["Nairobi CBD", "Westlands", "Karen", "Eastlands"]),
                "pm25": random.randint(20, 220),
                "no2": random.randint(10, 110),
                "co": random.randint(20, 70),
                "aqi": random.randint(50, 250),
                "status": random.choice(["Good", "Moderate", "Unhealthy", "Hazardous"]),
                "indoor": {"pm25": random.randint(50, 200), "no2": random.randint(20, 100)},
                "outdoor": {"pm25": random.randint(100, 400), "no2": random.randint(30, 150)},
            }
        }
        socketio.emit('pollution_update', data)
        eventlet.sleep(5)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == '__main__':
    # Start the background task using SocketIO's method
    socketio.start_background_task(generate_data)
    socketio.run(app, host='0.0.0.0', port=3000)