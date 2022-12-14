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
import { AclPermission } from './aclPermission';


export interface BasicTreeNode { 
    prefix?: string;
    id?: number;
    label?: string;
    permissions?: Array<AclPermission>;
    /**
     * Currency sign to display in the backend for currency related fields
     */
    currencyCode?: string;
    currency?: string;
    deleted?: boolean;
    children?: Array<BasicTreeNode>;
    _c?: string;
}

