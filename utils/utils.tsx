export function delay(ms: number) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms);
    });
} 