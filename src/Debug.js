module.exports = (message, ...arg) => {
  if (process.env.DEBUG !== "1") return;

  console.log(message, ...arg);
};
