

// export function throttle(fn, options) {
//     if (typeof fn !== 'function') {
//         throw TypeError('非法参数')
//     }
//     const { wait = 200, leading = true, trailing = true } = options;

//     let lastArgs, lastInvoke, timer;

//     const invoke = () => {
//         if (!lastArgs) return
//         if (!lastInvoke) return
//         lastInvoke();
//         lastArgs = null;
//         lastInvoke = null;
//     }

//     const startTimer = () => {
//         timer = setTimeout(() => {
//             timer = null;
//             if (trailing && lastArgs) { // 如果leading true 已经被执行过了。判断trailing 是为了执行最后一次
//                 invoke()
//                 if (lastArgs) { // 这是是在trailing 执行的时候 又被调用了 所以还需要执行一次，确保最后一次永远被执行
//                     startTimer()
//                 }
//             }

//         }, wait);
//     }

//     return function (this, ...args) {
//         lastArgs = args;
//         lastInvoke = () => fn.apply(this, args)
//         if (timer) return

//         if (leading) {
//             invoke()
//         }
//         if (leading || trailing) {
//             startTimer()
//         }
//     }
// }

export function throttle(fn, options) {
    const { wait = 200, leading = false, trailing = true } = options;

    let timer = null, lastArgs = null, lastThis = null;

    const invoke = () => {
        if (!lastArgs) return
        fn.apply(lastThis, lastArgs);
    }

    return function (...args) {
        lastThis = this;
        lastArgs = args;

        if (timer) return;

        if (leading) {
            invoke()
        }
        timer = setTimeout(() => {
            timer = null;
            if (trailing && lastArgs) {
                invoke();
            }
        }, wait);
    }
}