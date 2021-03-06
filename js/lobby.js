import { createElement } from "./dom_helpers";
import { randomString } from "./generator_helpers";

export function render(parent, onSelect) {
  createElement("h1", parent, { text: "Welcome to planning poker!" });
  const button = createElement("button", parent, { text: "Create new vote" });
  button.addEventListener("click", () => {
    onSelect(randomString(6));
  });
}
