export type RootTabParamList = {
  Home: undefined;
  Places:
    | {
        categoryKey?: 'tarihi' | 'park' | 'manzara' | 'muze';
        detailKey?: string;
      }
    | undefined;
};
