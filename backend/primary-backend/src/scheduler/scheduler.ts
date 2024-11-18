import prisma from "../db";
const nodemailer = require("nodemailer");

const retry = async (task: any, attempts: number, delay: number) => {
  for (let index = 0; index < attempts; index++) {
    try {
      const res = await task();
      return res
    } catch (error) {
      if (attempts - 1 == index) {
        console.log(error);
      }
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
};

const fetchCurrentPrice = async (prod: any) => {
  try {
    const req = await fetch(`${process.env.SCRAPPER_PORT}`, {
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
    if (req.status == 200) {
      return res;
    }
    throw Error(res.detail);
  } catch (error) {
    throw error;
  }
};

const sendEmail = async (transporter: any, mailOptions: any) => {
  await transporter.sendMail(mailOptions, (err: Error, info: any) => {
    if (err) {
      throw err;
    }
    return;
  });
};

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
      try {
        const res = await retry(() => fetchCurrentPrice(prod), 5, 1000);
        const currentPriceArray: string[] = res.currentPrice
          .slice(1, res.currentPrice.length)
          .split(",");
        let currentPrice = "";
        currentPriceArray.map((x) => (currentPrice += x));
        if (parseInt(currentPrice) < parseInt(prod.price)) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.ADMIN_EMAIL,
              pass: process.env.ADMIN_PASSWORD,
            },
          });
          const mailOptions = {
            from: "producthunter@558gmail.com",
            to: prod.user,
            subject: `Price Dropped for ${prod.name}`,
            text: `🤩🎉It's time! The price has fallen from ${prod.price} to ${currentPrice} - grab it now!`,
          };
          await retry(() => sendEmail(transporter, mailOptions), 5, 1000);
          await retry(
            async () => {
              await prisma.product.update({
                where: {
                  id: prod.id,
                },
                data: {
                  decreasedPrice: currentPrice,
                },
              });
            },
            5,
            1000
          );
        }
      } catch (error) {}
    }
  }
}
