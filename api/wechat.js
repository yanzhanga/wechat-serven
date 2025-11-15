const crypto = require("crypto");

module.exports = async (req, res) => {
  const token = "cs1"; // 必须和公众号后台 Token 一样

  // 1. 微信服务器验证（GET）
  if (req.method === "GET") {
    const { signature, timestamp, nonce, echostr } = req.query || {};

    const str = [token, timestamp, nonce].sort().join("");
    const hash = crypto.createHash("sha1").update(str).digest("hex");

    if (hash === signature) {
      // 验证成功，按要求原样返回 echostr
      res.status(200).send(echostr);
    } else {
      // 验证失败也返回 200，内容随意
      res.status(200).send("error");
    }
    return;
  }

  // 2. 之后真正收消息用 POST，这里先简单返回 success 防止报错
  res.status(200).send("success");
};
