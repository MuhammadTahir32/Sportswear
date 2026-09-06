import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  eventType:
    'order_confirmation' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'low_stock'
  to: string
  subject?: string
  data: Record<string, unknown>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    const { eventType, to, data } = payload
    let subject = payload.subject
    let htmlTemplate = ''

    switch (eventType) {
      case 'order_confirmation':
        subject = subject || `Order Confirmation - #${data.orderId.substring(0, 8).toUpperCase()}`
        htmlTemplate = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <h1 style="color: #0D0D0D;">Thank you for your order!</h1>
            <p>Hi ${data.customerName},</p>
            <p>We've received your order <strong>#${data.orderId.substring(0, 8).toUpperCase()}</strong> and we're getting it ready.</p>
            <p>Total: <strong>$${data.total.toFixed(2)}</strong></p>
            <p>We'll notify you when it ships.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;" />
            <p style="color: #9A9A9A; font-size: 12px;">StrideWear Team</p>
          </div>
        `
        break

      case 'order_shipped':
        subject =
          subject || `Your Order Has Shipped - #${data.orderId.substring(0, 8).toUpperCase()}`
        htmlTemplate = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <h1 style="color: #0D0D0D;">Your order is on the way!</h1>
            <p>Good news! Your order <strong>#${data.orderId.substring(0, 8).toUpperCase()}</strong> has shipped.</p>
            ${data.trackingNumber ? `<p>Tracking Number: <strong>${data.trackingNumber}</strong></p>` : ''}
            <p>Please allow 24-48 hours for tracking information to update.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;" />
            <p style="color: #9A9A9A; font-size: 12px;">StrideWear Team</p>
          </div>
        `
        break

      case 'order_delivered':
        subject =
          subject ||
          `Your Order Has Been Delivered - #${data.orderId.substring(0, 8).toUpperCase()}`
        htmlTemplate = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <h1 style="color: #0D0D0D;">Delivered!</h1>
            <p>Your order <strong>#${data.orderId.substring(0, 8).toUpperCase()}</strong> has been delivered.</p>
            <p>We hope you love your new gear. Don't forget to leave a review!</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;" />
            <p style="color: #9A9A9A; font-size: 12px;">StrideWear Team</p>
          </div>
        `
        break

      case 'order_cancelled':
        subject = subject || `Order Cancelled - #${data.orderId.substring(0, 8).toUpperCase()}`
        htmlTemplate = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <h1 style="color: #0D0D0D;">Order Cancelled</h1>
            <p>Your order <strong>#${data.orderId.substring(0, 8).toUpperCase()}</strong> has been successfully cancelled.</p>
            <p>If you have any questions, please reach out to our support team.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;" />
            <p style="color: #9A9A9A; font-size: 12px;">StrideWear Team</p>
          </div>
        `
        break

      case 'low_stock':
        subject = subject || `Low Stock Alert: ${data.productName}`
        htmlTemplate = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <h1 style="color: #E63946;">Low Stock Alert</h1>
            <p>The following product variant is running low on stock:</p>
            <ul>
              <li><strong>Product:</strong> ${data.productName}</li>
              <li><strong>Variant:</strong> ${data.variantInfo}</li>
              <li><strong>Remaining Stock:</strong> ${data.stockQty}</li>
            </ul>
            <p>Please restock soon to avoid running out.</p>
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;" />
            <p style="color: #9A9A9A; font-size: 12px;">StrideWear System</p>
          </div>
        `
        break

      default:
        throw new Error(`Unknown eventType: ${eventType}`)
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'StrideWear <orders@stridewear.com>',
          to: [to],
          subject,
          html: htmlTemplate,
        }),
      })

      const resData = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(resData))
    } else {
      // Mock mode
      console.log('--- EMAIL MOCKED (NO RESEND_API_KEY) ---')
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log(`HTML Body Length: ${htmlTemplate.length} chars`)
      console.log('------------------------------------------')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent/mocked successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
