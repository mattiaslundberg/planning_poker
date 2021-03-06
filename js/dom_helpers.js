export function createElement(elementType, parent, attrs) {
  const elm = document.createElement(elementType);
  parent.appendChild(elm);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "text") {
      elm.innerText = value;
    } else {
      elm.setAttribute(key, value);
    }
  });

  return elm;
}

export function clearElement(el) {
  el.innerHTML = "";
}
