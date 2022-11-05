import { UserInterface } from './user.interface';

export type AuthInterface = Pick<UserInterface, 'email' | 'password'>;