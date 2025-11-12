export const store = {
  async getIdentityKeyPair() {
    return window.secureStore.get('identityKeyPair')
  },
  async getLocalRegistrationId() {
    return window.secureStore.get('registrationId')
  },
  async setIdentity(identityKeyPair, registrationId) {
    await window.secureStore.set('identityKeyPair', identityKeyPair)
    await window.secureStore.set('registrationId', registrationId)
  },
  async removeIdentity() {
    await window.secureStore.remove('identityKeyPair')
    await window.secureStore.remove('registrationId')
  },
}
