import { createElement, clearElement } from "./dom_helpers";
import { setup, send } from "./socket";

const SELECTABLE_POINTS = ["0", "1/2", "1", "2", "3", "5", "8", "13"];

let registeredVotes = {};

export function render(parent, currentTopic, createNewSession) {
  createElement("h1", parent, { text: "Planning poker" });

  const socket = setup(currentTopic);

  const buttonContainer = createElement("div", parent, {
    class: "button-container",
  });
  renderButtons(buttonContainer, socket, createNewSession);

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
      renderVoteSelector(voteContainer);
    } else {
      registeredVotes[msg.client_id] = msg.message;
    }
    renderVotes(voteDisplay);
  };
  renderVotes(voteDisplay);
}

function renderVoteSelector(parent) {
  clearElement(parent);
  SELECTABLE_POINTS.forEach((v) => {
    createElement("input", parent, {
      type: "radio",
      id: `vote-${v}`,
      name: "points",
      value: v,
    });
    createElement("label", parent, {
      for: `vote-${v}`,
      text: v,
    });
  });
}

function renderVotes(parent) {
  clearElement(parent);
  createElement("div", parent, { text: "Votes" });
  Object.keys(registeredVotes).forEach((k) => {
    createElement("div", parent, { text: registeredVotes[k], class: "vote" });
  });
}

function renderButtons(parent, socket, createNewSession) {
  const copyLink = createElement("button", parent, {
    text: "Copy link",
  });
  copyLink.addEventListener("click", () =>
    navigator.clipboard.writeText(document.location.href)
  );

  const reset = createElement("button", parent, { text: "Clear votes" });
  reset.addEventListener("click", () => send(socket, "RESET"));

  const newSession = createElement("button", parent, { text: "New session" });
  newSession.addEventListener("click", () => createNewSession());
}
