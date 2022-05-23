/**
 * API for mobile admin UI.
 * REST bridge for GWT admin API.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface AgentInfoAllOf { 
    balance?: number;
    overdraft?: number;
    overdraftExpirationDate?: number;
    lastPaid?: number;
    collectFromSubAgents?: number;
    dealerBalance?: number;
    dealerCode?: string;
    skin?: string;
    language?: string;
    currencyFormat?: string;
    excludeFromTournaments?: boolean;
    excludeFromJackpots?: boolean;
    assistanceURL?: string;
    assistancePhone?: string;
    /**
     * Cashback bonus config: cashback % and wager requirement
     */
    cashbackPercent?: number;
    cashbackWR?: number;
    cashierAmounts?: Array<number>;
    canViewStructure?: boolean;
    extraFields?: { [key: string]: string; };
}

