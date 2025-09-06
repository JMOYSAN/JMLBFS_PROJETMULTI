import envoyerMessageAuto from '../Mock/MockMessage.js'
import * as notifierModule from '../Notifications/notifier.js'

jest.spyOn(notifierModule, 'default').mockImplementation(() => {})

describe('envoyerMessageAuto', () => {
  it('should call notifier with the correct message', () => {
    envoyerMessageAuto(3)
    expect(notifierModule.default).toHaveBeenCalledWith(
      'Vous avez 3 nouveau(x) message(s)'
    )
  })
})
