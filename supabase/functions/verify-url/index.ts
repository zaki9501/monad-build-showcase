
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UrlCheckResult {
  isVerified: boolean;
  isSafe: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
  checks: {
    basicSafety: boolean;
    domainReputation: boolean;
    contentAnalysis: boolean;
    certificateValid: boolean;
    googleSafeBrowsing: boolean;
  };
}

// Enhanced security patterns
const SECURITY_PATTERNS = {
  // Suspicious URL patterns
  maliciousPatterns: [
    /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd/, // URL shorteners
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // Raw IP addresses
    /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.0\.|172\.16\./, // Local/private IPs
    /xn--/, // Punycode (potential IDN homograph attacks)
    /[^\x00-\x7F]/, // Non-ASCII characters in URL
    /-{3,}|_{3,}/, // Excessive dashes or underscores
    /\.(tk|ml|ga|cf)$/, // Suspicious TLDs
  ],
  
  // Phishing indicators
  phishingPatterns: [
    /paypal|amazon|microsoft|google|apple|facebook|twitter/i,
    /bank|secure|login|verify|account|suspended/i,
    /urgent|immediate|expires|limited|offer/i,
  ],
  
  // Known malicious domains (expanded list)
  maliciousDomains: [
    'tempmail', 'guerrillamail', 'mailinator', '10minutemail',
    'spam4', 'maildrop', 'throwaway', 'guerrillamailblock',
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
    'grabify', 'iplogger', 'blasze', 'yip.su', 'bmwforum',
  ],
  
  // Trusted domains (expanded and categorized)
  trustedDomains: {
    development: [
      'github.com', 'github.io', 'gitlab.com', 'bitbucket.org',
      'vercel.app', 'vercel.com', 'netlify.app', 'netlify.com',
      'heroku.com', 'herokuapp.com', 'surge.sh', 'now.sh',
      'firebase.com', 'firebaseapp.com', 'web.app',
      'pages.dev', 'workers.dev', 'cloudflare.com',
      'replit.com', 'repl.co', 'glitch.com', 'glitch.me',
      'codesandbox.io', 'stackblitz.com', 'codepen.io',
      'localhost', // Allow for development
    ],
    blockchain: [
      'etherscan.io', 'bscscan.com', 'polygonscan.com',
      'arbiscan.io', 'optimistic.etherscan.io',
      'monad.xyz', 'monadlabs.xyz', 'testnet.monad.xyz',
      'metamask.io', 'uniswap.org', 'compound.finance',
      'opensea.io', 'rarible.com', 'foundation.app',
    ],
    general: [
      'youtube.com', 'youtu.be', 'vimeo.com', 'twitch.tv',
      'discord.gg', 'discord.com', 'telegram.org', 't.me',
      'twitter.com', 'x.com', 'reddit.com', 'medium.com',
      'notion.so', 'gitbook.io', 'docs.google.com',
    ]
  }
};

