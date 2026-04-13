export function throttle(fn, options) {
    const { wait = 200, leading = true, trailing = true } = options;

    let timer = null, lastArgs = null, lastThis = null;

    const invoke = () => {
        if (!lastArgs) return;
        if (!lastThis) return;

        fn.apply(lastThis, lastArgs);

        lastArgs = null;
        lastThis = null;
    }

    return function (...args) {
        lastArgs = args;
        lastThis = this;

        if (timer) return

        if (leading) {
            invoke()
        }

        timer = setTimeout(() => {
            if (trailing && lastArgs) {
                invoke()
            }
            timer = null
        }, wait);
    }
}