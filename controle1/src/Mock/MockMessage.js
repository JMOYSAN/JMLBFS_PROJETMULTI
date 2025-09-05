import notifier from '../Notifications/notifier.js'

function envoyerMessageAuto(nombre) {
  notifier('Vous avez ' + nombre + ' nouveau(x) message(s)')
  console.log('notif envoyée')
  //setTimeout(envoyerMessageAuto(nombre + 1), 20000)
}

export default envoyerMessageAuto
