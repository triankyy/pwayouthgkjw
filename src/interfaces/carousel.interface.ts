import { UserInterface } from './user.interface';

export interface CarouselInterface {
    id?: number;
    image?: string;
    label?: string;
    user?: UserInterface;
}