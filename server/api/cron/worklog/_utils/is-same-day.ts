export function isSameDay(date1?: Date, date2?: Date): boolean {
    if (!date1 || !date2) return false;

    return date1.toDateString() === date2.toDateString();
}
