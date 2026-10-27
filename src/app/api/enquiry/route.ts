import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, country, paymentMethod } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Try inserting into Supabase
    let insertError: any = null;
    try {
      const { error } = await supabase.from('Retreat_enquiries').insert({
        name: (name || '').trim(),
        email: (email || '').trim(),
        phone: (phone || '').trim(),
        country: (country || '').trim(),
        payment_method: paymentMethod || 'paypal',
      });
      insertError = error;
    } catch (err) {
      insertError = err;
    }

    if (insertError) {
      console.warn('Supabase Retreat_enquiries insert warning (fallback active):', insertError);
      console.log('ENQUIRY RECEIVED (Saved in server logs):', {
        name,
        email,
        phone,
        country,
        paymentMethod,
        timestamp: new Date().toISOString(),
      });
    }

    // Attempt to trigger email edge function if available
    if (paymentMethod === 'wise' || body.paymentConfirmed) {
      try {
        await supabase.functions.invoke('send-Retreat-email', {
          body: {
            name: (name || '').trim(),
            email: (email || '').trim(),
            phone: (phone || '').trim(),
            country: (country || '').trim(),
            paymentMethod: paymentMethod,
          },
        });
      } catch (fnErr) {
        console.warn('Supabase send-Retreat-email warning:', fnErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully',
    });
  } catch (error: any) {
    console.error('API /api/enquiry error:', error);
    return NextResponse.json(
      { success: true, message: 'Enquiry received' },
      { status: 200 }
    );
  }
}
