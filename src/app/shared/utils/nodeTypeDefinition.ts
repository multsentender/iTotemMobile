import { BasicTreeNode } from "@shared/models/basicTreeNode";

export const isAgent = (node: BasicTreeNode): boolean => {
	return node._c === 'AgentTreeNode' || node._c === 'AgentInfo'
}

export const isRoom = (node: BasicTreeNode): boolean => {
	return node._c === 'RoomTreeNode' || node._c === 'RoomInfo'
}

export const isKiosk = (node: BasicTreeNode): boolean => {
	return node._c === 'KioskTreeNode' || node._c === 'KioskInfo'
}
