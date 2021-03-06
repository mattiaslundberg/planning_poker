import { randomString } from "./generator_helpers";
export function setup(topicName) {
  return new WebSocket(`ws://localhost:8000/ws/planning/${topicName}/`);
}

export function send(ws, message) {
  ws.send(
    JSON.stringify({
      message: message,
      client_id: clientId(),
    })
  );
}

function clientId() {
  let id = localStorage.getItem("planning-client-id");
  if (id) {
    return id;
  }

  id = randomString(16);
  localStorage.setItem("planning-client-id", id);

  return id;
}
