// api/wechat.js

export default async function handler(req, res) {
  const TOKEN = "cs1"; // 和公众号后台配置的 Token 一致

  // 1. 微信服务器第一次配置 / 每次校验时，用 GET
  if (req.method === "GET") {
    const { signature, timestamp, nonce, echostr } = req.query;

    // 没带参数（比如你用浏览器直接访问）就直接报错
    if (!signature) {
      return res.send("missing signature");
    }

    const crypto = await import("crypto");
    const tmpStr = [TOKEN, timestamp, nonce].sort().join("");
    const hash = crypto.createHash("sha1").update(tmpStr).digest("hex");

    if (hash === signature) {
      // 校验通过，返回 echostr 给微信
      return res.send(echostr);
    } else {
      return res.send("error");
    }
  }

  // 2. 用户真正发消息过来时，用 POST（我们现在只打印出来）
  if (req.method === "POST") {
    let xmlData = "";
    req.on("data", (chunk) => {
      xmlData += chunk;
    });

    req.on("end", async () => {
      // ⭐ 关键：把微信推过来的原始 XML 打到 Vercel 日志里
      console.log("WX POST body:", xmlData);

      // 微信只要在 5s 内收到 200 + 任意内容即可
      res.setHeader("Content-Type", "text/plain");
      res.send("success");
    });

    return;
  }

  // 其他方法直接拒绝
  res.status(405).send("Method Not Allowed");
}
