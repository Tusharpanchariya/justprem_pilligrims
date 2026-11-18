import { createClient } from '@supabase/supabase-js';
import AdminDashboardClient from './AdminDashboardClient';

interface PageProps {
  searchParams: { key?: string };
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedKey = searchParams?.key;

  const isAuthorized = adminSecret && providedKey === adminSecret;

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#101012] flex items-center justify-center px-4">
        <div className="relative text-center border border-[#E6DCC8]/15 bg-[#141416] p-12 max-w-sm w-full">
          <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#E6DCC8]/20" />
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#E6DCC8]/40 mb-6">JustPrem Admin</p>
          <h1 className="font-serif text-3xl font-light text-[#F1EEE7] mb-4">Access Restricted</h1>
          <p className="font-sans text-[12px] font-light text-[#EBE7DE]/50">
            Please provide a valid admin key to access the payments dashboard.
          </p>
          <p className="mt-4 font-mono text-[10px] text-[#EBE7DE]/30">
            /admin/payments?key=YOUR_ADMIN_KEY
          </p>
        </div>
      </main>
    );
  }

  // Fetch data
  const supabase = getAdminClient();
  let bookings: any[] = [];
  let installments: any[] = [];
  let payments: any[] = [];
  let dbError: string | null = null;

  if (supabase) {
    try {
      const { data: b, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (bErr) {
        dbError = bErr.message;
      } else {
        bookings = b || [];
      }

      if (bookings.length > 0) {
        const bookingIds = bookings.map((item: any) => item.id);
        
        const { data: plans } = await supabase
          .from('payment_plans')
          .select('*')
          .in('booking_id', bookingIds);

        if (plans && plans.length > 0) {
          const planIds = plans.map((p: any) => p.id);
          const { data: inst } = await supabase
            .from('installments')
            .select('*')
            .in('payment_plan_id', planIds)
            .order('installment_number', { ascending: true });
          installments = inst || [];
        }

        const { data: pay } = await supabase
          .from('payments')
          .select('*')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: false });
        payments = pay || [];
      }
    } catch (err: any) {
      dbError = err?.message || 'Database connection failed';
    }
  } else {
    dbError = 'Supabase not configured';
  }

  return (
    <AdminDashboardClient
      initialBookings={bookings}
      initialInstallments={installments}
      initialPayments={payments}
      dbError={dbError}
      adminKey={providedKey || ''}
    />
  );
}

