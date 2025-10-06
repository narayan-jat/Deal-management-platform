import { useState, useEffect } from 'react';
import { DealStatus } from '@/types/deal/Deal.enums';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { useAuth } from '@/context/AuthProvider';
import camelcaseKeys from 'camelcase-keys';
import { DealModel } from '@/types/deal';

export const useManageDeals = () => {
  const [draftDeals, setDraftDeals] = useState<Partial<DealModel>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const fetchDraftDeals = async () => {
    if (!user?.id) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all deals for the user
      const deals = await DealService.getAllDealsForUser(user.id);
      
      // Filter for draft deals only
      const draftDealsData = deals.filter(deal => deal.status === DealStatus.DRAFT);

      const camelCaseDeals = camelcaseKeys(draftDealsData, { deep: true }) as Partial<DealModel>[];
      
      setDraftDeals(camelCaseDeals);
    } catch (error) {
      console.error('Error fetching draft deals:', error);
      setError('Failed to load draft deals');
      ErrorService.handleApiError(error, "useManageDeals");
    } finally {
      setLoading(false);
    }
  };

  const refreshDeals = () => {
    fetchDraftDeals();
  };

  useEffect(() => {
    fetchDraftDeals();
  }, [user?.id]);

  return {
    draftDeals,
    loading,
    error,
    refreshDeals,
  };
}; 