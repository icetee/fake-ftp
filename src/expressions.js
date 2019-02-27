const RE_CMD = /^(.*)(?=\s)(.*)$/;
const RE_PORT = /([\d]{1,3}),([\d]{1,3}),([\d]{1,3}),([\d]{1,3}),([-\d]{1,3}),([-\d]{1,3})/;
const RE_PASV = /([\d]+),([\d]+),([\d]+),([\d]+),([-\d]+),([-\d]+)/;
const RE_RES_END = /(?:^|\r?\n)(\d{3}) [^\r\n]*\r?\n/;

module.exports = {
  RE_CMD,
  RE_PORT,
  RE_PASV,
  RE_RES_END
};
