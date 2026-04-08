
export const useThrottleFn = <T>(fn: (...args: T[]) => unknown, options) => {

    const { wait = 1000, leading = false } = options;
    let timer = null;
    console.log(wait);
    
    const run = (...args: T[]) => {
        if (timer) return
        fn(...args);
        timer = setTimeout(() => {
            timer = null
        }, wait);
    }

    return {
        run
    }

}