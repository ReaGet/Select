export declare function Select(opts?: TSelectOptions): TSelect | TSelect[];

export declare type TSelectOptions = {
  name?: string,
  disabled?: boolean,
  template: {
    arrow: string
  },
  vars: Record<string, any>,
}

export declare interface TSelect {
  $el: HTMLSelectElement;
  value: string;
  disabled: boolean;
  options: TOption[];
  parent: TSelect[];
  children: TSelect[];

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

  dependsOn: (select: TSelect) => void;
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