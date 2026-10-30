import type { ObjectId } from "mongodb";

export const UserRole = {
    ADMIN: "ADMIN",
    DOCTOR: "DOCTOR",
    PATIENT: "PATIENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED"
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface User {
    _id: ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterUser {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}