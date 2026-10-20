import { NextResponse } from 'next/server';
import { getCreemStats, getCreemTransactions, getCreemSubscriptions } from '@/lib/creem';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'USD';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const [statsResult, transactionsResult, subscriptionsResult] = await Promise.allSettled([
      getCreemStats(currency),
      getCreemTransactions(limit),
      getCreemSubscriptions(),
    ]);

    const stats = statsResult.status === 'fulfilled' ? statsResult.value : null;
    const transactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value : { items: [], totalRecords: 0 };
    const subscriptions = subscriptionsResult.status === 'fulfilled' ? subscriptionsResult.value : { items: [], totalRecords: 0 };

    return NextResponse.json({
      success: true,
      mode: process.env.CREEM_TEST_MODE !== 'false' ? 'test' : 'live',
      currency,
      summary: {
        totalRevenue: stats?.totals?.totalRevenue ?? 0,
        netRevenue: stats?.totals?.totalNetRevenue ?? 0,
        monthlyRecurringRevenue: stats?.totals?.monthlyRecurringRevenue ?? 0,
        activeSubscriptions: stats?.totals?.activeSubscriptions ?? subscriptions.totalRecords,
        totalCustomers: stats?.totals?.totalCustomers ?? 0,
        totalPayments: stats?.totals?.totalPayments ?? transactions.totalRecords,
      },
      recentTransactions: transactions.items,
      subscriptions: subscriptions.items,
      meta: {
        products: {
          starter: process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER || 'prod_5ByHVBJDCL2gyknzv1VqU4',
          pro: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || 'prod_279fuhC5FSVX9DR6MLSuU4',
          agency: process.env.NEXT_PUBLIC_CREEM_PRODUCT_AGENCY || 'prod_1CtCL59SfGfm79Mgvtxlf4',
        },
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('[Creem Admin Analytics API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment analytics' },
      { status: 500 }
    );
  }
}
