import "dotenv/config"

import { fetchProductsFromBoss, fetchStockForProduct }
  from "../lib/boss-client"

import { supabase }
  from "../lib/supabase"

type BossStockRow = {

  UniqueId: number

  Active: boolean

  ProductInfo?: {

    UniqueId: number
  }

  BranchInfo?: {

    UniqueId: number

    Name?: string

    StorageAmounts?: {

      Current?: number

      Min?: number

      Max?: number
    }
  }
}

type BossStockResponse = {

  Results?: BossStockRow[]
}


  type BossPrice = {

  VatExc: number

  VatInc: number

  TableHandle?: {
    Index: number
  }
}

type BossProduct = {

  UniqueId: number

  Name?: string
CostVatExc?: number
  Price?: BossPrice[]
Active?:boolean
ImageURL?:string
}

type BossProductsResponse = {

  Results?: BossProduct[]
}

async function syncBossProducts() {

  const data =
    await fetchProductsFromBoss() as BossProductsResponse

  const products =
    data.Results ?? []

  console.log(
    `found ${products.length} products in BOSS`
  )

  for (const product of products) {

    const row = {

      id: product.UniqueId,

      name: product.Name ?? null,
      CostVatExc: product.CostVatExc,
active: product.Active,
      price: product.Price ?? null,
      image_url:product.ImageURL
    }

    const { error } =
      await supabase
        .from("products")
        .upsert(row, {
          onConflict: "id"
        })

    if (error) {

      console.error(
        "failed saving",
        product.UniqueId,
        error.message
      )

      continue
    }

    console.log(
      "synced product",
      product.UniqueId
    )

const stock =
  await fetchStockForProduct(
    product.UniqueId
  ) as BossStockResponse

const stockRows =
  stock.Results ?? []

for (const s of stockRows) {

  await supabase
    .from("stock")
    .upsert({

      product_id:
 s.ProductInfo
      ?.UniqueId,
      branch_id:
    s.BranchInfo
      ?.UniqueId,
      quantity:
          s.BranchInfo
      ?.StorageAmounts
      ?.Current ?? 0
    })
}
    
  }

  

  console.log("sync done ✓")
}

syncBossProducts()