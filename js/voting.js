import { createElement, clearElement } from "./dom_helpers";
import { setup, send } from "./socket";

const SELECTABLE_POINTS = ["0", "1/2", "1", "2", "3", "5", "8", "13"];

let registeredVotes = {};

export function render(parent, currentTopic, createNewSession) {
  createElement("h1", parent, { text: `Planning poker: ${currentTopic}` });

  const socket = setup(currentTopic);

  const container = createElement("div", parent, { class: "voting-container" });
  const voteContainer = createElement("form", container, {
    class: "voting-selector",
  });
  renderVoteSelector(voteContainer);
  voteContainer.addEventListener("change", () => {
    const selected = document.querySelector('input[name="points"]:checked');
    if (selected) {
      send(socket, selected.value);
    }
  });

  const voteDisplay = createElement("div", container, {
    class: "voting-results",
  });

  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.message === "RESET") {
      registeredVotes = {};
    } else {
      registeredVotes[msg.client_id] = msg.message;
    }
    renderVotes(voteDisplay, socket);
  };
  renderVotes(voteDisplay, socket);

  const button = createElement("button", parent, { text: "New session" });
  button.addEventListener("click", () => {
    createNewSession();
  });
}

function renderVoteSelector(parent) {
  SELECTABLE_POINTS.forEach((v) => {
    createElement("input", parent, {
      type: "radio",
      name: "points",
      value: v,
      text: v,
    });
  });
}

function renderVotes(parent, socket) {
  clearElement(parent);
  createElement("div", parent, { text: "Votes" });
  Object.keys(registeredVotes).forEach((k) => {
    createElement("div", parent, { text: registeredVotes[k], class: "vote" });
  });

  const button = createElement("button", parent, { text: "Clear votes" });
  button.addEventListener("click", () => {
    send(socket, "RESET");
  });
}
