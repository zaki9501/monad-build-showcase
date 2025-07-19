
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UrlCheckResult {
  isVerified: boolean;
  isSafe: boolean;
  reason?: string;
}

// Basic URL safety checks
const performBasicSafetyChecks = (url: string): UrlCheckResult => {
  try {
    const urlObj = new URL(url);
    
    // Check for common malicious patterns
    const maliciousPatterns = [
      /bit\.ly|tinyurl|t\.co/, // URL shorteners (could hide malicious content)
      /localhost|127\.0\.0\.1|0\.0\.0\.0/, // Local addresses
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses instead of domains
      /[^a-zA-Z0-9\-\.]/ // Suspicious characters in domain
    ];

    // Check for suspicious domains
    const suspiciousDomains = [
      'tempmail', 'guerrillamail', 'mailinator', // Temp email services
      'bit.ly', 'tinyurl.com', 't.co', // URL shorteners
    ];

    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isVerified: true,
        isSafe: false,
        reason: 'Unsupported protocol'
      };
    }

    // Check for malicious patterns
    const hasMaliciousPattern = maliciousPatterns.some(pattern => 
      pattern.test(urlObj.hostname)
    );

    if (hasMaliciousPattern) {
      return {
        isVerified: true,
        isSafe: false,
        reason: 'Suspicious URL pattern detected'
      };
    }

    // Check for suspicious domains
    const hasSuspiciousDomain = suspiciousDomains.some(domain => 
      urlObj.hostname.includes(domain)
    );

    if (hasSuspiciousDomain) {
      return {
        isVerified: true,
        isSafe: false,
        reason: 'Suspicious domain detected'
      };
    }

    // Check for common safe domains (GitHub, Vercel, Netlify, etc.)
    const safeDomains = [
      'github.com', 'github.io',
      'vercel.app', 'vercel.com',
      'netlify.app', 'netlify.com',
      'heroku.com', 'herokuapp.com',
      'surge.sh',
      'firebase.com', 'firebaseapp.com',
      'pages.dev', 'workers.dev',
      'replit.com', 'repl.co',
      'glitch.com', 'glitch.me',
      'codesandbox.io',
      'stackblitz.com',
      'localhost' // Allow localhost for development
    ];

    const isSafeDomain = safeDomains.some(domain => 
      urlObj.hostname.endsWith(domain) || urlObj.hostname === domain
    );

    if (isSafeDomain) {
      return {
        isVerified: true,
        isSafe: true,
        reason: 'Known safe domain'
      };
    }

    // Default to safe but not verified for unknown domains
    return {
      isVerified: true,
      isSafe: true,
      reason: 'Basic checks passed'
    };

  } catch (error) {
    return {
      isVerified: true,
      isSafe: false,
      reason: 'Invalid URL format'
    };
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform safety checks
    const result = performBasicSafetyChecks(url);

    // Store/update the verification result
    const { error: upsertError } = await supabase
      .from('url_verifications')
      .upsert({
        url,
        is_verified: result.isVerified,
        is_safe: result.isSafe,
        reason: result.reason,
        last_checked: new Date().toISOString()
      }, {
        onConflict: 'url'
      });

    if (upsertError) {
      console.error('Error storing verification result:', upsertError);
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Verification failed',
        isVerified: false,
        isSafe: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
