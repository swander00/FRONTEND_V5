'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Property } from '@/types';
import { getPropertiesWithPaginationFromDB } from '@/lib/propertyMapping';
import { FilterCriteria } from '@/lib/propertyMapping';

interface UsePropertyPaginationProps {
  initialPage?: number;
  pageSize?: number;
  filters?: FilterCriteria;
}

interface PaginationState {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isPageChanging: boolean;
  error: string | null;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  refresh: () => void;
}

export function usePropertyPagination({
  initialPage = 1,
  pageSize = 12,
  filters
}: UsePropertyPaginationProps): PaginationState & PaginationActions {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // parse page from URL
  const pageParam = useMemo(() => {
    const p = parseInt(searchParams.get('page') ?? '', 10);
    return !isNaN(p) && p > 0 ? p : initialPage;
  }, [searchParams, initialPage]);

  const [state, setState] = useState<PaginationState>({
    properties: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: pageParam,
    isLoading: true,
    isPageChanging: false,
    error: null
  });

  // stable identity for filters
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters ?? {})]);

  // build & push a string URL so Next can parse it
  const updateURL = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.push(url, { scroll: false });
  }, [searchParams, router, pathname]);

  // core fetch
  const fetchProperties = useCallback(
    async (page: number, isPageChange = false) => {
      setState(prev => ({
        ...prev,
        isLoading: !isPageChange,
        isPageChanging: isPageChange,
        error: null
      }));

      try {
        const result = await getPropertiesWithPaginationFromDB(
          page,
          pageSize,
          stableFilters!
        );
        setState(prev => ({
          ...prev,
          properties: result.properties,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
          isLoading: false,
          isPageChanging: false,
          error: null
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPageChanging: false,
          error: err instanceof Error ? err.message : 'Failed to fetch properties'
        }));
      }
    },
    [pageSize, stableFilters]
  );

  // page controls
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchProperties(page, true);
      updateURL(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchProperties, updateURL, state.totalPages]);

  const goToNextPage    = useCallback(() => goToPage(state.currentPage + 1), [goToPage, state.currentPage]);
  const goToPreviousPage= useCallback(() => goToPage(state.currentPage - 1), [goToPage, state.currentPage]);
  const refresh         = useCallback(() => fetchProperties(state.currentPage, false), [fetchProperties, state.currentPage]);

  // 1) initial load & direct-URL edits
  useEffect(() => {
    fetchProperties(pageParam);
  }, [fetchProperties, pageParam]);

  // 2) **only** when your *filters* change
  const filtersJson = useMemo(() => JSON.stringify(filters ?? {}), [filters]);
  useEffect(() => {
    if (filters) {
      fetchProperties(1, false);
      updateURL(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersJson]);

  return {
    ...state,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refresh
  };
}
