const { calculateOperationTaxes } = require('../tax');

describe('calculateOperationTaxes', () => {
  test('calculates taxes correctly for a profit scenario', () => {
    const operations = [
      { type: "buy", unitCost: 1000, quantity: 10000 },
      { type: "buy", unitCost: 2500, quantity: 5000 },
      { type: "sell", unitCost: 1500, quantity: 10000 },
      { type: "sell", unitCost: 2500, quantity: 5000 }
    ];
    const taxes = calculateOperationTaxes(operations);
    expect(taxes).toEqual([{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 1000000 }]);
  });

  test('calculates taxes correctly for a scenario with losses', () => {
    const operations = [
      { type: "buy", unitCost: 1000, quantity: 10000 },
      { type: "sell", unitCost: 2000, quantity: 5000 },
      { type: "sell", unitCost: 500, quantity: 5000 }
    ];
    const taxes = calculateOperationTaxes(operations);
    expect(taxes).toEqual([{ tax: 0 }, { tax: 1000000 }, { tax: 0 }]);
  });

  test('does not tax small transactions', () => {
    const operations = [
      { type: "buy", unitCost: 1000, quantity: 100 },
      { type: "sell", unitCost: 1500, quantity: 50 },
      { type: "sell", unitCost: 1500, quantity: 50 }
    ];
    const taxes = calculateOperationTaxes(operations);
    expect(taxes).toEqual([{ tax: 0 }, { tax: 0 }, { tax: 0 }]);
  });

  test('does not modify the input operations array', () => {
    const operations = [
      { type: "buy", unitCost: 1000, quantity: 100 },
      { type: "sell", unitCost: 1500, quantity: 50 },
      { type: "sell", unitCost: 1500, quantity: 50 }
    ];
    calculateOperationTaxes(operations);
    expect(operations).toEqual([
      { type: "buy", unitCost: 1000, quantity: 100 },
      { type: "sell", unitCost: 1500, quantity: 50 },
      { type: "sell", unitCost: 1500, quantity: 50 }
    ]);
  });
});