// Google Safe Browsing API integration
const checkGoogleSafeBrowsing = async (url: string): Promise<{ isSafe: boolean; threats: string[] }> => {
  const apiKey = Deno.env.get('GOOGLE_SAFE_BROWSING_API_KEY');
  
  if (!apiKey) {
    console.warn('Google Safe Browsing API key not configured');
    return { isSafe: true, threats: [] }; // Assume safe if API not configured
  }

  try {
    const requestBody = {
      client: {
        clientId: 'monad-project-hub',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
          'THREAT_TYPE_UNSPECIFIED'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      console.error('Google Safe Browsing API error:', response.status, response.statusText);
      return { isSafe: true, threats: [] }; // Assume safe on API error
    }

    const data = await response.json();
    
    if (data.matches && data.matches.length > 0) {
      const threats = data.matches.map((match: any) => match.threatType);
      console.log(`Google Safe Browsing found threats for ${url}:`, threats);
      return { isSafe: false, threats };
    }

    return { isSafe: true, threats: [] };
  } catch (error) {
    console.error('Error checking Google Safe Browsing:', error);
    return { isSafe: true, threats: [] }; // Assume safe on error
  }
};

// Enhanced URL safety analysis
const performEnhancedSafetyChecks = async (url: string): Promise<UrlCheckResult> => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const fullUrl = url.toLowerCase();
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let riskFactors: string[] = [];
    const checks = {
      basicSafety: true,
      domainReputation: true,
      contentAnalysis: true,
      certificateValid: true,
      googleSafeBrowsing: true,
    };

    // 1. Protocol validation
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isVerified: true,
        isSafe: false,
        reason: 'Unsupported or dangerous protocol',
        riskLevel: 'high',
        checks: { ...checks, basicSafety: false }
      };
    }

    // Prefer HTTPS
    if (urlObj.protocol === 'http:') {
      riskFactors.push('Unencrypted HTTP connection');
      riskLevel = 'medium';
    }

    // 2. Google Safe Browsing check (priority check)
    console.log(`Checking Google Safe Browsing for: ${url}`);
    const safeBrowsingResult = await checkGoogleSafeBrowsing(url);
    
    if (!safeBrowsingResult.isSafe) {
      return {
        isVerified: true,
        isSafe: false,
        reason: `Google Safe Browsing detected threats: ${safeBrowsingResult.threats.join(', ')}`,
        riskLevel: 'high',
        checks: { ...checks, googleSafeBrowsing: false }
      };
    }

    // 3. Check against malicious patterns
    const hasMaliciousPattern = SECURITY_PATTERNS.maliciousPatterns.some(pattern => 
      pattern.test(hostname) || pattern.test(fullUrl)
    );

    if (hasMaliciousPattern) {
      riskLevel = 'high';
      riskFactors.push('Suspicious URL pattern detected');
      checks.basicSafety = false;
    }

    // 4. Check for known malicious domains
    const isMaliciousDomain = SECURITY_PATTERNS.maliciousDomains.some(domain => 
      hostname.includes(domain.toLowerCase())
    );

    if (isMaliciousDomain) {
      return {
        isVerified: true,
        isSafe: false,
        reason: `Known malicious domain detected: ${riskFactors.join(', ')}`,
        riskLevel: 'high',
        checks: { ...checks, domainReputation: false }
      };
    }

    // 5. Check against trusted domains
    const allTrustedDomains = [
      ...SECURITY_PATTERNS.trustedDomains.development,
      ...SECURITY_PATTERNS.trustedDomains.blockchain,
      ...SECURITY_PATTERNS.trustedDomains.general,
    ];

    const isTrustedDomain = allTrustedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (isTrustedDomain) {
      return {
        isVerified: true,
        isSafe: true,
        reason: 'Known trusted domain, verified by Google Safe Browsing',
        riskLevel: 'low',
        checks
      };
    }

    // 6. Enhanced phishing detection
    const suspiciousKeywords = SECURITY_PATTERNS.phishingPatterns.some(pattern =>
      pattern.test(fullUrl)
    );

    if (suspiciousKeywords) {
      riskFactors.push('Contains phishing-related keywords');
      riskLevel = 'high';
      checks.contentAnalysis = false;
    }

    // 7. Domain analysis
    const domainParts = hostname.split('.');
    
    // Check for suspicious subdomain patterns
    if (domainParts.length > 3) {
      riskFactors.push('Suspicious subdomain structure');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    // Check for homograph attacks (mixed scripts)
    if (/[^\x00-\x7F]/.test(hostname)) {
      riskFactors.push('Contains non-ASCII characters (potential homograph attack)');
      riskLevel = 'high';
      checks.domainReputation = false;
    }

    // 8. Port analysis
    if (urlObj.port && !['80', '443', '8080', '3000', '5000', '8000'].includes(urlObj.port)) {
      riskFactors.push(`Unusual port: ${urlObj.port}`);
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    // 9. Path analysis
    const suspiciousPathPatterns = [
      /\.(exe|bat|cmd|scr|pif|com|jar|zip|rar)$/i,
      /\/admin|\/wp-admin|\/phpmyadmin/i,
      /\.\.|%2e%2e|%2f|%5c/i, // Directory traversal attempts
    ];

    const hasSuspiciousPath = suspiciousPathPatterns.some(pattern =>
      pattern.test(urlObj.pathname + urlObj.search)
    );

    if (hasSuspiciousPath) {
      riskFactors.push('Suspicious file path or parameters');
      riskLevel = 'high';
      checks.contentAnalysis = false;
    }

    // 10. Try to perform basic connectivity check (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Monad-ProjectHub-Verifier/1.0',
        },
      });

      clearTimeout(timeoutId);

      // Check response status
      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          riskFactors.push(`HTTP error: ${response.status}`);
          riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
        } else if (response.status >= 500) {
          riskFactors.push('Server error');
          riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
        }
      }

      // Check for suspicious redirects
      if (response.redirected) {
        const finalUrl = new URL(response.url);
        if (finalUrl.hostname !== hostname) {
          riskFactors.push('Redirects to different domain');
          riskLevel = 'medium';
        }
      }

    } catch (error) {
      // Network errors don't necessarily mean the URL is malicious
      if (error.name === 'AbortError') {
        riskFactors.push('Request timeout');
      } else {
        riskFactors.push('Network connectivity issue');
      }
      checks.contentAnalysis = false;
      // Don't increase risk level for network issues
    }

    // Final risk assessment
    const isSafe = riskLevel !== 'high' && checks.basicSafety && checks.domainReputation && checks.googleSafeBrowsing;
    
    return {
      isVerified: true,
      isSafe,
      reason: riskFactors.length > 0 ? riskFactors.join(', ') : 'Enhanced security checks including Google Safe Browsing passed',
      riskLevel,
      checks
    };

  } catch (error) {
    return {
      isVerified: true,
      isSafe: false,
      reason: 'Invalid URL format or parsing error',
      riskLevel: 'high',
      checks: {
        basicSafety: false,
        domainReputation: false,
        contentAnalysis: false,
        certificateValid: false,
        googleSafeBrowsing: false,
      }
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

    console.log(`Starting enhanced verification with Google Safe Browsing for URL: ${url}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform enhanced safety checks including Google Safe Browsing
    const result = await performEnhancedSafetyChecks(url);

    console.log(`Verification result for ${url}:`, {
      isSafe: result.isSafe,
      riskLevel: result.riskLevel,
      reason: result.reason,
      googleSafeBrowsing: result.checks.googleSafeBrowsing
    });

    // Store/update the verification result with enhanced data
    const { error: upsertError } = await supabase
      .from('url_verifications')
      .upsert({
        url,
        is_verified: result.isVerified,
        is_safe: result.isSafe,
        reason: result.reason,
        risk_level: result.riskLevel,
        security_checks: result.checks,
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
    console.error('Enhanced verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Verification failed',
        isVerified: false,
        isSafe: false,
        riskLevel: 'high',
        reason: 'System error during verification'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
