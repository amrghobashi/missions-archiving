export interface LoginRequest {
    email: string;
    password: string;
}

export interface Page {
    id: number;
    name: string;
    route: string | null;
}

export interface UserType {
    id: number;
    name: string;
    pages?: Page[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    user_type_id: number | null;
    user_type?: any;
    active: number;
    pages?: (Page | string)[];
    routes?: string[];
}

export interface LoginResponse {
    token: string;
    user: User;
    message?: string;
}
