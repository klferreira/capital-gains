const calculateWeightedAvgStockPrice = ({
  stocksOwnedAmount,
  currentAvgStockPrice,
  acquiredStocksAmount,
  acquiredStockPrice
}) => Math.ceil(
  ((stocksOwnedAmount * currentAvgStockPrice) +
    (acquiredStocksAmount * acquiredStockPrice)) / (stocksOwnedAmount + acquiredStocksAmount)
)

const calculateProfit = (operation, avgStockPrice) => 
  operation.quantity * (operation.unitCost - avgStockPrice);

const calculateTax = (operation, loss, avgStockPrice) => {
  const profit = calculateProfit(operation, avgStockPrice);
  const operationAmount = operation.quantity * operation.unitCost;

  if (profit <= 0 || operationAmount < 2000000) return 0;

  return Math.max(0, (profit + loss) * .2);
}

const processBuyOperation = (state, operation) => {
  const avgStockPrice = calculateWeightedAvgStockPrice({
    stocksOwnedAmount: state.stocksOwned,
    currentAvgStockPrice: state.avgStockPrice,
    acquiredStockPrice: operation.unitCost,
    acquiredStocksAmount: operation.quantity,
  });

  return {
    ...state,
    avgStockPrice,
    taxes: [...state.taxes, { tax: 0 }],
    stocksOwned: state.stocksOwned + operation.quantity,
  }
}

const processSellOperation = (state, operation) => {
  const profit = calculateProfit(operation, state.avgStockPrice);

  return {
    ...state,
    loss: Math.min(profit + state.loss, 0),
    stocksOwned: state.stocksOwned - operation.quantity,
    taxes: [...state.taxes, { tax: calculateTax(operation, state.loss, state.avgStockPrice) }]
  }
}

const processOperation = (state, operation) => (operation.type === "buy")
  ? processBuyOperation(state, operation)
  : processSellOperation(state, operation);

const calculateOperationTaxes = (operations) => {
  const initialState = { avgStockPrice: 0, stocksOwned: 0, taxes: [], loss: 0 };
  return operations.reduce(processOperation, initialState).taxes;
};

module.exports = { calculateOperationTaxes }