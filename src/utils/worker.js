async function run(digit, outputResult) {
  let i = 1n;
  let x = 3n * 10n ** (BigInt(digit) + 20n);
  let pi = x;
  const startTime = performance.now();
  while (x > 0) {
    for (let j = 0; j < 100; ++j) {
      x = (x * i) / ((i + 1n) * 4n);
      if (outputResult) pi += x / (i + 2n);
      i += 2n;
    }
  }

  const endTime = performance.now();
  const spend = ((endTime - startTime) / 1000).toFixed(3) + ' s';
  const digits = outputResult ? (pi / 10n ** 20n).toString(10) : null;
  return {
    digit,
    digits,
    spend,
  };
}
self.onmessage = (e) => {
  run(e.data.digit, e.data.outputResult).then((data) => {
    self.postMessage(data);
  });
};
