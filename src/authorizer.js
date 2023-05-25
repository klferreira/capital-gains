const isAccountActive = (account) => account.active;

const isFirstTransaction = (account) => account.history.length === 0;

const isTransactionWithinLimit = (transaction, limit) => transaction.amount <= limit;

const exceedsTransactionFrequency = (transaction, history, interval, frequency) => {
  const transactionsWithinInterval = history.filter(t => t.time >= transaction.time - interval);
  return transactionsWithinInterval.length === frequency;
}

const authorizer = (transaction, account) => {
  const violations = [];

  if (!isAccountActive(account)) {
    violations.push("account-not-active");
  }

  if (!isTransactionWithinLimit(transaction, account.availableLimit)) {
    violations.push("insufficient-limit");
  }

  if (isFirstTransaction(account) && !isTransactionWithinLimit(transaction, account.availableLimit * .9)) {
    violations.push("first-transaction-above-threshold");
  }

  if (exceedsTransactionFrequency(transaction, account.history, 120000, 3)) {
    violations.push("high-frequency-small-interval");
  }

  const hasViolation = violations.length > 0;

  return {
    account: {
      ...account,
      availableLimit: hasViolation
        ? account.availableLimit 
        : account.availableLimit - transaction.amount,
      history: hasViolation
        ? account.history
        : [...account.history, transaction] ,
    },
    violations,
  }
}

module.exports = authorizer;