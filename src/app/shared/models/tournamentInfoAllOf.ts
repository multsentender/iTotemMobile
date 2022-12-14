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
import { TournamentCurrency } from './tournamentCurrency';
import { GameTag } from './gameTag';
import { TournamentScheduleEntry } from './tournamentScheduleEntry';


export interface TournamentInfoAllOf { 
    running?: boolean;
    scheduleTimezone?: string;
    winnerRate1?: number;
    winnerRate2?: number;
    winnerRate3?: number;
    allowPromo?: boolean;
    schedule?: Array<TournamentScheduleEntry>;
    currencies?: Array<TournamentCurrency>;
    gameTags?: Array<GameTag>;
    excludedAgents?: Array<AgentTreeNode>;
    gameTagReference?: Reference;
}

