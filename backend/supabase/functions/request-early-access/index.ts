// supabase/functions/create-user-data/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.6";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { requestEarlyAccessData } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const snakeCaseEarlyAccessData = {
      email: requestEarlyAccessData.email,
      first_name: requestEarlyAccessData.firstName,
      last_name: requestEarlyAccessData.lastName,
      phone: requestEarlyAccessData.phone,
      company: requestEarlyAccessData.company,
      account_type: requestEarlyAccessData.accountType,
    }
    // Insert into early_access
    const { error: earlyAccessError } = await supabaseAdmin
      .from("early_access")
      .insert(snakeCaseEarlyAccessData);

    if (earlyAccessError) {
      return new Response(JSON.stringify({ error: earlyAccessError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } 
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
