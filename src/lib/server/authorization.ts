import type { User } from './db/schema';

// Define role types for TypeScript
export type UserRole = 'admin' | 'facadmin' | 'student';

/**
 * Check if a user has admin role
 * @param user - The user object
 * @returns boolean indicating if user is admin
 */
export function isAdmin(user: User | null): user is User & { role: 'admin' } {
	return user?.role === 'admin';
}

/**
 * Check if a user has facadmin role
 * @param user - The user object
 * @returns boolean indicating if user is facadmin
 */
export function isFacAdmin(user: User | null): user is User & { role: 'facadmin' } {
	return user?.role === 'facadmin';
}

/**
 * Check if a user has student role
 * @param user - The user object
 * @returns boolean indicating if user is student
 */
export function isStudent(user: User | null): user is User & { role: 'student' } {
	return user?.role === 'student';
}

/**
 * Check if a user has one of the specified roles
 * @param user - The user object
 * @param roles - Array of roles to check against
 * @returns boolean indicating if user has any of the specified roles
 */
export function hasRole(user: User | null, roles: UserRole[]): boolean {
	if (!user) return false;
	return roles.includes(user.role as UserRole);
}

/**
 * Check if a user has admin or facadmin role
 * @param user - The user object
 * @returns boolean indicating if user is admin or facadmin
 */
export function isAdminOrFacAdmin(user: User | null): boolean {
	return isAdmin(user) || isFacAdmin(user);
}

/**
 * Check if a user has admin or student role
 * @param user - The user object
 * @returns boolean indicating if user is admin or student
 */
export function isAdminOrStudent(user: User | null): boolean {
	return isAdmin(user) || isStudent(user);
}

/**
 * Check if a user has facadmin or student role
 * @param user - The user object
 * @returns boolean indicating if user is facadmin or student
 */
export function isFacAdminOrStudent(user: User | null): boolean {
	return isFacAdmin(user) || isStudent(user);
}