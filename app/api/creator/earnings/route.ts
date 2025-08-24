import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/getSessionCreator';
import type { EarningsSummary } from '@/lib/types';

export async function GET() {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo data - in a real app, this would come from a database
  const earnings: EarningsSummary = {
    today: 125.50,
    sevenDays: 892.75,
    thirtyDays: 3240.20,
    currency: 'USD'
  };

  return NextResponse.json(earnings);
}