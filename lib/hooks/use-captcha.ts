"use client";

import { useState, useEffect } from 'react';
import { SessionData } from '@/lib/types/deepvue';
import { getCaptcha } from '@/lib/services/deepvue/api';
import { useToast } from '@/components/ui/use-toast';

export function useCaptcha() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeCaptcha = async () => {
      if (sessionData) return; // Don't initialize if we already have session data
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getCaptcha();
        if (mounted) {
          setSessionData(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load captcha');
          toast({
            title: "Error",
            description: "Failed to load captcha. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeCaptcha();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array since we only want to run this once

  const refreshCaptcha = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCaptcha();
      setSessionData(data);
    } catch (err) {
      setError('Failed to refresh captcha');
      toast({
        title: "Error",
        description: "Failed to refresh captcha. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessionData,
    isLoading,
    error,
    refreshCaptcha
  };
}