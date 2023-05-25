const readline = require('readline');

const Tax = require("./tax");

const parseOperationData = ({ operation, "unit-cost": unitCost, quantity }) => ({
  type: operation,
  unitCost: unitCost * 100,
  quantity,
});

const processLine = (line) => {
  const operations = JSON.parse(line).map(parseOperationData);
  const taxes = Tax.calculateOperationTaxes(operations);
  const output = taxes.map(t => ({ "tax": (t.tax / 100).toFixed(2) }));
  console.log(JSON.stringify(output));
};

(() => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  let lines = [];
  rl.on("line", (line) => {
    if (line == "") {
      rl.close();
      lines.map(processLine);
    }

    lines.push(line)
  });
})();
