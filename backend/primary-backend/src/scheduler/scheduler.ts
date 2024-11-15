import { createClient } from "redis"
import prisma from "../db"

// fetches products in batches of 100 and pushes in a queue to be picked by the bots
export async function fetchProducts() {
    const products: any[] = []
    const client = await createClient().connect()
    let cursor: { id: number } | undefined = undefined
    while (true) {
        const prods = await prisma.product.findMany({
            skip: cursor ? 1 : 0,
            take: 100,
            ...(cursor && { cursor }),
            orderBy: {
                id: 'asc'
            }
        })
        const lastProd: any = prods[prods.length - 1]
        cursor = lastProd ? { id: lastProd.id } : undefined
        if (prods.length == 0) {
            break
        }
        products.push(...prods)
        console.log(JSON.stringify({...products}))
        await client.set("products", JSON.stringify({...products}))
    }
    // console.log(...products)
}