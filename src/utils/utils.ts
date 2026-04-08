// export function throttle(fn, options) {
//     const { wait = 1000 } = options;

//     let timer = null

//     return function (...args) {
//         if (timer) return
//         fn.apply(this, args);

//         timer = setTimeout(() => {
//             timer = null;
//         }, wait);
//     }
// }

// export function throttle(fn, options) {
//     const { wait = 1000, } = options;
//     let { leading = false } = options;
//     let timer = null;

//     return function (...args) {
//         if (timer) return;
//         const _fn = fn.bind(this, args);

//         if (leading) {
//             _fn()
//         }
//         timer = setTimeout(() => {
//             if (!leading) {
//                 _fn()
//             }
//             timer = null
//             leading = true;

//         }, wait);
//     }
// };

// export function throttle(fn, options) {
//     const { wait = 1000, leading = true, trailing = true } = options;
//     let _args ;
//     let timer = null;
//     return function (...args) {
//         _args = args;
//         if (timer) return;
//         if (leading) {
//             fn.apply(this, _args);
//             timer = setTimeout(() => {
//                 timer = null;
//             }, wait);
//         } else if (trailing) {
//             timer = setTimeout(() => {
//                 fn.apply(this, _args);
//                 timer = null;
//             }, wait);
//         }
//     }
// }

// export const throttle = (fn, options) => {
//     const { leading = true, wait = 200, trailing = true } = options;
//     let timer = null;
//     let _args;
//     return (...arg) => { // 这个函数会被多次调用 
//         _args = arg;
//         if (timer) return
//         if (leading) {
//             fn(..._args);
//         } else {
//             timer = setTimeout(() => {
//                 timer = null
//                 fn(..._args);
//             }, wait);
//         }

//         if (trailing) {
//             timer = setTimeout(() => {
//                 timer = null
//                 fn(..._args);
//             }, wait);
//         }
//     }
// }

// export const throttle = (fn, options) => {
//     const { wait = 200, leading = false, trailing = true } = options;

//     let lastArgs = null;
//     let timer = null;


//     const invokeLater = () => {
//         if (trailing && lastArgs) {
//             fn(...lastArgs)
//             lastArgs = null;
//             timer = setTimeout(invokeLater, wait);
//         } else {
//             timer = null
//             lastArgs = null;
//         }
//     }

//     return (...args) => {

//         lastArgs = args;

//         if (timer) return;
//         if (leading) {
//             // 立即调用
//             fn(...args);
//             timer = setTimeout(invokeLater, wait);
//         } else {
//             timer = setTimeout(invokeLater, wait);
//         }
//     }

// }


type ThrottleOptions = {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
};

/**
 * 节流（throttle）：
 * 把“高频触发”的函数调用压缩为“每个时间窗口最多触发一次（可选首尾触发）”。
 *
 * 适用场景：
 * - `scroll` / `resize` / `mousemove` 等会在短时间内触发很多次的事件
 * - 需要降低函数执行频率，减少渲染、计算或网络请求压力
 *
 * 这个实现支持两个常见行为开关：
 * - `leading`: 是否在窗口开始时立即执行一次
 * - `trailing`: 是否在窗口结束时补执行“最后一次调用”
 *
 * 常见组合：
 * - `leading=true, trailing=false`：立刻执行，窗口内后续忽略
 * - `leading=false, trailing=true`：窗口结束执行最后一次（更“防抖感”）
 * - `leading=true, trailing=true`：首尾各一次（尾部只会用最后参数）
 */
//   export function throttle<T extends (this: unknown, ...args: unknown[]) => unknown>(
//     fn: T,
//     options: ThrottleOptions = {}
//   ) {
//     const { wait = 200, leading = true, trailing = true } = options;

//     // timer 不为 null 说明当前节流窗口仍在进行中。
//     let timer: ReturnType<typeof setTimeout> | null = null;
//     // 记录“最近一次调用”的参数与执行器（封装了当次调用的 this + args）。
//     let lastArgs: Parameters<T> | null = null;
//     let lastInvoke: (() => void) | null = null;

