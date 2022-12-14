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
import { AclRoleLocalization } from './aclRoleLocalization';
import { AclRoleType } from './aclRoleType';
import { TreeNodeType } from './treeNodeType';
import { AclRoleNodeSubType } from './aclRoleNodeSubType';


export interface AclRole { 
    roleId?: number;
    roleName?: string;
    type?: AclRoleType;
    nodeType?: TreeNodeType;
    nodeSubType?: AclRoleNodeSubType;
    localizedName?: string;
    localizedDescription?: string;
    requireOtp?: boolean;
    permissions?: Array<AclPermission>;
    directSubAgentPermissions?: Array<AclPermission>;
    allSubAgentPermissions?: Array<AclPermission>;
    defaultForAgents?: Array<number>;
    localization?: AclRoleLocalization;
}

