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
import { AgentTreeNode } from './agentTreeNode';
import { Reference } from './reference';
import { GameTag } from './gameTag';
import { JackpotLevelInfo } from './jackpotLevelInfo';


export interface JackpotInfoAllOf { 
    levels?: Array<JackpotLevelInfo>;
    gameTags?: Array<GameTag>;
    excludedAgents?: Array<AgentTreeNode>;
    gameTagReference?: Reference;
}

