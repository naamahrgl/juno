import type { APIRoute } from "astro"

import { z } from "zod"

import { loadCartFromCookies }
  from "~/features/cart/cart.server"

import {
  fetchStockForProduct
} from "~/lib/boss-client"


/*
request body schema
מונע unknown
*/

const checkoutSchema = z.object({

  email:
    z.string().email(),

  phone:
    z.string().min(5),

  name:
    z.string().min(2),

  address:
    z.string().min(3)
})



type BossStockResponse = {

  Results?: {

    ProductInfo?: {
      UniqueId: number
    }

    BranchInfo?: {

      UniqueId: number

      StorageAmounts?: {

        Current?: number
      }
    }

  }[]
}



export const POST: APIRoute =
async ({ cookies, request }) => {

  /*
  cart
  */

  const cart =
    await loadCartFromCookies(cookies)



  /*
  parse body safely
  */

  const body =
    checkoutSchema.parse(
      await request.json()
    )



  /*
  stock validation
  */

  for (const item of cart.items) {

    const productId =
      Number(
        item.productVariant.product.id
      )

    if (
      Number.isNaN(productId)
    ) {

      return new Response(

        JSON.stringify({

          error:
            "invalid product id"
        }),

        { status: 400 }
      )
    }



    const stock =
      await fetchStockForProduct(
        productId
      ) as BossStockResponse



    const available =
      stock.Results?.[0]
        ?.BranchInfo
        ?.StorageAmounts
        ?.Current ?? 0



    if (
      available <
      item.quantity
    ) {

      return new Response(

        JSON.stringify({

          error:
            `not enough stock for ${item.productVariant.product.name}`
        }),

        { status: 400 }
      )
    }
  }



  /*
  TEMP:
  עד שנחבר createOrder אמיתי
  רק מחזירים הצלחה
  */

  return new Response(

    JSON.stringify({

      ok: true
    }),

    { status: 200 }
  )
}