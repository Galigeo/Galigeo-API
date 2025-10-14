require('dotenv').config();
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: 21,
  localRoot: __dirname + "/doc",
  remoteRoot: process.env.FTP_REMOTE_ROOT,
  include: ["*", "**/*"],
  deleteRemote: false,
  forcePasv: true
};

ftpDeploy.deploy(config)
  .then(res => {
    console.log("Deploy finished:", res);
  })
  .catch(err => {
    console.error("Deploy error:", err);
    process.exit(1);
  });
