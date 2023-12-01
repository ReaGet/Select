export declare function Select(opts?: TSelectOptions): TSelect | TSelect[];

export declare type TSelectOptions = {
  name?: string,
  disabled?: boolean,
  template: {
    arrow: string
  }
}

export declare interface TSelect {
  $el: HTMLSelectElement;
  value: string;
  disabled: boolean;
  options: TOption[];

  add: (option: TOptionParam | TOptionParam[]) => void;
  set: (option: TOptionParam | TOptionParam[]) => void;
  remove: (value: string) => void;
  clear: () => void;
  item: (index: number) => TOption;
  itemByValue: (value: string) => TOption;

  open: () => void;
  close: () => void;

  on: (eventName: string, fn: () => void) => void;
  off: (eventName: string, fn: () => void) => void;
  emit: (eventName: string, ...args: any) => void;
}

type TOption = TOptionParam & {
  $el: HTMLElement;
}

type TOptionParam = {
  value: string;
  text: string;
  selected?: boolean;
  disabled?: boolean;
}