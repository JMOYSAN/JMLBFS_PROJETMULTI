import * as signal from 'libsignal-protocol-typescript'
import { store } from './storage.js'

const API_URL = import.meta.env.VITE_API_URL

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
      ik = {
        pubKey: Buffer.from(ik.pubKey, 'base64'),
        privKey: Buffer.from(ik.privKey, 'base64'),
      }
      console.log('Loaded existing identity keys')
    }

    return { identityKeyPair: ik, registrationId: rid }
  },

  /** Upload device public keys to backend */
  async registerDevice(userId, deviceId, displayName = 'Electron') {
    const { identityKeyPair } = await this.initIdentity()
    const signedPreKey = await this.generateSignedPreKey(identityKeyPair, 1)
    const preKeys = await this.generatePreKeys(1, 10)

    const body = {
      user_id: userId,
      device_id: deviceId,
      ik_pub: Buffer.from(identityKeyPair.pubKey).toString('base64'),
      sig_pub: Buffer.from(identityKeyPair.pubKey).toString('base64'),
      spk_pub: Buffer.from(signedPreKey.keyPair.pubKey).toString('base64'),
      spk_sig: Buffer.from(signedPreKey.signature).toString('base64'),
      opks: preKeys.map((p) =>
        Buffer.from(p.keyPair.pubKey).toString('base64')
      ),
      display_name: displayName,
    }

    const res = await fetch(`${API_URL}/e2ee/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('E2EE registration failed:', text)
      throw new Error('E2EE device registration failed')
    }

    console.log('E2EE device registered with backend')
  },

  /** Generate batches of prekeys */
  async generatePreKeys(startId = 1, count = 20) {
    const preKeys = []
    for (let i = startId; i < startId + count; i++) {
      const preKey = await signal.KeyHelper.generatePreKey(i)
      preKeys.push(preKey)
    }
    return preKeys
  },

  async generateSignedPreKey(identityKeyPair, keyId = 1) {
    return await signal.KeyHelper.generateSignedPreKey(identityKeyPair, keyId)
  },

  /** Create a session tied to group + remote user */
  async createSession(remoteBundle, groupId, remoteUserId) {
    const addr = `${groupId}:${remoteUserId}`
    const builder = new signal.SessionBuilder(store, addr)
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

  async encryptMessage(groupId, remoteUserId, plaintext) {
    const addr = `${groupId}:${remoteUserId}`
    const cipher = new signal.SessionCipher(store, addr)
    const result = await cipher.encrypt(Buffer.from(plaintext, 'utf8'))
    return result
  },

  async decryptMessage(groupId, senderUserId, message) {
    const addr = `${groupId}:${senderUserId}`
    const cipher = new signal.SessionCipher(store, addr)
    let plaintext
    if (message.type === 3) {
      plaintext = await cipher.decryptPreKeyWhisperMessage(
        Buffer.from(message.body, 'base64'),
        'binary'
      )
    } else {
      plaintext = await cipher.decryptWhisperMessage(
        Buffer.from(message.body, 'base64'),
        'binary'
      )
    }
    return new TextDecoder().decode(plaintext)
  },
}
