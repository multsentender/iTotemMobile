import { Money } from '@shared/models/money';
import {Big} from 'big.js';

export class MoneyFormat {
    multplier: Big = new Big(0.01);
    decimalPoints: number = 2; 
    decimalSeparator: string = '.';
    groupingSeparator: string = ' ';
    groupingSize: number = 3;
    groupingRegExp: RegExp | undefined;
    currencySignPosition: string = 'left';
    currencySignSeparator: string = '';
    currencySign: string = '?';

    public formatCents(cents?: number, hideCurrencySign: boolean = false): string {
        if (cents == null) {
            return "-";
        }
        this.init();
        let money : number = new Big(cents).mul(this.multplier)
            .round(this.decimalPoints, Big.roundHalfEven)
            .toNumber();
        let ret : string = 
            money.toFixed(this.decimalPoints)
            .replace('.', this.decimalSeparator);
        if (this.groupingRegExp != null) {
            ret = ret.replace(this.groupingRegExp, this.groupingSeparator);
        }            
        if (!hideCurrencySign) {
            if (this.currencySignPosition == 'left') {
                ret = this.currencySign + this.currencySignSeparator + ret;
            } else {
                ret = ret + this.currencySign + this.currencySignSeparator;
            }
        }
        return ret;
    }

    public formatMoney(money?: Money, promo: boolean = false, hideCurrencySign: boolean = false) {
        if (money == null) {
            return "-";
        }
        return this.formatCents((promo) ? money.promo : money.cashable, hideCurrencySign);
    }

    init() : void {
        if (this.groupingRegExp == null && this.groupingSize > 0 && this.groupingSeparator.length > 0) {
            this.groupingRegExp = new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g");
        }
    }
}

export class MoneyUtils {

    private static currencyFormats : Map<string, MoneyFormat> = new Map<string, MoneyFormat>();

    /**
     * Formats cents value into string
     * @param cents money in cents
     * @param currency currency sign
     * @param currencyCode currency ISO code
     * @param hideCurrencySign true if need to hide currency sign
     * @returns formated money value
     */
    public static format(cents?: number, currency?: string, currencyCode?: string, hideCurrencySign: boolean = false) {
        return MoneyUtils.getMoneyFormat(currency, currencyCode).formatCents(cents, hideCurrencySign);
    }

    /**
     * Converts money cents into points for agent balance
     * @param cents money in cents
     * @param rate rate value from 0.001 to 1. It must be greate then 0.
     * @returns whole number of points
     */
    public static moneyToPoints(cents: number, rate: number, currency?: string, currencyCode?: string) : number {
        if (rate <= 0) {
            throw new Error("Invalid attempt to convert balance to points for zero rate");
        }
        let rd : Big = MoneyUtils.normalizeRate(rate);
        if (rd.toNumber() <= 0) {
            throw new Error("Invalid attempt to convert balance to points for zero rate");
        }
        let format: MoneyFormat = MoneyUtils.getMoneyFormat(currency, currencyCode);
        let d : Big = new Big(cents).mul(format.multplier).div(rd);
        return d.round(0, Big.roundHalfEven).toNumber();            
    }

    /**
     * Converts points into money cents for agent balance
     * @param points points value
     * @param rate rate value from 0.001 to 1. It must be greate then 0.
     * @param currency currency sign
     * @param currencyCode currency ISO code
     * @returns whole cents value
     */
     public static pointsToMoney(points: number, rate: number, currency?: string, currencyCode?: string) : number {
        if (rate <= 0) {
            throw new Error("Invalid attempt to convert balance to points for zero rate");
        }
        let rd : Big = MoneyUtils.normalizeRate(rate);
        if (rd.toNumber() <= 0) {
            throw new Error("Invalid attempt to convert balance to points for zero rate");
        }
        let format: MoneyFormat = MoneyUtils.getMoneyFormat(currency, currencyCode);
        let d : Big = new Big(points).mul(rd.toNumber()).div(format.multplier);
        return d.round(0, Big.roundHalfEven).toNumber();            
    }

    /**
     * Formats points values
     * @param points points value
     * @param currency currency sign
     * @param currencyCode currency ISO code
     * @param hidePointsSign true if Pts sign should be hidden
     */
    public static formatPoints(points: number, currency?: string, currencyCode?: string, hidePointsSign : boolean = false) : string {
        let format: MoneyFormat = MoneyUtils.getMoneyFormat(currency, currencyCode);
        let ret : string = new Big(points).round(0, Big.roundHalfEven).toString();
        if (format.groupingRegExp != null) {
            ret = ret.replace(format.groupingRegExp, format.groupingSeparator);
        }
        if (!hidePointsSign) {
            if (format.currencySignPosition == 'left') {
                ret = 'Pts ' + ret;
            } else {
                ret = ret + ' Pts';
            }
        }
        return ret;
    }


    /**
     * Gets money format for specified currency
     * @param currency currency sign
     * @param currencyCode currency ISO code
     * @returns MoneyFormat which allows to format cents in more easy way rather than call of MoneyUtils.format
     */
    public static getMoneyFormat(currency?: string, currencyCode?: string) : MoneyFormat {
        if (currencyCode == null) {
            currencyCode = "?";
        }
        if (currency == null) {
            currency = "?";
        }
        let format: MoneyFormat | undefined = MoneyUtils.currencyFormats.get(currencyCode);
        if (format == null) {
            format = new MoneyFormat();
            format.currencySign = currency;
            format.init();
            MoneyUtils.currencyFormats.set(currencyCode, format);
        }
        return format;
    }


    public static normalizeRate(rate: number) : Big {
        return new Big(rate).round(4, Big.roundHalfEven);
    }
}

