// src/lib/boss-client.ts

import { getBossToken } from "./boss-auth.ts"

export async function fetchProductsFromBoss() {

  const token = await getBossToken()

  const res = await fetch("https://dev-1.boss-sws.com:50100/api/Product?StartPoint=0&MaxResults=10&TimeStampMin=1721297542&TimeStampMax=", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}