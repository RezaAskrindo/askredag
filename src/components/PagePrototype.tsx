"use client"

import { useCMSStore } from "@/stores/cms-store-provider"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import PageDashboard from "./PageDashboard"
import PageRegister from "./PageRegister"

const PagePrototype: React.FC = () => {
  const {
    items,
    setItems
  } = useCMSStore((state) => state)

  const searchParams = useSearchParams()
  const type_page = searchParams.get('type_page')
  const page = searchParams.get('page')
  const role = searchParams.get('role')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sheet-data');
      const json = await res.json();
      setItems(json.data);
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [setItems]);

  if (!type_page && !page && !role) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <p>Selamat Datang Di Prototipe ASKREDAG PT ASKRINDO</p>
        <p>Pilih Menu Di Sebelah Kiri</p>
      </div>
    )
  }

  if (type_page === 'dashboard') {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageDashboard
          items={items}
          type_page={type_page}
          page={page || ''}
          role={role || ''}
        />
      </div>
    )
  } else if (type_page === 'register') {
    return (
      <div className="flex flex-col p-4 md:gap-6 md:py-6">
        <PageRegister 
          items={items}
          type_page={type_page}
          page={page || ''}
        />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <p>Halaman {page} dengan tipe {type_page} tidak ditemukan.</p>
        <p>Silakan pilih menu yang tersedia di sebelah kiri.</p>
      </div>
    )
  }

}

export default PagePrototype