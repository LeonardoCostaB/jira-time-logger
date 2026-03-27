export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const hoursStr = hours > 0 ? `${hours}h ` : '';
    const minutesStr = minutes > 0 ? `${minutes}m ` : '';
    const secondsStr = secs > 0 ? `${secs}s` : '';
    return `${hoursStr}${minutesStr}${secondsStr}`.trim();
}

export function formatToDays(seconds: number, registerPerDay: number): string {
    const days = Math.floor(seconds / registerPerDay);
    const daysStr = days > 0 ? `${days}d ` : '';

    if (days === 1) {
        return '1d';
    } else if (days > 1) {
        return `${days}d`;
    }

    return daysStr;
}
