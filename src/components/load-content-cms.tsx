"use client"

import Link from 'next/link';

import { ChevronRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSWRCMSData } from '@/stores/useSWRCMSData';

const LoadContentCMS = () => {
  const { isLoading } = useSWRCMSData();

  return isLoading ?
  <Button variant="outline" disabled={isLoading}>
    <span className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      Memuat Prototype...
    </span>
  </Button> :    
  <Button variant="outline" asChild>
    <Link href="/dashboard">
      <ChevronRight className="w-4 h-4" />
      Lanjut Ke Prototipe
    </Link>
  </Button>
}

export default LoadContentCMS;