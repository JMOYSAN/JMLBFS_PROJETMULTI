// src/services/crypto/storage.js
import fs from 'fs'
import path from 'path'
import os from 'os'

const baseDir = path.join(os.homedir(), '.jmlbfs_e2ee')
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true })
const file = path.join(baseDir, 'signal_store.json')

let cache = {}
if (fs.existsSync(file)) {
  try {
    cache = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    cache = {}
  }
}

function save() {
  fs.writeFileSync(file, JSON.stringify(cache, null, 2))
}

export const store = {
  getIdentityKeyPair: async () => cache.identityKeyPair,
  getLocalRegistrationId: async () => cache.registrationId,
  put: async (key, value) => {
    cache[key] = Buffer.from(value).toString('base64')
    save()
  },
  get: async (key) => {
    const val = cache[key]
    return val ? Buffer.from(val, 'base64') : undefined
  },
  remove: async (key) => {
    delete cache[key]
    save()
  },
  setIdentity: async (identityKeyPair, registrationId) => {
    cache.identityKeyPair = {
      pubKey: Buffer.from(identityKeyPair.pubKey).toString('base64'),
      privKey: Buffer.from(identityKeyPair.privKey).toString('base64'),
    }
    cache.registrationId = registrationId
    save()
  },
}
