import { useMemo } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CMSItem, TField } from "@/stores/cms-store";

import PageRegisterInput from "./PageRegisterInput";
import { toast } from "sonner";
import { GalleryVerticalEnd, Save } from "lucide-react";

type PageRegisterProps = {
  items: CMSItem[];
  type_page: string
  page: string
}

const PageRegister: React.FC<PageRegisterProps> = ({
  items,
  type_page,
  page,
}) => {
  const fields: TField[] = useMemo(() => {
    if (items.length === 0) return [];

    const result = items
      .filter((item) => item.type_page === type_page && item.page === page)
      .map((item) => ({
        group_form: item.group_form ?? "",
        label: item.label ?? "",
        field_type: item.field_type ?? "",
        required_field: item.required_field ?? "",
        options: item.options?.split(",") || null,
        description: item.description,
        is_dynamic: item.is_dynamic,
      }));

    return result;
  }, [items, type_page, page]);

  const groupFormFields = useMemo(() => {
    if (fields.length === 0) return [];

    const grouped = fields.reduce((acc: Record<string, TField[]>, field) => {
      if (field.group_form) {
        if (!acc[field.group_form]) {
          acc[field.group_form] = [];
        }
        acc[field.group_form].push(field);
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([group, fields]) => ({
      group,
      fields,
    }));
  }, [fields]);

  return groupFormFields.map((field, index) => (
    <Card key={`${field.group}-${index}`} className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <GalleryVerticalEnd className="size-5" />
            { field.group } 
          </div>
          <div className="font-bold">
            { field.fields?.[0]?.is_dynamic === "TRUE" ? 
              "MULTIPLE FORM"
              : null 
            }
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          {field.fields.map((field, index) => (
            <PageRegisterInput key={`field-${index}`} item={field} idField={`field-${index}`} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <CardAction className="w-full">
          <Button onClick={() => toast.success(`Data ${field.group} Berhasil Di Simpan`)}>
            <Save />
            { field.group }
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  ))
}

export default PageRegister;