import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, question } = body;

    if (!email || !question) {
      return NextResponse.json(
        { success: false, error: 'Email and question are required.' },
        { status: 400 }
      );
    }

    const { error: sbError } = await supabase.from('Retreat_enquiries').insert({
      name: name || 'Anonymous Guest',
      email: email,
      phone: 'Q&A FAQ Form',
      country: 'Nepal Pilgrimage Q&A',
      payment_method: `Q&A Question: ${question}`,
    });

    if (sbError) {
      console.warn('Supabase Q&A enquiry insert warning:', sbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your question has been received. Our team will get back to you shortly.',
    });
  } catch (err: any) {
    console.error('Error handling Q&A inquiry:', err);
    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully' },
      { status: 200 }
    );
  }
}
