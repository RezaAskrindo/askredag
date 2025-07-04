import { useState } from "react";
import { Calendar1, Check, ChevronsUpDown } from "lucide-react";

import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { type TField } from "@/stores/cms-store";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import ReactNumberFormat from "./form-react-number-format";
import CheckDuplicateInput from "./CheckDuplicateInput";

interface PageRegisterInputProps {
  item: TField;
  idField: string;
}

const PageRegisterInput: React.FC<PageRegisterInputProps> = ({
  item,
  idField
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [value, setValue] = useState<string | undefined>(undefined);

  let fieldRender = <Input
    className="w-full"
    id={idField}
    type={item.field_type}
    placeholder={item.label}
  />

  if (item.field_type === 'checkbox') {
    fieldRender = <div className="flex flex-col gap-2">
      { item.options?.map((option) => <div key={option} className="flex items-center gap-3">
        <Checkbox id={`${option}-${idField}`} />
        <Label htmlFor={`${option}-${idField}`}>{ option }</Label>
      </div>
      ) }
    </div>
  }

  if (item.field_type === 'date') {
    fieldRender = <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-62 justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Pilih Tanggal"}
          <Calendar1 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  }

  if (item.field_type === 'select') {
    fieldRender = <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-full justify-between"
        >
          {value ?? item.label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${item.label}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Pilihan Tidak Ditemukan</CommandEmpty>
            <CommandGroup>
              {item.options?.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  }

  if (item.field_type === 'textarea') {
    fieldRender = <Textarea placeholder={item.label} />
  }

  
  if (item.field_type === 'number') {
    fieldRender = <ReactNumberFormat
      placeholder={item.label}
      thousandSeparator="."
      decimalScale={5}
      decimalSeparator=","
      allowNegative={false}
    />
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 space-x-4 space-y-1.5 items-center">
        <Label htmlFor={idField}>
          {item.label}
          {item.required_field === 'mandatory' && <span className="text-red-700">*</span>}
        </Label>

        <div className="lg:col-span-2">
          { fieldRender }
        </div>
      </div>

      { item?.description ? <Alert>
        <AlertTitle>Keterangan: { item.label }</AlertTitle>
        <AlertDescription>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(item.description).toString()) }}></div>
        </AlertDescription>
      </Alert> : null }

      <CheckDuplicateInput field={item} />
    </>
  )
}

export default PageRegisterInput;