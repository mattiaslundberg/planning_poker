import { createElement, clearElement } from "./dom_helpers";
import { setup, send } from "./socket";

const SELECTABLE_POINTS = ["0", "1/2", "1", "2", "3", "5", "8", "13"];

let registeredVotes = {};
let selfSelected;

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
  const resultContainer = createElement("form", container, {
    class: "voting-results",
  });
  renderVoteSelector(voteContainer, resultContainer);
  voteContainer.addEventListener("change", () => {
    const selected = document.querySelector('input[name="points"]:checked');
    if (selected) {
      send(socket, selected.value);
      selfSelected = selected.value;
    }
  });

  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.message === "RESET") {
      registeredVotes = {};
    } else {
      registeredVotes[msg.client_id] = msg.message;
    }
    renderVoteSelector(voteContainer, resultContainer);
  };
}

function renderVoteSelector(selectorParent, resultParent) {
  const voteCounts = getVoteCounts();
  clearElement(selectorParent);
  clearElement(resultParent);

  SELECTABLE_POINTS.forEach((v) => {
    const input = createElement("input", selectorParent, {
      type: "radio",
      id: `vote-${v}`,
      name: "points",
      value: v,
    });
    if (v === selfSelected) {
      input.checked = true;
    }
    createElement("label", selectorParent, {
      for: `vote-${v}`,
      text: v,
    });

    createElement("div", resultParent, {
      text: voteCounts[v] || "0",
    });
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

function getVoteCounts() {
  return Object.keys(registeredVotes).reduce((acc, k) => {
    const value = registeredVotes[k];
    if (acc[value]) {
      acc[value] += 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});
}
