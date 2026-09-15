export type Money = { amountMinor: bigint; currency: "GHS" };

export type FundingRequest = {
  campaignId: string;
  businessUserId: string;
  amount: Money;
  returnUrl?: string;
};

export type PayoutRequest = {
  withdrawalId: string;
  userId: string;
  amount: Money;
  method: "MTN_MOMO" | "TELECEL_CASH" | "AT_MONEY" | "BANK_TRANSFER";
  destination: string;
};

export type ProviderResult = {
  providerReference: string;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";
  redirectUrl?: string;
  raw?: unknown;
};

export interface PaymentProvider {
  createCampaignFunding(input: FundingRequest): Promise<ProviderResult>;
  createPayout(input: PayoutRequest): Promise<ProviderResult>;
  verifyEvent(payload: string, signature?: string | null): Promise<boolean>;
}

export class UnconfiguredPaymentProvider implements PaymentProvider {
  async createCampaignFunding(): Promise<ProviderResult> {
    throw new Error("Payment provider is not configured.");
  }

  async createPayout(): Promise<ProviderResult> {
    throw new Error("Payment provider is not configured.");
  }

  async verifyEvent(): Promise<boolean> {
    return false;
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new UnconfiguredPaymentProvider();
}
