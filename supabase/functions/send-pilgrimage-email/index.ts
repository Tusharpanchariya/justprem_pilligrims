import { serve } from "https://deno.land/std@0.192.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, paymentMethod } = await req.json()

    // Email content based on payment method
    const paymentText = paymentMethod === 'paypal'
      ? 'We have successfully received your €1,900 Early Bird payment via PayPal.'
      : 'We have received your enquiry and your spot is held. Please complete your Wise transfer to finalize your booking.'

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; color: #101012; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #F1EEE7; border: 1px solid rgba(230,220,200,0.4);">
        <h1 style="font-weight: 400; font-size: 28px; text-align: center; margin-bottom: 30px; color: #101012;">Heart of the Himalayas</h1>
        <p style="font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.6; color: #333;">Dear ${name},</p>
        <p style="font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.6; color: #333;">Thank you for joining us on this sacred journey. ${paymentText}</p>
        <p style="font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.6; color: #333;">We are thrilled to welcome you to the Heart of the Himalayas pilgrimage (11 Nights / 12 Days). We will be in touch shortly with further preparation details and your complete itinerary.</p>
        <br/>
        <p style="font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.6; color: #333;">With love and light,<br/><strong>The Just Prem Team</strong></p>
      </div>
    `

    // Use Resend to send the email
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('SMTP_FROM_EMAIL') || 'orders@justprem.shop'
    const adminEmail = 'connect@justprem.shop'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `Just Prem <${fromEmail}>`,
        to: email, // Send to the user
        bcc: adminEmail, // Admin also receives a copy
        subject: "Welcome to the Heart of the Himalayas Pilgrimage",
        html: htmlContent
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email via Resend')
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully", data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})
