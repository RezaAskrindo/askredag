"use client"

import { useCMSStore } from "@/stores/cms-store-provider"
import { useSearchParams } from "next/navigation"
import { useSWRCMSData } from "@/stores/useSWRCMSData"
import { Toaster } from "@/components/ui/sonner"

import PageDashboard from "./PageDashboard"
import PageRegister from "./PageRegister"

const PagePrototype: React.FC = () => {
  useSWRCMSData()

  const items = useCMSStore((state) => state.items)

  const searchParams = useSearchParams()
  const type_page = searchParams.get('type_page')
  const page = searchParams.get('page')
  const role = searchParams.get('role')

  if (!type_page && !page && !role) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 lg:py-10 lg:px-0">
        <div className="text-center">Selamat Datang Di Prototipe ASKREDAG PT ASKRINDO</div>
        <div className="text-center">Pilih Menu Di Sebelah Kiri</div>
        <iframe src="https://docs.google.com/file/d/1VokWXNopD21nXaERVCjkY7KmT0PEjP0DyP4P3GON6lI/preview" allow="autoplay" loading="lazy" className="w-full lg:max-w-3/5 h-[700px]"></iframe>
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
      <div className="flex flex-col p-4 md:gap-6 md:py-6 gap-y-4">
        <PageRegister 
          items={items}
          type_page={type_page}
          page={page || ''}
        />
        <Toaster />
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