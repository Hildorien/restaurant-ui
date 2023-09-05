export function updateProp<TObj, K extends keyof TObj>(obj: TObj, key: K, value: TObj[K]) {
    obj[key] = value;
}

export function addProps(obj: any, arr: any, val: any) {

    if (typeof arr == 'string')
        arr = arr.split(".");

    obj[arr[0]] = obj[arr[0]] || {};

    var tmpObj = obj[arr[0]];

    if (arr.length > 1) {
        arr.shift();
        addProps(tmpObj, arr, val);
    }
    else
        obj[arr[0]] = val;

    return obj;

}