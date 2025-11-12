// test-libsignal.mjs
import * as signal from 'libsignal-protocol-typescript'

const keyPair = await signal.KeyHelper.generateIdentityKeyPair()
console.log('Pub length:', keyPair.pubKey.byteLength)
