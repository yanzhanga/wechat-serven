export default async function handler(req, res) {
    const TOKEN = "cs1"; // 和公众号后台一致

    // 1. 微信后台验证 URL（GET）
    if (req.method === "GET") {
        const { signature, timestamp, nonce, echostr } = req.query;

        const crypto = await import("crypto");
        const tmpStr = [TOKEN, timestamp, nonce].sort().join("");
        const hash = crypto.createHash("sha1").update(tmpStr).digest("hex");

        if (hash === signature) {
            res.send(echostr); // 返回 echostr 才能通过验证
        } else {
            res.send("error");
        }
        return;
    }

    // 2. 用户发送消息（POST）
    if (req.method === "POST") {
        let xmlData = "";
        req.on("data", chunk => (xmlData += chunk));

        req.on("end", async () => {

            // 🔥 立刻给微信返回空字符串（微信要求）
            res.setHeader("Content-Type", "text/plain");
            res.status(200).send("");

            // 🔥 再把消息转发给 n8n（异步，不阻塞微信）
            const webhookUrl = "https://comely-eugenic-angela.ngrok-free.dev/webhook/wechat";

            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                body: xmlData
            });
        });

        return;
    }

    res.status(405).send("Method Not Allowed");
}
