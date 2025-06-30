import { createStore } from 'zustand/vanilla'

export type CMSItem = {
  role: string;
  type_page: string;
  page: string;
  label: string;
  field_type: string;
  faker_type?: string;
  faker_helper?: string;
  group_form?: string;
  options?: string;
}

export type CMSState = {
  items: CMSItem[];
}

export type CMSActions = {
  setItems: (items: CMSState['items']) => void;
}

export type CMSStore = CMSState & CMSActions

export const defaultInitState: CMSState = {
  items: [],
}

export const createCMSStore = (
  initState: CMSState = defaultInitState,
) => {
  return createStore<CMSStore>()((set) => ({
    ...initState,
    setItems: (data: CMSItem[]) => {
      // localStorage.setItem('items', JSON.stringify(data));
      set((state) => ({ 
        ...state.items,
        items: data 
      }))
    },
    // setItems: (items) => set((state) => ({
    //   ...state,
    //   items: [...state.items, ...items],
    // })),,
  }))
}