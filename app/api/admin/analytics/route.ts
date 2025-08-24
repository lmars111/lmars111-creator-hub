import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const user = requireAdmin();
    
    // Mock analytics data - in a real app, this would query your database
    const analyticsData = {
      userCount: 1248,
      revenue: 45670,
      contentCount: 3421,
      activeUsers: 892,
      recentActivity: {
        newUsersToday: 15,
        contentCreatedToday: 8,
        revenueToday: 1230,
      },
      chartData: {
        userGrowth: [120, 135, 142, 155, 168, 180, 192],
        revenueGrowth: [3200, 3800, 4100, 4350, 4200, 4500, 4800],
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}