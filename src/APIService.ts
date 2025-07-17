// API Service Functions

const API_BASE_URL = 'http://localhost:5000';

// Wallet connection
export const connectWallet = async (walletAddress: string) => {
  const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  console.log(response);
  return response.json();
};

export const getConnectedWallet = async () => {
  const response = await fetch(`${API_BASE_URL}/get-wallet`);
  console.log(response);
  if (response.ok) {
    return response.json();
  }
  return null;
};

// Spending plan operations
export const createSpendingPlan = async (planData: {
  amount: number;
  priorities: string[];
  constraints?: Record<string, any>;
  description?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/create-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });
  console.log(response);
  return response.json();
};

export const getSpendingPlans = async () => {
  const response = await fetch(`${API_BASE_URL}/get-plans`);
  console.log(response);
  return response.json();
};

export const getSpendingPlan = async (planId: string) => {
  const response = await fetch(`${API_BASE_URL}/get-plan/${planId}`);
  console.log(response);
  return response.json();
};

export const approveSpendingPlan = async (planId: string) => {
  const response = await fetch(`${API_BASE_URL}/approve-plan/${planId}`, {
    method: 'POST',
  });
  console.log(response);
  return response.json();
};

export const executeSpendingPlan = async (planId: string) => {
  const response = await fetch(`${API_BASE_URL}/execute-plan/${planId}`, {
    method: 'POST',
  });
  console.log(response);
  return response.json();
};

// Transaction operations
export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/get-transactions`);
  console.log(response);
  return response.json();
};

export const getTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_BASE_URL}/get-transaction/${transactionId}`);
  console.log(response);
  return response.json();
};