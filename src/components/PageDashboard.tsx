
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CMSItem } from "@/stores/cms-store";
import { toCamelCase } from "@/lib/convertCamelCase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTableGeneral } from "./data-table-general"
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

type PageDashboardProps = {
  items: CMSItem[];
  type_page: string
  page: string
  role: string
}

type TConfigFaker = {
  field_name: string
  faker_type: string
  faker_helper?: string[]
}

const PageDashboard: React.FC<PageDashboardProps> = ({
  items,
  type_page,
  page,
  role,
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnDef<CMSItem>[] = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const result: ColumnDef<CMSItem>[] = items
      .filter((item) => item.type_page === type_page && item.page === page && item.role === role)
      .map((item) => ({
        header: item.label,
        accessorKey: toCamelCase(item.label),
      }));

    result.push(
      {
        id: "actions",
        enableHiding: false,
        cell: () => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Action 1</DropdownMenuItem>
                <DropdownMenuItem>Action 2</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Action 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
    )

    return result;
  }, [items, type_page, page, role]);

  const fakerConfig: TConfigFaker[] = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const result = items
      .filter((item) => item.type_page === type_page && item.page === page && item.role === role)
      .map((item) => ({
        field_name: toCamelCase(item.label),
        faker_type: item.faker_type ?? "",
        faker_helper: item?.faker_helper?.split(",") ?? undefined,
      }));

    return result;
  }, [items, type_page, page, role]);


  useEffect(() => {
    const fetchFakeData = async (config: TConfigFaker[]) => {
      try {
        setLoading(true);
        const res = await fetch('/api/faker-data?limit=50', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        });

        if (!res.ok) {
          setLoading(false);
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        setLoading(false);
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        console.log(err)
        setLoading(false);
      }
    }

    if (fakerConfig.length) {
      fetchFakeData(fakerConfig);
    }
    
  }, [fakerConfig]);

  if (loading) {
    return <p className="text-center">Mohon Menunggu...</p>
  }

  return <DataTableGeneral data={data} columns={columns} />
}

export default PageDashboard;