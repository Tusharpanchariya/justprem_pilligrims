import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subscribeNews, message } = body;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Visitor';

    const { error } = await supabase.from('Retreat_enquiries').insert({
      name: fullName,
      email: email || '',
      phone: subscribeNews ? 'Newsletter Subscribed' : '',
      country: 'Our Story Connect Form',
      payment_method: message || 'General Enquiry',
    });

    if (error) {
      console.warn('Supabase connect inquiry warning:', error);
    }

    return NextResponse.json({ success: true, message: 'Inquiry received successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: 'Inquiry received successfully' });
  }
}
