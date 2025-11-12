// src/services/crypto/CryptoService.js
import * as signal from 'libsignal-protocol-typescript'
import { store } from './storage.js'

export const CryptoService = {
  /** Initialize device identity (one-time) */
  async initIdentity() {
    let ik = await store.getIdentityKeyPair()
    let rid = await store.getLocalRegistrationId()

    if (!ik || !rid) {
      const identityKeyPair = await signal.KeyHelper.generateIdentityKeyPair()
      const registrationId = await signal.KeyHelper.generateRegistrationId()
      await store.setIdentity(identityKeyPair, registrationId)
      ik = identityKeyPair
      rid = registrationId
      console.log('Generated new identity keys')
    } else {
      // Convert back from base64 to ArrayBuffer
      ik = {
        pubKey: Buffer.from(ik.pubKey, 'base64'),
        privKey: Buffer.from(ik.privKey, 'base64'),
      }
      console.log('Loaded existing identity keys')
    }

    return { identityKeyPair: ik, registrationId: rid }
  },

  /** Generate a batch of prekeys */
  async generatePreKeys(startId = 1, count = 20) {
    const preKeys = []
    for (let i = startId; i < startId + count; i++) {
      const preKey = await signal.KeyHelper.generatePreKey(i)
      preKeys.push(preKey)
    }
    return preKeys
  },

  /** Generate a signed prekey */
  async generateSignedPreKey(identityKeyPair, keyId = 1) {
    return await signal.KeyHelper.generateSignedPreKey(identityKeyPair, keyId)
  },

  /** Create a session with a remote device (X3DH handshake) */
  async createSession(remoteBundle, remoteAddr) {
    const builder = new signal.SessionBuilder(store, remoteAddr)
    await builder.processPreKey({
      registrationId: remoteBundle.registrationId,
      identityKey: Buffer.from(remoteBundle.ik_pub, 'base64'),
      signedPreKey: {
        keyId: remoteBundle.spk_id,
        publicKey: Buffer.from(remoteBundle.spk_pub, 'base64'),
        signature: Buffer.from(remoteBundle.spk_sig, 'base64'),
      },
      preKey: remoteBundle.opk_id
        ? {
            keyId: remoteBundle.opk_id,
            publicKey: Buffer.from(remoteBundle.opk_pub, 'base64'),
          }
        : undefined,
    })
  },

  /** Encrypt a plaintext for a remote session */
  async encryptMessage(remoteAddr, plaintext) {
    const cipher = new signal.SessionCipher(store, remoteAddr)
    const result = await cipher.encrypt(Buffer.from(plaintext, 'utf8'))
    return result // contains type + body
  },

  /** Decrypt an incoming message */
  async decryptMessage(remoteAddr, message) {
    const cipher = new signal.SessionCipher(store, remoteAddr)
    let plaintext
    if (message.type === 3) {
      // prekey message
      plaintext = await cipher.decryptPreKeyWhisperMessage(
        Buffer.from(message.body, 'base64'),
        'binary'
      )
    } else {
      // normal message
      plaintext = await cipher.decryptWhisperMessage(
        Buffer.from(message.body, 'base64'),
        'binary'
      )
    }
    return new TextDecoder().decode(plaintext)
  },
}
