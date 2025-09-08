// Les mocks ont été écrits par ChatGPT

import notifier from '../Notifications/notifier.js'

function envoyerMessageAuto(nombre) {
  notifier('Vous avez ' + nombre + ' nouveau(x) message(s)')
  //setTimeout(envoyerMessageAuto(nombre + 1), 20000)
}

export default envoyerMessageAuto
