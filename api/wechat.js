export default async function handler(req, res) {
  const TOKEN = "cs1"; // 改成你的 Token

  // 1. 微信验证服务器时的 GET 请求
  if (req.method === "GET") {
    const { signature, timestamp, nonce, echostr } = req.query;

    const crypto = await import("crypto");
    const tmpStr = [TOKEN, timestamp, nonce].sort().join("");
    const hash = crypto.createHash("sha1").update(tmpStr).digest("hex");

    if (hash === signature) {
      res.send(echostr);
    } else {
      res.send("error");
    }
    return;
  }

  // 2. 微信用户发送消息时的 POST 请求
  if (req.method === "POST") {
    let xmlData = "";
    req.on("data", chunk => (xmlData += chunk));
    req.on("end", async () => {
      // 转发到 n8n Webhook
      const webhookUrl = "https://comely-eugenic-angela.ngrok-free.dev/webhook/wechat"; // ⭐改这里！

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: xmlData
      });

      // 给微信快速返回 200 OK
      res.send("success");
    });

    return;
  }

  res.status(405).send("Method Not Allowed");
}


