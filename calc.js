const getRandomPort = (min, max) => {
  const port = Math.round(Math.random() * (max - min) + min);

  return {
    port: port,
    p1: parseInt(port / 256, 10),
    p2: port % 256,
  };
};

console.log(getRandomPort(5000, 10000));
