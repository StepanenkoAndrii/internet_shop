"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitRate = void 0;
const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));
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
function limitRate(time, requests) {
    return function (originalFn) {
        let lastUpdated = Date.now();
        let counter = 0;
        const newFn = function (...args) {
            if (counter < requests) {
                counter++;
                return originalFn.apply(null, args);
            }
            if (lastUpdated < Date.now() - time) {
                counter = 1;
                lastUpdated = Date.now();
                return originalFn.apply(null, args);
            }
            return sleep(time + lastUpdated - Date.now()).then(() => newFn.apply(null, args));
        };
        return newFn;
    };
}
exports.limitRate = limitRate;
