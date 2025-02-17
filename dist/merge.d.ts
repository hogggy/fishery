export declare const merge: {
    <TObject, TSource>(object: TObject, source: TSource, customizer: (value: any, srcValue: any, key: string, object: any, source: any) => any): TObject & TSource;
    <TObject_1, TSource1, TSource2>(object: TObject_1, source1: TSource1, source2: TSource2, customizer: (value: any, srcValue: any, key: string, object: any, source: any) => any): TObject_1 & TSource1 & TSource2;
    <TObject_2, TSource1_1, TSource2_1, TSource3>(object: TObject_2, source1: TSource1_1, source2: TSource2_1, source3: TSource3, customizer: (value: any, srcValue: any, key: string, object: any, source: any) => any): TObject_2 & TSource1_1 & TSource2_1 & TSource3;
    <TObject_3, TSource1_2, TSource2_2, TSource3_1, TSource4>(object: TObject_3, source1: TSource1_2, source2: TSource2_2, source3: TSource3_1, source4: TSource4, customizer: (value: any, srcValue: any, key: string, object: any, source: any) => any): TObject_3 & TSource1_2 & TSource2_2 & TSource3_1 & TSource4;
    (object: any, ...otherArgs: any[]): any;
};
export declare const mergeCustomizer: (objValue: any, srcVal: any, key: 'string', object: any) => any[] | undefined;
