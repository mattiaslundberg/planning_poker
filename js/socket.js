export function setup(topicName, onMessage) {
  const ws = new WebSocket(`ws://localhost:8000/ws/planning/${topicName}/`);
  ws.onmessage = onMessage;
  return ws;
}

export function send(ws, message) {
  ws.send(
    JSON.stringify({
      message: message,
    })
  );
}
