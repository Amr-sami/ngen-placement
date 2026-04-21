let ready = false;

export function markReady() {
    ready = true;
}

export function isReady(): boolean {
    return ready;
}
