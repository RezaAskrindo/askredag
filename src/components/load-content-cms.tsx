"use client"

import Script from 'next/script';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { ChevronRight, Loader2 } from 'lucide-react';

import { useCMSStore } from '@/stores/cms-store-provider';
import { handleSpreadSheetApiResponse } from '@/lib/parseDataGSheet';
import { Button } from "@/components/ui/button";
import { CMSItem } from '@/stores/cms-store';

const LoadContentCMS = () => {
  const { data: session } = useSession();
  const { setItems } = useCMSStore((state) => state);

  const [loading, setLoading] = useState<boolean>(true);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [googleApi, setGoogleApi] = useState<any>(null);

  useEffect(() => {
    if ((session?.accessToken) && googleApi) {
      setLoading(true);
      googleApi.load('client', async () => {
        await googleApi.client.init({
          apiKey: 'AIzaSyBhb8Xfg_Z3NBco_JM9aMkxwKSj7d8mT8I',
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });

        googleApi.client.setToken({
          access_token: session.accessToken,
        });

        const CMSSheetId = '18w5V-KrMmFe-GAlUu5y_yWIdEpGbQa948OXkjpoqKDs';

        let items: CMSItem[] = [];

        const CMSPageDashboard = "CMS-P-D!A:F";
        const getDataCMSDashboard = await googleApi.client.sheets.spreadsheets.values.get({
          spreadsheetId: CMSSheetId,
          range: CMSPageDashboard,
        });
        
        if (getDataCMSDashboard?.result?.values.length) {
          const dataParse = handleSpreadSheetApiResponse(getDataCMSDashboard.result.values);
          items = [...items, ...dataParse];
          // setItems(dataParse);
        }

        const CMSPageRegister = "CMS-P-R!A:F";
        const getDataCMSRegister = await googleApi.client.sheets.spreadsheets.values.get({
          spreadsheetId: CMSSheetId,
          range: CMSPageRegister,
        });
        
        if (getDataCMSRegister?.result?.values.length) {
          const dataParse = handleSpreadSheetApiResponse(getDataCMSRegister.result.values);
          // setItems(dataParse);
          items = [...items, ...dataParse];
        }
        
        setItems(items);

        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [googleApi, session, setItems]);

  return (
    <div>
      <Button variant="outline" asChild>
        {
          loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Memuat Prototype...
            </span>
          ) : (    
            <Link href="/login">
              <ChevronRight className="w-4 h-4" />
              Lanjut Ke Prototipe
            </Link>
          )
        }
      </Button>
      <Script async defer src="https://apis.google.com/js/api.js" onLoad={() => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const w = window as any;
        const gapi = w?.gapi;
        if (gapi) {
          setGoogleApi(gapi)
        }
      }} />
    </div>
  );
}

export default LoadContentCMS;