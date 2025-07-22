
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UrlVerificationStatus {
  url: string;
  isVerified: boolean;
  isSafe: boolean;
  lastChecked: string;
  status: 'checking' | 'safe' | 'unsafe' | 'unknown';
  riskLevel?: 'low' | 'medium' | 'high';
  reason?: string;
  securityChecks?: {
    basicSafety: boolean;
    domainReputation: boolean;
    contentAnalysis: boolean;
    certificateValid: boolean;
  };
}

export const useUrlVerification = (url: string | null | undefined) => {
  const [verificationStatus, setVerificationStatus] = useState<UrlVerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url || !url.trim()) {
      setVerificationStatus(null);
      return;
    }

    const checkUrlSafety = async () => {
      setLoading(true);
      
      try {
        // First check if we have a cached result
        const { data: cached } = await supabase
          .from('url_verifications')
          .select('*')
          .eq('url', url)
          .single();

        if (cached) {
          // Check if cache is still valid (12 hours for more frequent updates)
          const lastChecked = new Date(cached.last_checked);
          const now = new Date();
          const hoursDiff = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 12) {
            console.log(`Using cached verification for ${url}:`, {
              isSafe: cached.is_safe,
              riskLevel: cached.risk_level,
              reason: cached.reason
            });

            setVerificationStatus({
              url: cached.url,
              isVerified: cached.is_verified,
              isSafe: cached.is_safe,
              lastChecked: cached.last_checked,
              status: cached.is_safe ? 'safe' : 'unsafe',
              riskLevel: cached.risk_level || 'unknown',
              reason: cached.reason,
              securityChecks: cached.security_checks
            });
            setLoading(false);
            return;
          }
        }

        // If no cache or cache expired, check with enhanced verification service
        setVerificationStatus(prev => prev ? { ...prev, status: 'checking' } : {
          url,
          isVerified: false,
          isSafe: false,
          lastChecked: new Date().toISOString(),
          status: 'checking'
        });
        
        console.log(`Starting enhanced verification for: ${url}`);

        const { data, error } = await supabase.functions.invoke('verify-url', {
          body: { url }
        });

        if (error) {
          console.error('Verification service error:', error);
          throw error;
        }

        console.log(`Enhanced verification completed for ${url}:`, data);

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
        console.error('URL verification failed:', error);
        setVerificationStatus({
          url,
          isVerified: false,
          isSafe: false,
          lastChecked: new Date().toISOString(),
          status: 'unknown',
          riskLevel: 'high',
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
