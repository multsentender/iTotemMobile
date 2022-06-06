export class StringUtils {

    /**
     * Pad number with leading zeros
     * @param value integer value
     * @param len length
     * @returns 
     */
    public static padNumber(value:number, len: number) {
        if (len <= 0) {
            throw new Error("Len must be equal or greater than zero");
        }
        let negative : boolean = value < 0;
        let str : string = Math.abs(value).toFixed(0);
        while (str.length < len) {
            str = "0" + str;
        }
        return (negative ? "-" : "") + str;
    }

    public static escapeRegExp(str: string) : string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
      
    public static replaceAll(str: string, find: string, replace: string) : string {
        return str.replace(new RegExp(StringUtils.escapeRegExp(find), 'g'), replace);
    }    

    /**
     * Checks if value matched to pattern which can have "*" as any symbols
     * @param pattern pattern with asteriks
     * @param value value to match
     * @returns true if pattern matched
     */
    public static patternMatch(pattern: string, value: string) : boolean {
        pattern = StringUtils.replaceAll(pattern, ".", "\\.");
        pattern = StringUtils.replaceAll(pattern, "*", ".*");
        return new RegExp(pattern).test(value);
    }
}