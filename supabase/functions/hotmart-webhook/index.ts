import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type, x-hotmart-hottok',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Check for hotmart token in headers or payload to verify the webhook authenticity
    const token = req.headers.get('x-hotmart-hottok') || payload.hottok
    const expectedToken = Deno.env.get('HOTMART_TOKEN')

    if (expectedToken && token !== expectedToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log the event
    const { error: insertError } = await supabase
      .from('hotmart_events')
      .insert([{ payload, received_at: new Date().toISOString() }])

    if (insertError) {
      console.error('Failed to log event:', insertError)
    }

    // Process User Provisioning / Plan update
    const eventType = payload.event
    const email = payload.data?.buyer?.email || payload.email
    const name = payload.data?.buyer?.name || payload.name || email?.split('@')[0] || 'Unknown User'

    if (email) {
      let userId: string | null = null

      // Find existing user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      userId = profile?.id || null

      const isPurchase = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'approved'].includes(eventType)
      const isCancellation = [
        'SUBSCRIPTION_CANCELLATION',
        'SWITCH_PLAN',
        'CANCELED',
        'REFUNDED',
        'CHARGEBACK',
        'canceled',
        'refunded',
      ].includes(eventType)

      if (!userId && isPurchase) {
        // Create new user via Admin API
        const generatedPassword = Math.random().toString(36).slice(-10) + 'A1!'
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: generatedPassword,
          user_metadata: { full_name: name },
          email_confirm: true,
        })

        if (authData?.user) {
          userId = authData.user.id
        } else {
          console.error('Failed to create user:', createError)
        }
      }

      if (userId) {
        let newPlan = null
        if (isPurchase) newPlan = 'premium'
        if (isCancellation) newPlan = 'basic'

        if (newPlan) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ plan: newPlan, updated_at: new Date().toISOString() })
            .eq('id', userId)

          if (updateError) {
            console.error('Failed to update plan:', updateError)
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
