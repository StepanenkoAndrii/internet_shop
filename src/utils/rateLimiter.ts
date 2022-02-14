const sleep = (t: number | undefined) => new Promise((resolve) => setTimeout(resolve, t));

// export function limitRate(time: number, requests: number) {
//     return function (target: object, propertyName: string, descriptor: PropertyDescriptor) {
//         const originalFn = descriptor.value;
//         let lastUpdated = Date.now();
//         let counter = 0;
//
//         descriptor.value = function (...args: unknown[]) {
//             if (counter < requests) {
//                 counter++;
//                 return originalFn.apply(this, args);
//             }
//             if (lastUpdated < Date.now() - time) {
//                 counter = 1;
//                 lastUpdated = Date.now();
//                 return originalFn.apply(this, args);
//             }
//             return sleep(time + lastUpdated - Date.now()).then(() => descriptor.value.apply(this, args))
//         }
//     }
// }

export function limitRate(time: number, requests: number) {
    return function (originalFn: (...args: any[]) => Promise<any>) {
        let lastUpdated = Date.now();
        let counter = 0;

        const newFn = function (...args: any[]): Promise<any> {
            if (counter < requests) {
                counter++;
                return originalFn.apply(null, args);
            }
            if (lastUpdated < Date.now() - time) {
                counter = 1;
                lastUpdated = Date.now();
                return originalFn.apply(null, args);
            }
            return sleep(time + lastUpdated - Date.now()).then(() => newFn.apply(null, args))
        }
        return newFn;
    }
}
