export const store = {
  async getIdentityKeyPair() {
    return window.secureStore.get('identityKeyPair')
  },
  async getLocalRegistrationId() {
    return window.secureStore.get('registrationId')
  },
  async setIdentity(identityKeyPair, registrationId) {
    const encoded = {
      pubKey: Buffer.from(identityKeyPair.pubKey).toString('base64'),
      privKey: Buffer.from(identityKeyPair.privKey).toString('base64'),
    }
    await window.secureStore.set('identityKeyPair', encoded)
    await window.secureStore.set('registrationId', registrationId)
  },
  async removeIdentity() {
    await window.secureStore.remove('identityKeyPair')
    await window.secureStore.remove('registrationId')
  },
}
