import prisma from "../db";

// fetches products in batches of 100 and call the bot forEach to check whether the price decrased
export async function fetchProducts() {
  let cursor: { id: number } | undefined = undefined;
  while (true) {
    const prods = await prisma.product.findMany({
      skip: cursor ? 1 : 0,
      take: 100,
      ...(cursor && { cursor }),
      orderBy: {
        id: "asc",
      },
    });
    const lastProd: any = prods[prods.length - 1];
    cursor = lastProd ? { id: lastProd.id } : undefined;
    if (prods.length == 0) {
      break;
    }
    for (const prod of prods) {
      const req = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: prod.product_url,
          source: prod.source,
        }),
      });
      const res = await req.json();
      const currentPriceArray: string[] = res.currentPrice
        .slice(1, res.currentPrice.length)
        .split(",");
      let currentPrice = "";
      currentPriceArray.map((x) => (currentPrice += x));
      if (parseInt(currentPrice) < parseInt(prod.price)) {
        prisma.product.update({
          where: {
            id: prod.id,
          },
          data: {
            decreasedPrice: currentPrice,
          },
        });
      }
    }
  }
}
