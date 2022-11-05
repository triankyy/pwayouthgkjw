import { RoleInterface } from './role.interface';
import { WilayahInterface } from './wilayah.interface';

export interface UserInterface {
    id: number;
    name: string;
    roles: RoleInterface[];
    wilayah: WilayahInterface;
    email: string;
    password: string;
}
export interface UpdateUserInterface extends Omit<UserInterface, 'roles' | 'wilayah'> {
    roles?: number[];
    wilayah?: number;
}
export type CreateUserInterface = Omit<UpdateUserInterface, 'id'>