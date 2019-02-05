import { sayHello } from "./greet"

const name = 'TypeScript'

function showHello(divId: string, name: string) {
  const elt = document.getElementById(divId)
  elt.innerHTML = sayHello(name)
}

window.onload = function () {
  showHello('greeting', name)
}

