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


export interface AgentCashflowEntry { 
    transactionId?: number;
    timestamp?: number;
    consumed?: number;
    amountPaid?: number;
    balance?: number;
    canceledTimestamp?: number;
    login?: string;
    comment?: string;
    type?: number;
    total?: boolean;
}

