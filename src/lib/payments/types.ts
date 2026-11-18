export type PlanType = 'full' | 'two_parts' | 'three_parts';

export type PaymentProvider = 'paypal' | 'wise' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type InstallmentStatus =
  | 'paid'
  | 'pending_verification'
  | 'upcoming'
  | 'overdue'
  | 'failed'
  | 'refunded'
  | 'disputed';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancellation_requested'
  | 'cancelled';

export interface Booking {
  id: string;
  booking_reference: string;
  enquiry_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_country: string;
  country_code: string;
  pilgrimage_slug: string;
  pilgrimage_title: string;
  departure_date: string;
  total_price_cents: number;
  currency: string;
  booking_status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlan {
  id: string;
  booking_id: string;
  plan_type: PlanType;
  currency: string;
  total_amount_cents: number;
  initial_payment_cents: number;
  outstanding_amount_cents: number;
  status: 'pending_first_payment' | 'active' | 'completed' | 'overdue' | 'cancelled';
  country_code: string;
  terms_version: string;
  terms_accepted_at: string;
  legal_eligibility_status: string;
  created_at: string;
  updated_at: string;
}

export interface Installment {
  id: string;
  payment_plan_id: string;
  installment_number: number;
  amount_cents: number;
  currency: string;
  due_date: string;
  status: InstallmentStatus;
  paid_at?: string | null;
  payment_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  booking_id: string;
  payment_plan_id: string;
  installment_id?: string | null;
  customer_id: string;
  provider: PaymentProvider;
  provider_transaction_id?: string | null;
  provider_invoice_id?: string | null;
  provider_order_id?: string | null;
  amount_cents: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: string;
  verified_at?: string | null;
  verified_by?: string | null;
  raw_response?: any;
  created_at: string;
}

export interface RefundRecord {
  id: string;
  booking_id: string;
  payment_id?: string | null;
  amount_cents: number;
  currency: string;
  refund_reason: string;
  refund_status: 'pending' | 'completed' | 'rejected';
  provider_refund_reference?: string | null;
  processed_by?: string | null;
  created_at: string;
  processed_at: string;
}

export interface PaymentAuditLog {
  id: string;
  booking_id?: string | null;
  action: string;
  performed_by: string;
  previous_status?: string | null;
  new_status?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CountryPaymentSetting {
  id: string;
  country_code: string;
  country_name: string;
  currency: string;
  payment_plan_enabled: boolean;
  approved_plan_types: PlanType[];
  approved_terms_version: string;
  legal_review_date?: string | null;
  legal_review_reference?: string | null;
  emergency_disabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalculatedInstallment {
  number: number;
  label: string;
  amountCents: number;
  formattedAmount: string;
  dueDate: string;
  formattedDueDate: string;
  isInitial: boolean;
}

export interface CalculatedPlan {
  planType: PlanType;
  title: string;
  subtitle: string;
  totalAmountCents: number;
  formattedTotal: string;
  initialPaymentCents: number;
  formattedInitial: string;
  remainingBalanceCents: number;
  formattedRemaining: string;
  installments: CalculatedInstallment[];
  legallyApproved: boolean;
  disclaimer: string;
}

export interface BookingWithPlanDetails {
  booking: Booking;
  plan: PaymentPlan;
  installments: Installment[];
  payments: PaymentRecord[];
  refunds: RefundRecord[];
  auditLogs: PaymentAuditLog[];
}

