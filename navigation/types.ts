export type RootTabParamList = {
  Home: undefined;
  Transport:
    | {
        detailKey?: 'dolmus' | 'havalimani' | 'havas';
      }
    | undefined;
  Places:
    | {
        categoryKey?: 'tarihi' | 'park' | 'manzara' | 'muze';
        detailKey?: string;
      }
    | undefined;
};
