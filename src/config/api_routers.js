  import config from "@/config/config";

const apiRouters = {
  router: {
    sign_in: "/api/signin",
    ws_ssh: "/ws/ssh",
    ws_sftp: "/ws/sftp",
    sftp_dl: "/api/sftp/dl",
    sftp_ls: "/api/sftp/ls",
    sftp_upload: "/api/sftp/upload"
  },
  params: {
    ws_ssh: "cols={{0}}&rows={{1}}&idx={{2}}",
    ws_sftp: config.jwt.tokenName + "={{0}}",
    sftp_dl: config.jwt.tokenName + "={{0}}&cid={{1}}&path={{2}}",
    sftp_ls:
      config.jwt.tokenName + "={{0}}&cid={{1}}&dir_only={{2}}&path={{3}}",
    sftp_upload: config.jwt.tokenName + "={{0}}&cid={{1}}&path={{2}}"
  },
  CID: "cid"
};

export default apiRouters;
