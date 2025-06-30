
import { CMSItem } from "@/stores/cms-store";
import { DataTableGeneral } from "./data-table-general"
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

type PageDashboardProps = {
  items: CMSItem[];
  type_page: string
  page: string
  role: string
}

const PageDashboard: React.FC<PageDashboardProps> = ({
  items,
  type_page,
  page,
  role,
}) => {
  const columns: ColumnDef<CMSItem>[] = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const result = items
      .filter((item) => item.type_page === type_page && item.page === page && item.role === role)
      .map((item) => ({
        header: item.label,
      }));

    return result;
  }, [items, type_page, page, role]);

  return <DataTableGeneral data={[]} columns={columns} />
}

export default PageDashboard;