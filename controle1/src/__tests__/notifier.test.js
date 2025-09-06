import notify from '../Notifications/notifier.js'
global.alert = jest.fn()

describe('notifier', () => {
  it('should call the notification function with a message', () => {
    const spy = jest.spyOn(global, 'alert').mockImplementation(() => {})
    notify('Test message')
    expect(spy).toHaveBeenCalledWith('Test message')
    spy.mockRestore()
  })
})
