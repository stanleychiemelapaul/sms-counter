const gsm7bitChars = `@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà`;
const gsm7bitExChar = `\\^{}\\\\\\[~\\]|€`;
const gsm7bitRegExp = RegExp(`^[${gsm7bitChars}]*$`);
const gsm7bitExRegExp = RegExp(`^[${gsm7bitChars + gsm7bitExChar}]*$`);
const gsm7bitExOnlyRegExp = RegExp(`^[\\${gsm7bitExChar}]*$`);
const GSM_7BIT = 'GSM_7BIT';
const GSM_7BIT_EX = 'GSM_7BIT_EX';
const UTF16 = 'UTF16';
const messageLength: any = {
    GSM_7BIT: 160,
    GSM_7BIT_EX: 160,
    UTF16: 70,
};
const multiMessageLength: any = {
    GSM_7BIT: 153,
    GSM_7BIT_EX: 153,
    UTF16: 67,
};

function detectEncoding(text: string): string {
    switch (false) {
        case text.match(gsm7bitRegExp) === null:
            return GSM_7BIT;
        case text.match(gsm7bitExRegExp) === null:
            return GSM_7BIT_EX;
        default:
            return UTF16;
    }
}

function countGsm7bitEx(text: string): number {
    const results: string[] = [];

    for (const char of text) {
        if (char.match(gsm7bitExOnlyRegExp) !== null) {
            results.push(char);
        }
    }

    return results.length;
}

export interface ICounterResult {
    encoding: string;
    length: number;
    messages: number;
    per_message: number;
    remaining: number;
}

export function count(text: string): ICounterResult {
    const encoding = detectEncoding(text);
    let length = text.length;
    if (encoding === GSM_7BIT_EX) {
        length += countGsm7bitEx(text);
    }

    let perMessage = messageLength[encoding];
    if (length > perMessage) {
        perMessage = multiMessageLength[encoding];
    }

    const messages = Math.ceil(length / perMessage);
    let remaining = (perMessage * messages) - length;
    if (remaining === 0 && messages === 0) {
        remaining = perMessage;
    }

    return { encoding, length, per_message: perMessage, remaining, messages };
}
