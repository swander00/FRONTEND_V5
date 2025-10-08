import { NextRequest, NextResponse } from 'next/server';
import { searchPropertySuggestions } from '@/lib/propertyDataService';

// Force dynamic rendering for this API route
// This ensures the route is always executed at runtime (required for real database queries)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const status = searchParams.get('status') || 'buy';

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        properties: [], 
        totalCount: 0, 
        totalPages: 0,
        searchTerm: query 
      });
    }

    const searchTerm = query.trim();
    console.log('Search suggestions request:', { searchTerm, page, pageSize, status });

    // Use data service abstraction (currently mock, ready for real data)
    const result = await searchPropertySuggestions(searchTerm, status, page, pageSize);

    return NextResponse.json({
      properties: result.properties,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      searchTerm: query,
      page: result.currentPage,
      pageSize: result.pageSize
    });

  } catch (error) {
    console.error('Error in search suggestions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}