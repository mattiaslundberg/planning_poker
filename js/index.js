import { render as lobby } from "./lobby";
import { clearElement } from "./dom_helpers";

const root = document.getElementById("root");
let currentTopic = document.location.hash.replace("#", "");

if (!currentTopic) {
  clearElement(root);
  lobby(root, openTopic);
} else {
  openTopic(currentTopic);
}

function openTopic(topicName) {
  clearElement(root);
  document.location.hash = topicName;
  console.warn(`Open topic ${topicName}`);
}
