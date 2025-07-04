import { auth as sessionAuth } from '@/auth';
import { NextResponse } from 'next/server'
import { google } from 'googleapis';
import { handleSpreadSheetApiResponse } from '@/lib/parseDataGSheet';


export async function GET() {
  const session = await sessionAuth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: session?.accessToken,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = '18w5V-KrMmFe-GAlUu5y_yWIdEpGbQa948OXkjpoqKDs';

  try {
    const dashboardRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'CMS-P-D!A:G',
    });

    const registerRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'CMS-P-R!A:J',
    });

    const values = [
      ...(handleSpreadSheetApiResponse(dashboardRes.data.values) || []),
      ...(handleSpreadSheetApiResponse(registerRes.data.values) || [])
    ];

    return NextResponse.json({ data: values }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
