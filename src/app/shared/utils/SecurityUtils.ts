import { AclPermission, BasicTreeNode } from "@shared/models/models";


export const hasPermission = (node: BasicTreeNode, permission: AclPermission): boolean => {
	if(!node.permissions || node.permissions.length <= 0) {
		return false
	}

	return node.permissions.includes(permission)
}

export const somePermissions = (node: BasicTreeNode, permissions: AclPermission[]): boolean => {
	if(!node.permissions || node.permissions.length <= 0) {
		return false
	}

	return node.permissions.some((val) => permissions.includes(val))
}

export const everyPermissions = (node: BasicTreeNode, permissions: AclPermission[]): boolean => {
	if(!node.permissions || node.permissions.length <= 0) {
		return false
	}

	return permissions.every((val) => node.permissions?.includes(val))
}
