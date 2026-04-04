// src/lib/boss-client.ts

import { getBossToken } from "./boss-auth.ts"

export async function fetchProductsFromBoss() {

  const token = await getBossToken()

  const res = await fetch("https://dev-1.boss-sws.com:50100/api/Product?StartPoint=0&MaxResults=10", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}

// src/lib/boss-client.ts

export async function fetchStockForProduct(productId: number) {

  const token = await getBossToken()

  const endpoint =
    `${process.env.BOSS_API_URL}/api/ProductBranch?ProductUniqueId=${productId}`

  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {

    console.error("stock fetch failed", res.status)

    console.error(await res.text())

    throw new Error("stock fetch failed")
  }

  return res.json()
}

export async function findCustomerByEmail(email: string){}
export async function createCustomer(){}
export async function createOrder(){}