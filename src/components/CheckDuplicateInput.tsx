
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TField } from "@/stores/cms-store"
import { useCMSStore } from "@/stores/cms-store-provider"

type TCheckDuplicateInput = {
  field: TField
}

const CheckDuplicateInput: React.FC<TCheckDuplicateInput> = ({
  field
}) => {
  const items = useCMSStore((state) => state.items);
  const findItem = items.filter(el => el.label === field.label);

  if (findItem.length === 1) {
    return null;
  }

  return (
    <Alert className="hidden md:flex md:flex-col">
      <AlertTitle>Integrasi Field: { field.label }</AlertTitle>
      <AlertDescription>
        <ol>
          { findItem.map((el, i) => <li key={`${el.label}-${i}`}>{ el.label } - { el.group_form } - { el.page } </li>)}
        </ol>
      </AlertDescription>
    </Alert>
  )
}

export default CheckDuplicateInput