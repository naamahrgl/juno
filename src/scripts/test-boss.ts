// src/scripts/test-boss.ts

import "dotenv/config"

import { fetchProductsFromBoss } from "../lib/boss-client"

async function testBoss() {

  console.log("fetching boss products...")

  const data = await fetchProductsFromBoss()

  console.log(
    "response preview:",
    JSON.stringify(data, null, 2).slice(0, 500)
  )

}

testBoss()