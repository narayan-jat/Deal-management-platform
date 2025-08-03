// supabase/functions/create-user-data/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.6";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Utility function to get unique code for organization
export const getUniqueOrgCode = async (supabaseAdmin: any): Promise<string | null> => {
  try {
    const code = Math.random().toString(36).substring(2, 8);

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("code", code)
      .maybeSingle(); // ✅ more efficient than .single() when zero matches are expected

    if (error) {
      console.error("Error checking organization code uniqueness:", error.message);
      return null;
    }

    if (data) {
      // Org with this code exists — try again
      return getUniqueOrgCode(supabaseAdmin);
    }

    // Code is unique
    return code;
  } catch (err) {
    console.error("Unexpected error generating org code:", err);
    return null;
  }
};


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, profileData, organizationData } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const snakeCaseProfileData = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      location: profileData.location,
    }
    // Insert into profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update(snakeCaseProfileData)
      .eq("id", userId);

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let role = 'MEMBER';
    let orgId = null;

    // Insert into organizations
    if (organizationData.type === "create") {
      role = 'LEADER';
      const snakeCaseOrganizationData = {
        name: organizationData.name,
        code: await getUniqueOrgCode(supabaseAdmin),
        created_by: userId,
      }
      const { data: org, error: orgError } = await supabaseAdmin
        .from("organizations")
        .insert(snakeCaseOrganizationData)
        .select()
        .single();

      if (orgError) {
        return new Response(JSON.stringify({ error: orgError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      orgId = org.id;
    }

    if (!orgId) {
      // Get organization by code
      const { data: org, error: orgError } = await supabaseAdmin
        .from("organizations")
        .select("*")
        .eq("code", organizationData.code)
        .single();

      if (orgError) {
        return new Response(JSON.stringify({ error: orgError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      orgId = org.id;
    }

    // Insert into organization_members
    const { error: memberError } = await supabaseAdmin
      .from("organization_members")
      .insert([{ organization_id: orgId, member_id: userId, role: role }]);

    if (memberError) {
      return new Response(JSON.stringify({ error: memberError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
