
import React from 'react';
import { Shield, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUrlVerification } from '@/hooks/useUrlVerification';
import { cn } from '@/lib/utils';

interface UrlVerificationBadgeProps {
  url: string | null | undefined;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UrlVerificationBadge = ({ url, className, size = 'sm' }: UrlVerificationBadgeProps) => {
  const { verificationStatus, loading } = useUrlVerification(url);

  if (!url || !url.trim()) return null;

  const getStatusConfig = () => {
    if (loading || verificationStatus?.status === 'checking') {
      return {
        icon: Clock,
        label: 'Checking...',
        variant: 'secondary' as const,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200'
      };
    }

    switch (verificationStatus?.status) {
      case 'safe':
        return {
          icon: ShieldCheck,
          label: 'Verified Safe',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'unsafe':
        return {
          icon: ShieldX,
          label: 'Potentially Unsafe',
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: Shield,
          label: 'Not Verified',
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const iconSize = size === 'lg' ? 'h-4 w-4' : size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

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
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{config.label}</p>
            {verificationStatus && (
              <p className="text-xs text-muted-foreground mt-1">
                Last checked: {new Date(verificationStatus.lastChecked).toLocaleDateString()}
              </p>
            )}
            {verificationStatus?.status === 'unsafe' && (
              <p className="text-xs text-red-600 mt-1">
                This URL may contain harmful content. Proceed with caution.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UrlVerificationBadge;
