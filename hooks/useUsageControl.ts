import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UsageData {
  count: number;
  limit: number;
  tier: 'free' | 'premium';
  lastReset: number;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}

export interface UsageLimits {
  free: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  premium: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

const USAGE_LIMITS: UsageLimits = {
  free: {
    daily: 5,
    weekly: 20,
    monthly: 50
  },
  premium: {
    daily: 100,
    weekly: 500,
    monthly: 2000
  }
};

const STORAGE_KEYS = {
  USAGE_DATA: 'floramind_usage_data',
  PREMIUM_STATUS: 'floramind_premium_status',
  LAST_RESET: 'floramind_last_reset'
};

export const useUsageControl = () => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize usage data
  useEffect(() => {
    initializeUsageData();
  }, []);

  const initializeUsageData = async () => {
    try {
      setIsLoading(true);
      
      // Check if we need to reset daily limits
      const lastReset = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      const shouldReset = !lastReset || (now - parseInt(lastReset)) > oneDay;
      
      if (shouldReset) {
        await resetDailyUsage();
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET, now.toString());
      }

      // Load usage data
      const storedUsage = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_DATA);
      const isPremium = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
      
      if (storedUsage) {
        const usageData = JSON.parse(storedUsage);
        setUsage({
          ...usageData,
          tier: isPremium ? 'premium' : 'free',
          limit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily
        });
      } else {
        // Initialize new usage data
        const newUsage: UsageData = {
          count: 0,
          limit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
          tier: isPremium ? 'premium' : 'free',
          lastReset: now,
          dailyLimit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
          weeklyLimit: isPremium ? USAGE_LIMITS.premium.weekly : USAGE_LIMITS.free.weekly,
          monthlyLimit: isPremium ? USAGE_LIMITS.premium.monthly : USAGE_LIMITS.free.monthly
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(newUsage));
        setUsage(newUsage);
      }
    } catch (error) {
      console.error('Failed to initialize usage data:', error);
      // Set fallback usage data
      setUsage({
        count: 0,
        limit: USAGE_LIMITS.free.daily,
        tier: 'free',
        lastReset: Date.now(),
        dailyLimit: USAGE_LIMITS.free.daily,
        weeklyLimit: USAGE_LIMITS.free.weekly,
        monthlyLimit: USAGE_LIMITS.free.monthly
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDailyUsage = async () => {
    try {
      const storedUsage = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_DATA);
      if (storedUsage) {
        const usageData = JSON.parse(storedUsage);
        const isPremium = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
        
        const resetUsage: UsageData = {
          ...usageData,
          count: 0,
          limit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
          tier: isPremium ? 'premium' : 'free',
          lastReset: Date.now(),
          dailyLimit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
          weeklyLimit: isPremium ? USAGE_LIMITS.premium.weekly : USAGE_LIMITS.free.weekly,
          monthlyLimit: isPremium ? USAGE_LIMITS.premium.monthly : USAGE_LIMITS.free.monthly
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(resetUsage));
        setUsage(resetUsage);
      }
    } catch (error) {
      console.error('Failed to reset daily usage:', error);
    }
  };

  const trackUsage = useCallback(async (action: 'identify' | 'diagnose' | 'chat') => {
    if (!usage) return;

    try {
      const newCount = usage.count + 1;
      const newUsage: UsageData = {
        ...usage,
        count: newCount
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(newUsage));
      setUsage(newUsage);

      console.log(`Usage tracked: ${action}, count: ${newCount}/${usage.limit}`);
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  }, [usage]);

  const canUseFeature = useCallback(async (feature: 'identify' | 'diagnose' | 'chat'): Promise<boolean> => {
    if (!usage) return false;
    
    // Premium users have unlimited access
    if (usage.tier === 'premium') return true;
    
    // Check daily limit
    return usage.count < usage.limit;
  }, [usage]);

  const getUpgradeMessage = useCallback((): string => {
    if (!usage) return 'Upgrade to Premium for unlimited access';
    
    const remaining = usage.limit - usage.count;
    
    if (remaining <= 0) {
      return 'Daily limit reached! Upgrade to Premium for unlimited plant identifications, health checks, and AI chat.';
    }
    
    if (remaining <= 2) {
      return `Only ${remaining} identifications left today. Upgrade to Premium for unlimited access!`;
    }
    
    return `You have ${remaining} identifications remaining today. Upgrade to Premium for unlimited access!`;
  }, [usage]);

  const getRemainingTime = useCallback((): string => {
    if (!usage) return 'Unknown';
    
    const now = Date.now();
    const lastReset = usage.lastReset;
    const oneDay = 24 * 60 * 60 * 1000;
    const nextReset = lastReset + oneDay;
    const timeUntilReset = nextReset - now;
    
    if (timeUntilReset <= 0) return 'Resets soon';
    
    const hours = Math.floor(timeUntilReset / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilReset % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `Resets in ${hours}h ${minutes}m`;
    } else {
      return `Resets in ${minutes}m`;
    }
  }, [usage]);

  const upgradeToPremium = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      
      if (usage) {
        const premiumUsage: UsageData = {
          ...usage,
          tier: 'premium',
          limit: USAGE_LIMITS.premium.daily,
          dailyLimit: USAGE_LIMITS.premium.daily,
          weeklyLimit: USAGE_LIMITS.premium.weekly,
          monthlyLimit: USAGE_LIMITS.premium.monthly
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(premiumUsage));
        setUsage(premiumUsage);
      }
      
      console.log('Upgraded to Premium successfully');
    } catch (error) {
      console.error('Failed to upgrade to Premium:', error);
    }
  }, [usage]);

  const downgradeToFree = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'false');
      
      if (usage) {
        const freeUsage: UsageData = {
          ...usage,
          tier: 'free',
          limit: USAGE_LIMITS.free.daily,
          dailyLimit: USAGE_LIMITS.free.daily,
          weeklyLimit: USAGE_LIMITS.free.weekly,
          monthlyLimit: USAGE_LIMITS.free.monthly
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(freeUsage));
        setUsage(freeUsage);
      }
      
      console.log('Downgraded to Free successfully');
    } catch (error) {
      console.error('Failed to downgrade to Free:', error);
    }
  }, [usage]);

  const getUsageStats = useCallback(() => {
    if (!usage) return null;
    
    return {
      daily: {
        used: usage.count,
        limit: usage.dailyLimit,
        remaining: usage.dailyLimit - usage.count
      },
      weekly: {
        used: Math.min(usage.count, usage.weeklyLimit),
        limit: usage.weeklyLimit,
        remaining: usage.weeklyLimit - Math.min(usage.count, usage.weeklyLimit)
      },
      monthly: {
        used: Math.min(usage.count, usage.monthlyLimit),
        limit: usage.monthlyLimit,
        remaining: usage.monthlyLimit - Math.min(usage.count, usage.monthlyLimit)
      }
    };
  }, [usage]);

  const resetUsage = useCallback(async () => {
    try {
      const isPremium = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
      
      const resetUsage: UsageData = {
        count: 0,
        limit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
        tier: isPremium ? 'premium' : 'free',
        lastReset: Date.now(),
        dailyLimit: isPremium ? USAGE_LIMITS.premium.daily : USAGE_LIMITS.free.daily,
        weeklyLimit: isPremium ? USAGE_LIMITS.premium.weekly : USAGE_LIMITS.free.weekly,
        monthlyLimit: isPremium ? USAGE_LIMITS.premium.monthly : USAGE_LIMITS.free.monthly
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(resetUsage));
      setUsage(resetUsage);
      
      console.log('Usage reset successfully');
    } catch (error) {
      console.error('Failed to reset usage:', error);
    }
  }, []);

  return {
    usage,
    isLoading,
    trackUsage,
    canUseFeature,
    getUpgradeMessage,
    getRemainingTime,
    upgradeToPremium,
    downgradeToFree,
    getUsageStats,
    resetUsage
  };
};
