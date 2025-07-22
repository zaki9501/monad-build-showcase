
import React from 'react';
import { Shield, ShieldCheck, ShieldX, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUrlVerification } from '@/hooks/useUrlVerification';
import { cn } from '@/lib/utils';

interface UrlVerificationBadgeProps {
  url: string | null | undefined;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const UrlVerificationBadge = ({ 
  url, 
  className, 
  size = 'sm', 
  showDetails = false 
}: UrlVerificationBadgeProps) => {
  const { verificationStatus, loading } = useUrlVerification(url);

  if (!url || !url.trim()) return null;

  const getStatusConfig = () => {
    if (loading || verificationStatus?.status === 'checking') {
      return {
        icon: Clock,
        label: 'Verifying...',
        variant: 'secondary' as const,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        description: 'Running enhanced security checks including Google Safe Browsing...'
      };
    }

    const riskLevel = verificationStatus?.riskLevel;
    
    switch (verificationStatus?.status) {
      case 'safe':
        if (riskLevel === 'medium') {
          return {
            icon: ShieldAlert,
            label: 'Verified - Caution',
            variant: 'outline' as const,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 border-orange-200',
            description: 'Verified but has some risk factors. Proceed with caution.'
          };
        }
        return {
          icon: ShieldCheck,
          label: 'Google Verified',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          description: 'Passed all security checks including Google Safe Browsing. Safe to visit.'
        };
      case 'unsafe':
        return {
          icon: riskLevel === 'high' ? ShieldX : AlertTriangle,
          label: riskLevel === 'high' ? 'High Risk' : 'Potentially Unsafe',
          variant: 'destructive' as const,
          color: riskLevel === 'high' ? 'text-red-600' : 'text-orange-600',
          bgColor: riskLevel === 'high' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200',
          description: riskLevel === 'high' 
            ? 'High risk detected by security analysis. Avoid visiting this URL.'
            : 'Some security concerns detected. Exercise caution.'
        };
      default:
        return {
          icon: Shield,
          label: 'Not Verified',
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          description: 'Unable to verify URL safety. Check manually before visiting.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const iconSize = size === 'lg' ? 'h-4 w-4' : size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

  const renderSecurityChecks = () => {
    if (!verificationStatus?.securityChecks) return null;
    
    const checks = verificationStatus.securityChecks;
    const checkItems = [
      { key: 'basicSafety', label: 'Basic Safety', passed: checks.basicSafety },
      { key: 'domainReputation', label: 'Domain Reputation', passed: checks.domainReputation },
      { key: 'contentAnalysis', label: 'Content Analysis', passed: checks.contentAnalysis },
      { key: 'certificateValid', label: 'Certificate Valid', passed: checks.certificateValid },
      { key: 'googleSafeBrowsing', label: 'Google Safe Browsing', passed: checks.googleSafeBrowsing !== false },
    ];

    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Security Checks:</p>
        {checkItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-xs">
            <div className={cn(
              "w-2 h-2 rounded-full",
              item.passed ? "bg-green-500" : "bg-red-500"
            )} />
            <span className={item.passed ? "text-green-600" : "text-red-600"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={config.variant}
            className={cn(
              'flex items-center gap-1 cursor-help transition-all duration-200',
              config.bgColor,
              className
            )}
          >
            <Icon className={cn(iconSize, config.color)} />
            <span className={textSize}>{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="text-sm space-y-2">
            <div>
              <p className="font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
            
            {verificationStatus?.reason && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Details:</p>
                <p className="text-xs">{verificationStatus.reason}</p>
              </div>
            )}
            
            {verificationStatus?.riskLevel && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Risk Level:</p>
                <p className={cn(
                  "text-xs font-medium capitalize",
                  verificationStatus.riskLevel === 'high' ? 'text-red-600' :
                  verificationStatus.riskLevel === 'medium' ? 'text-orange-600' :
                  'text-green-600'
                )}>
                  {verificationStatus.riskLevel}
                </p>
              </div>
            )}
            
            {showDetails && renderSecurityChecks()}
            
            {verificationStatus && (
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {new Date(verificationStatus.lastChecked).toLocaleString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UrlVerificationBadge;
