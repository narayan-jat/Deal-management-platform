// supabase/functions/send-invite/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.6'
import { Resend } from 'npm:resend';

// ⬇️ Your API key from Resend or your provider
const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const APP_URL = Deno.env.get("APP_URL") || "https://godex.cloud"
const DOMAIN = Deno.env.get("DOMAIN") || "godex.cloud"

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { invites } = await req.json();

  if (!invites || !Array.isArray(invites)) {
    return new Response(JSON.stringify({ message: "Missing or invalid invites" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const failedInvites: any[] = [];
  const successfulInvites: any[] = [];

  for (const invite of invites) {
    const token = crypto.randomUUID();
    const inviteUrl = `${APP_URL}/deals/deal-email-invite/${token}`;

    const { error: emailError } = await resend.emails.send({
      from: `GoDex <noreply@${DOMAIN}>`,
      to: [invite.email],
      subject: "You're invited to collaborate on a deal",
      html: `
        <p>You've been invited to a deal on GoDex as <strong>${invite.role}</strong>.</p>
        <p><a href="${inviteUrl}">Click here to accept the invite</a></p>
        <p>This link is unique and valid for one-time use.</p>
      `
    });

    if (emailError) {
      failedInvites.push({ invite, error: emailError });
      continue;
    }

    const { error: dbError } = await supabaseAdmin.from("invites").insert({
      email: invite.email,
      deal_id: invite.dealId,
      role: invite.role,
      invited_by: invite.invitedBy,
      permissions: invite?.permissions || null,
      token,
      status: "PENDING"
    });

    if (dbError) {
      failedInvites.push({ invite, error: dbError });
      continue;
    }

    successfulInvites.push({ ...invite, token });
  }

  if (failedInvites.length > 0) {
    return new Response(JSON.stringify({
      message: "Some invites failed",
      success: successfulInvites,
      failed: failedInvites
    }), {
      status: 207, // Multi-status
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    message: "All invites sent successfully",
    data: successfulInvites
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

