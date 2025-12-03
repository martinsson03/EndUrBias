export function EncodeB64FromUint8Array(input: Uint8Array): string {
    let bytes: Uint8Array = input;

    let binary = '';
    const chunkSize = 0x8000; // Avoid stack overflow on large files
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }

    return btoa(binary);
}

export function EncodeB64FromString(input: string): string {
    let bytes: Uint8Array = new TextEncoder().encode(input);

    let binary = '';
    const chunkSize = 0x8000; // Avoid stack overflow on large files
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }

    return btoa(binary);
}

export function DecodeB64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export function DecodeB64ToString(base64: string): string {
    const bytes = DecodeB64ToUint8Array(base64);
    return new TextDecoder().decode(bytes);
}