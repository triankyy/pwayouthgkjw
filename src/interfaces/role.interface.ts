export interface RoleInterface {
    id?: number;
    name: string;
}
export type CreateRoleInterface = Omit<RoleInterface, 'id'>;