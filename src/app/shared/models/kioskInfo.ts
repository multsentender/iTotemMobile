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
import { KioskTreeNode } from './kioskTreeNode';
import { AclPermission } from './aclPermission';
import { BasicTreeNode } from './basicTreeNode';
import { KioskInfoAllOf } from './kioskInfoAllOf';
import { KioskToken } from './kioskToken';


export interface KioskInfo extends KioskTreeNode { 
    activeGameName?: string;
    gameStartedTs?: number;
    balance?: number;
    login?: string;
    password?: string;
    certSN?: string;
    zipBuySN?: string;
    prepaidCard?: number;
    settingsJson?: string;
    created?: number;
    reloaderCode?: string;
    userAgent?: string;
    certificateKioskId?: number;
    linkedKiosk?: KioskInfo;
    linkedToKiosk?: KioskInfo;
    keywords?: Array<string>;
    cashierAmounts?: Array<number>;
    activeToken?: KioskToken;
    cashbackBonusPercent?: number;
}

