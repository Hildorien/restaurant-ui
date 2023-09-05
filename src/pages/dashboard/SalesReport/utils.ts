import i18n from "i18n";
import { t } from "i18next";

/**
 * This method calculates the date of @numOfPastMonths months prior to @currDate
 * Examples: 
 * getDateFromPastMonthsPriorToCurrDate(1, yyyy/7/31) -> yyyy/6/30,
 * getDateFromPastMonthsPriorToCurrDate(2, yyyy/7/31) -> yyyy/5/31,
 * getDateFromPastMonthsPriorToCurrDate(1, yyyy/3/31) -> yyyy/2/28,
 * @param numOfPastMonths Number of months to be substracted from currDate
 * @param currDate Date from which it will calculate past date
 * @returns 
 */
export function getDateFromPastMonthsPriorToCurrDate(numOfPastMonths: number, currDate: Date): Date {
    const newDate = new Date(currDate.toDateString());
    const month = newDate.getMonth();
    newDate.setMonth(newDate.getMonth() - numOfPastMonths);
    while (newDate.getMonth() === month) { 
    	newDate.setDate(newDate.getDate() - 1);
    }
    return newDate;
}

export function getMaxDateFromMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate(); 
    // Day 0 from next month === Last day from current month
}

export function getComparativePercentageValue(currValue: number, pastValue: number) {
    if(pastValue === 0) {
        return 0;
    }
    const value: number = ( (currValue * 100) / pastValue ) - 100;
    return value;
}

export function getLocaleCurrencySymbol(): string {
    return '$'; //Mock only this symbol for now
}

export function isLastDayOfMonth(date: Date): boolean {
    return getMaxDateFromMonth(date.getFullYear(), date.getMonth()) === date.getDate();
}

export function toMonthName(monthNumber: number) { 
    const date = new Date();
    date.setDate(1);
    date.setMonth(monthNumber);
    return date.toLocaleString(detectLanguage(), {
        month: 'short',
    }) + '.';
}

function detectLanguage() {
    switch (i18n.language) {
        case 'es-AR':
            return 'es-ES';
        case 'en':
            return 'en-US';
    }
    return 'es-ES';
}

function hasDecimals(n: number): boolean {
    return n - Math.floor(n) !== 0;
}


export function parseNumberToLocaleCulture(value: number) : string { 
   if (hasDecimals(value)) {
        return value.toLocaleString(i18n.language, { maximumFractionDigits: 2, minimumFractionDigits: 2});
   }
   return value.toLocaleString(i18n.language, { maximumFractionDigits: 0, minimumFractionDigits: 0});
}

export function accumulatedPeriod(date: Date): string {
    return t("Accumlated") + " " + t("from") + " " + 
    new Date(date.getFullYear(), date.getMonth(),1).toLocaleDateString() + " " +
    t("to") + " " + date.toLocaleDateString();
}

export function isSameDate(dateA: Date, dateB: Date) {
    return  dateA.getFullYear() === dateB.getFullYear() && 
            dateA.getMonth() === dateB.getMonth() && 
            dateA.getDate() === dateB.getDate();
}

export function substractDays(numOfDays: number, date = new Date()): Date {
    
    date = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate());
    date.setDate(new Date(date).getDate() - numOfDays);
  
    return date;
}
/**
 * 
 * @param timeline list of toDateString() values
 * @returns list of Date representing the last day of each month from the timeline passed as parameter
 */
export function lastDayOfEachMonth(timeline: string[]) : Date[] {
    let rv: Set<string> = new Set<string>();
    for(const date of timeline) {
        if(isLastDayOfMonth(new Date(date)) && !rv.has(date)) {
            rv.add(date);
        }
    }
    return Array.from(rv).map(d => new Date(d));
}

export function lastDayOfEachMonthOfGivenYear(year: number) {
    let rv = [];
    const months = Array.from(Array(10).keys());
    for (const month of months) {
        rv.push(lastDayOfMonth(year, month));
    }
    return rv;
}

function lastDayOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 0);
}

export function capitalizeFirstLetter(word: string) { 
    const rv = word.slice();
    return rv.charAt(0).toUpperCase() + rv.slice(1);
}

export function normalizeISO8601Date(iso8601: string) {
    const iso8601Date = new Date(iso8601);
    return new Date(iso8601Date.getTime() + Math.abs(iso8601Date.getTimezoneOffset()*60000));
}