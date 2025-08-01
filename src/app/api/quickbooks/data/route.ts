import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type'); // accounts, customers, invoices
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const realmId = searchParams.get('realmId');

    if (!accessToken || !refreshToken || !realmId) {
      return NextResponse.json(
        { error: 'Missing QuickBooks credentials' },
        { status: 400 }
      );
    }

    // Initialize QuickBooks service with tokens
    quickBooksService.initialize(accessToken, refreshToken, realmId);

    let data;
    switch (dataType) {
      case 'accounts':
        data = await quickBooksService.getAccounts();
        break;
      case 'customers':
        data = await quickBooksService.getCustomers();
        break;
      case 'invoices':
        data = await quickBooksService.getInvoices();
        break;
      case 'company':
        data = await quickBooksService.getCompanyInfo();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid data type. Use: accounts, customers, invoices, or company' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 1
    });

  } catch (error) {
    console.error('QuickBooks data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QuickBooks data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dataType, data, accessToken, refreshToken, realmId } = await request.json();

    if (!accessToken || !refreshToken || !realmId) {
      return NextResponse.json(
        { error: 'Missing QuickBooks credentials' },
        { status: 400 }
      );
    }

    // Initialize QuickBooks service with tokens
    quickBooksService.initialize(accessToken, refreshToken, realmId);

    let result;
    switch (dataType) {
      case 'account':
        result = await quickBooksService.createAccount(data);
        break;
      case 'customer':
        result = await quickBooksService.createCustomer(data);
        break;
      case 'invoice':
        result = await quickBooksService.createInvoice(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid data type. Use: account, customer, or invoice' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('QuickBooks create error:', error);
    return NextResponse.json(
      { error: 'Failed to create QuickBooks record' },
      { status: 500 }
    );
  }
} 