//     /**
//      * 真正执行 fn 的统一入口：
//      * - 只在 lastArgs 存在时执行
//      * - 执行后清空缓存，避免重复执行同一批参数
//      */
//     const invoke = () => {
//       if (!lastArgs) return;
//       if (!lastInvoke) return;
//       lastInvoke();
//       lastArgs = null;
//       lastInvoke = null;
//     };

//     /**
//      * 开启一个节流时间窗口。
//      * 窗口结束后：
//      * 1) 先解锁（timer = null）
//      * 2) 如果启用 trailing 且期间有新调用，则执行一次“最后调用”
//      * 3) 如果执行 trailing 时又产生了新调用，继续开启下一窗口
//      */
//     const startTimer = () => {
//       timer = setTimeout(() => {
//         timer = null;

//         // 窗口结束时，如果还有最后一次调用，按 trailing 补执行
//         if (trailing && lastArgs) {
//           invoke();

//           // 若 invoke 过程中再次触发了包装函数，会重新写入 lastArgs。
//           // 此时继续开新窗口，保证后续调用仍被节流处理。
//           if (lastArgs) startTimer();
//         }
//       }, wait);
//     };

//     /**
//      * 返回的包装函数是“你实际绑定事件/调用的函数”。
//      * 每次调用都会先覆盖 lastArgs/lastThis，确保 trailing 始终拿到最后一次参数。
//      */
//     return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
//       // 缓存最近一次调用信息（窗口结束时可能会用到）
//       lastArgs = args;
//       lastInvoke = () => fn.apply(this, args);

//       // 只有在“当前没有窗口”时，才会开启新窗口。
//       if (!timer) {
//         // leading: 窗口开始立即执行一次
//         if (leading) {
//           invoke();
//         }

//         // 开启窗口的目的有两个：
//         // 1) trailing=true 时，等待窗口结束后执行尾调用
//         // 2) leading-only 时，用窗口“上锁”，避免 wait 内连续触发
//         if (trailing || leading) {
//           startTimer();
//         }
//       }
//     };
//   }

export function throttle(fn, options) {
    const { wait = 200, leading = false, trailing = true } = options;

    let timer = null, lastArgs = null, lastThis = null;

    const invoke = () => {
        if (!lastArgs) return
        fn.apply(lastThis, lastArgs);
        lastArgs = null
        lastThis = null
    }

    const startTimer = () => {
        timer = setTimeout(() => {
            timer = null;
            if (trailing && lastArgs) {
                invoke();
                // if (lastArgs) {
                //     startTimer()
                // }
            }
        }, wait);
    }

    return function (...args) {
        lastThis = this;
        lastArgs = args;

        if (timer) return;

        if (leading) {
            invoke()
        }
        startTimer()

    }
}

export function debounce(fn, wait) {
    let timer
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null;
        }, wait);
    }
}


// export function myPromise(promise) {
//     if (!Array.isArray(promise) && promise.every(item => item instanceof Promise)) return
//     const result = []
//     let index =0;
//     for (let i = 0; i < promise.length; i++) {
//         promise[i].then(res => {
//             result[i] = res;
//             index++
//             if (index === promise.length) {
//                 return Promise.resolve(result)
//             }
//         }).catch(err => {
//             result[i] = err
//             return Promise.reject(result)
//         })
//     }
// }

export function mypromises(promises) {
    if (!Array.isArray(promises)) {
        return Promise.reject(new TypeError('Argument must be an array'));
    }
    const result = []
    let index = 0;

    return new Promise((resolve, reject) => {
        if(promises.length === 0){
            resolve([])
        }
        promises.forEach((p, i) => {
            p.then(res => {
                result[i] = res;
                index++;
                if (index === promises.length) {
                    resolve(result)
                }
            }).catch(err => {
                reject(err)
            })
        })
    })
}

