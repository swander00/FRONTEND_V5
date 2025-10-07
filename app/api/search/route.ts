import { NextRequest, NextResponse } from 'next/server';
import { mockSearch } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
    console.log('Search request:', { searchTerm, page, pageSize, status });

    // Use mock search function
    const result = await mockSearch(searchTerm, status, page, pageSize);

    return NextResponse.json({
      properties: result.properties,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      searchTerm: query,
      page: result.currentPage,
      pageSize: result.pageSize
    });

  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}