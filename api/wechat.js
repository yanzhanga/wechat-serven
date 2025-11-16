export default async function handler(req, res) {
  const TOKEN = "cs1";

  // 1. 验证服务器的 GET（保持不变）
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

  // 2. 收到用户消息时的 POST —— 临时最简版
  if (req.method === "POST") {
    // 不转发，不解析，直接告诉微信“成功”
    res.send("success");
    return;
  }

  res.status(405).send("Method Not Allowed");
}
