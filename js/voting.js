import { createElement } from "./dom_helpers";
import { setup, send } from "./socket";

const SELECTABLE_POINTS = ["0", "1/2", "1", "2", "3", "5", "8", "13"];

export function render(parent, currentTopic, onReset) {
  createElement("h1", parent, { text: `Planning poker: ${currentTopic}` });

  const socket = setup(currentTopic, (msg) => {
    // TODO: Render vote result
    console.warn(msg);
  });

  const voteContainer = createElement("form", parent, {});
  renderVoteSelector(voteContainer);
  voteContainer.addEventListener("change", () => {
    const selected = document.querySelector('input[name="points"]:checked');
    if (selected) {
      send(socket, selected.value);
    }
  });

  const button = createElement("button", parent, { text: "Reset" });
  button.addEventListener("click", () => {
    onReset();
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
