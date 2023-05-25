const authorizer = require("../authorizer");

const createMockTransaction = (attrs = {}) => ({
  amount: 10,
  merchant: "Burger King",
  time: Date.now(),
  ...attrs,
});

const createMockAccount = (attrs = {}) => ({
  active: true,
  availableLimit: 100,
  history: [],
  ...attrs,
});

describe("authorizer", () => {
  it("decrements available limit and updates history when there are no violations", () => {
    const transaction = createMockTransaction();
    const account = createMockAccount();

    expect(authorizer(transaction, account)).toEqual({
      account: {
        ...account,
        availableLimit: account.availableLimit - transaction.amount,
        history: [...account.history, transaction],
      },
      violations: [],
    });
  });

  it("does not change available limit or history when violation is present", () => {
    const transaction = createMockTransaction();
    const account = createMockAccount({ active: false });

    expect(authorizer(transaction, account)).toEqual({
      account,
      violations: ["account-not-active"],
    });
  });

  describe("account-not-active violation", () => {
    it("is present on violations list when account is not active", () => {
      const transaction = createMockTransaction();
      const account = createMockAccount({ active: false });

      expect(authorizer(transaction, account).violations).toContain("account-not-active");
    });

    it("is not present on violations list when account is active", () => {
      const transaction = createMockTransaction();
      const account = createMockAccount({ active: true });

      expect(authorizer(transaction, account).violations).not.toContain("account-not-active");
    });
  });

  describe("first-transaction-above-threshold violation", () => {
    it("is present on violations list when transaction amount exceeds limit and is first transaction", () => {
      const transaction = createMockTransaction({ amount: 1000 });
      const account = createMockAccount({ active: true, availableLimit: 1000, history: [] });
  
      expect(authorizer(transaction, account).violations).toContain("first-transaction-above-threshold")
    });

    it("is not present when transaction amount does not exceed limit", () => {
      const transaction = createMockTransaction({ amount: 1000 });
      const account = createMockAccount({ active: true, availableLimit: 50000, history: [] });

      expect(authorizer(transaction, account).violations).not.toContain("first-transaction-above-threshold");
    });

    it("is not present when transaction is not first", () => {
      const transaction = createMockTransaction({ amount: 1000 });
      const account = createMockAccount({ active: true, availableLimit: 1000, history: [createMockTransaction()] });

      expect(authorizer(transaction, account).violations).not.toContain("first-transaction-above-threshold");
    });
  });

  describe("insufficient-limit violation", () => {
    it("is present when transaction amount exceeds available limit", () => {
      const transaction = createMockTransaction({ amount: 1000 });
      const account = createMockAccount({ availableLimit: 999 });

      expect(authorizer(transaction, account).violations).toContain("insufficient-limit");
    });

    it("is not present when transaction amount is below or equal to available limit", () => {
      const transaction = createMockTransaction({ amount: 1000 });
      const account = createMockAccount({ availableLimit: 1200 });

      expect(authorizer(transaction, account).violations).not.toContain("insufficient-limit");
    });
  });

  describe("high-frequency-small-interval violation", () => {
    it("is present when transaction amount exceeds available limit", () => {
      const transaction = createMockTransaction({ amount: 1000, time: 1683227840764 });
      const account = createMockAccount({
        availableLimit: 5000,
        history: [
          createMockTransaction({ time: transaction.time - 20000 }),
          createMockTransaction({ time: transaction.time - 40000 }),
          createMockTransaction({ time: transaction.time - 119999 }),
        ]
      });

      expect(authorizer(transaction, account).violations).toContain("high-frequency-small-interval");
    })
  })
})