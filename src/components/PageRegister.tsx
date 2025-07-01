import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";

import { CMSItem } from "@/stores/cms-store";
import { useMemo } from "react";

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
  const fields = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const result = items
      .filter((item) => item.type_page === type_page && item.page === page)
      .map((item) => ({
        header: item.label,
      }));

    return result;
  }, [items, type_page, page]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{ page }</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="grid grid-cols-4 space-x-4 space-y-2 items-center">
              <Label htmlFor={`field-${index}`}>{field.header}</Label>
              <Input
                className="col-span-4 lg:col-span-2"
                id={`field-${index}`}
                type="text"
                placeholder={`Masukkan ${field.header.toLowerCase()}`}
              />
              </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <CardAction className="w-full">
          <Button type="submit">Submit { page }</Button>
        </CardAction>
      </CardFooter>
    </Card>
  )
}

export default PageRegister;