import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firstName, lastName, email, phone, formType, subscribeNews, message } = body;

    const fullName = (name || `${firstName || ''} ${lastName || ''}`).trim() || 'Visitor';

    const { error } = await supabase.from('Retreat_enquiries').insert({
      name: fullName,
      email: email || '',
      phone: phone || (subscribeNews ? 'Newsletter Subscribed' : ''),
      country: 'Website Connect Form',
      payment_method: formType || message || 'General Enquiry',
    });

    if (error) {
      console.warn('Supabase connect inquiry warning:', error);
    }

    return NextResponse.json({ success: true, message: 'Inquiry received successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: 'Inquiry received successfully' });
  }
}
