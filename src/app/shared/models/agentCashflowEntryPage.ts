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
import { AgentCashflowEntry } from './agentCashflowEntry';
import { AgentCashflowType } from './agentCashflowType';


export interface AgentCashflowEntryPage { 
    result?: Array<AgentCashflowEntry>;
    offset?: number;
    totalLength?: number;
    reportFrom?: number;
    reportTo?: number;
    totalConsumed?: number;
    totalAmountPaid?: number;
    hasFilter?: boolean;
    types?: { [key: string]: AgentCashflowType; };
}

