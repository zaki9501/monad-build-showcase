
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UrlVerificationStatus {
  url: string;
  isVerified: boolean;
  isSafe: boolean;
  lastChecked: string;
  status: 'checking' | 'safe' | 'unsafe' | 'unknown';
  riskLevel?: 'low' | 'medium' | 'high' | 'unknown';
  reason?: string;
  securityChecks?: {
    basicSafety: boolean;
    domainReputation: boolean;
    contentAnalysis: boolean;
    certificateValid: boolean;
    googleSafeBrowsing?: boolean;
  };
}

export const useUrlVerification = (url: string | null | undefined) => {
  const [verificationStatus, setVerificationStatus] = useState<UrlVerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const isDev = (import.meta as any)?.env?.DEV === true;
  const debugLog = (...args: unknown[]) => { if (isDev) console.log(...args); };
  const debugError = (...args: unknown[]) => { if (isDev) console.error(...args); };

  useEffect(() => {
    if (!url || !url.trim()) {
      setVerificationStatus(null);
      return;
    }

    const checkUrlSafety = async () => {
      setLoading(true);
      
      try {
        // Single query without projecting missing columns to avoid 400s on prod
        const { data: cached, error: cachedError } = await supabase
          .from('url_verifications')
          .select('*')
          .eq('url', url)
          .maybeSingle();
        if (cachedError) {
          debugError('Cache lookup error:', cachedError);
        }

        if (cached) {
          // Check if cache is still valid (12 hours for more frequent updates)
          const lastChecked = new Date(cached.last_checked);
          const now = new Date();
          const hoursDiff = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 12) {
            debugLog(`Using cached verification for ${url}:`, {
              isSafe: cached.is_safe,
              riskLevel: cached.risk_level || 'unknown',
              reason: cached.reason,
              googleSafeBrowsing: cached.security_checks?.googleSafeBrowsing !== false
            });

            setVerificationStatus({
              url: cached.url,
              isVerified: cached.is_verified,
              isSafe: cached.is_safe,
              lastChecked: cached.last_checked,
              status: cached.is_safe ? 'safe' : 'unsafe',
              riskLevel: (cached.risk_level as 'low' | 'medium' | 'high' | 'unknown') || 'unknown',
              reason: cached.reason || undefined,
              securityChecks: cached.security_checks || undefined
            });
            setLoading(false);
            return;
          }
        }

        // If no cache or cache expired, check with enhanced verification service including Google Safe Browsing
        setVerificationStatus(prev => prev ? { ...prev, status: 'checking' } : {
          url,
          isVerified: false,
          isSafe: false,
          lastChecked: new Date().toISOString(),
          status: 'checking'
        });
        
        debugLog(`Starting enhanced verification with Google Safe Browsing for: ${url}`);

        const { data, error } = await supabase.functions.invoke('verify-url', {
          body: { url }
        });

        if (error) {
          debugError('Verification service error:', error);
          throw error;
        }

        debugLog(`Enhanced verification with Google Safe Browsing completed for ${url}:`, data);

        const status: UrlVerificationStatus = {
          url,
          isVerified: data.isVerified,
          isSafe: data.isSafe,
          lastChecked: new Date().toISOString(),
          status: data.isSafe ? 'safe' : 'unsafe',
          riskLevel: data.riskLevel,
          reason: data.reason,
          securityChecks: data.checks
        };

        setVerificationStatus(status);
      } catch (error) {
        debugError('URL verification failed:', error);
        setVerificationStatus({
          url,
          isVerified: false,
          isSafe: false,
          lastChecked: new Date().toISOString(),
          status: 'unknown',
          riskLevel: 'unknown',
          reason: 'Verification service unavailable'
        });
      } finally {
        setLoading(false);
      }
    };

    checkUrlSafety();
  }, [url]);

  return { verificationStatus, loading };
};
