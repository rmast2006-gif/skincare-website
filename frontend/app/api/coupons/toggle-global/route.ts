import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { couponSettings: { globalEnabled: false } }
  }
}

function writeRawStore(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function PATCH() {
  try {
    const store = readRawStore()
    if (!store.couponSettings) store.couponSettings = { globalEnabled: false }
    store.couponSettings.globalEnabled = !store.couponSettings.globalEnabled
    writeRawStore(store)
    return NextResponse.json({ globalEnabled: store.couponSettings.globalEnabled })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
  }
}