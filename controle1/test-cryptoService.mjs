import { CryptoService } from './src/services/crypto/CryptoService.js'

const { identityKeyPair } = await CryptoService.initIdentity()
const preKeys = await CryptoService.generatePreKeys(1, 5)
const signedPreKey = await CryptoService.generateSignedPreKey(
  identityKeyPair,
  1
)

console.log('Generated', preKeys.length, 'prekeys')
