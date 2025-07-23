import { useState, useEffect } from 'react';
import { DealModel } from '@/types/deal';
import { DealService } from '@/services/deals/DealService';
import { KanbanBoardColumns } from '@/types/KanbanBoard';

export const useKanbanBoard = () => {
  const [initialDeals, setInitialDeals] = useState<KanbanBoardColumns>({
    new: [],
    proposals: [],
    negotiation: [],
    inProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  return { loading, error, initialDeals };
};
