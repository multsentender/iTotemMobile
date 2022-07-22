export class MoneyUtils {
    //TEMPORARY - NOT PMA-28
    public static format(money?: number, currency?: string, currencyCode?: string) {
        return Math.abs(money || 0).toFixed(0) + currency
    }

}