export function convertToSeconds(time: string): number {
    const timePattern = /^(\d+)([smhd])$/;
    const match = time.match(timePattern);

    if (!match) {
        throw new Error(`Invalid time format: ${time}`);
    }

    const value = parseInt(match[1] as string, 10);
    const unit = match[2];

    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 3600;
        case 'd':
            return value * 86400;
        default:
            throw new Error(`Invalid time unit: ${unit}`);
    }
}
