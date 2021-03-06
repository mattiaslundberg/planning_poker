import { render as lobby } from "./lobby";
import { render as voting } from "./voting";
import { clearElement } from "./dom_helpers";

const root = document.getElementById("root");
let initialTopic = document.location.hash.replace("#", "");

if (!initialTopic) {
  openLobby();
} else {
  openTopic(initialTopic);
}

function openTopic(topicName) {
  clearElement(root);
  document.location.hash = topicName;
  voting(root, topicName, openLobby);
}

function openLobby() {
  clearElement(root);
  document.location.hash = "";
  lobby(root, openTopic);
}
