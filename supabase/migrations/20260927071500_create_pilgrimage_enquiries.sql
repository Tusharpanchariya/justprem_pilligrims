/*
# Create pilgrimage_enquiries table

1. Purpose
   Stores enquiry submissions from visitors who apply for the
   "Heart of the Himalayas" pilgrimage. Each row captures the
   visitor's basic contact details and preferred payment method.

2. New Table: pilgrimage_enquiries
   - id            (uuid, primary key)
   - name          (text, not null) — full name of the applicant
   - email         (text, not null) — contact email
   - phone         (text, not null) — phone number with optional country code
   - country       (text, not null) — country of residence
   - payment_method(text, not null, default 'paypal') — preferred payment: 'paypal' or 'wise'
   - status        (text, not null, default 'pending') — enquiry workflow status
   - created_at    (timestamptz, default now())

3. Security
   - Enable RLS on pilgrimage_enquiries.
   - This is a no-auth landing page: the anon-key frontend submits enquiries.
     Allow anon + authenticated to INSERT so visitors can apply without signing in.
   - Do NOT allow anon SELECT/UPDATE/DELETE — enquiry data is private to operators.
     Only authenticated operators (Supabase dashboard / service role) can read/manage rows.
*/

CREATE TABLE IF NOT EXISTS pilgrimage_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text NOT NULL,
  payment_method text NOT NULL DEFAULT 'paypal',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pilgrimage_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON pilgrimage_enquiries;
CREATE POLICY "anon_insert_enquiries"
ON pilgrimage_enquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);
