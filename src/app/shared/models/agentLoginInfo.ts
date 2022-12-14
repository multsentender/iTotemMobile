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
import { AclRole } from './aclRole';


/**
 * TODO: Use this class to store roles inside Main and re-implement hasRole
 */
export interface AgentLoginInfo { 
    userId?: number;
    originalLogin?: string;
    login?: string;
    email?: string;
    roleId?: number;
    agentId?: number;
    agentName?: string;
    roomId?: number;
    roomName?: string;
    aclId?: number;
    passwordExpired?: boolean;
    deleted?: boolean;
    createdTimestamp?: number;
    createdLogin?: string;
    lastUpdatedTimestamp?: number;
    lastUpdatedLogin?: string;
    lastLoginTimestamp?: number;
    hasOtp?: boolean;
    clearOtpSecretKey?: boolean;
    canEdit?: boolean;
    canViewIp?: boolean;
    canEditLoginInfo?: boolean;
    role?: AclRole;
    password?: string;
    dirty?: boolean;
}

