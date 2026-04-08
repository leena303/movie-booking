const bcrypt = require("bcryptjs");

(async () => {
  const password = "123456"; // password ní đang nhập
  const hash = "$2b$10$HdFGelLAp1hbICaKk.6Yf.xtOLEQCvUDx.y2f46F041Tg9USXFl.6"; // hash trong DB

  const result = await bcrypt.compare(password, hash);

  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("Match:", result);
})();