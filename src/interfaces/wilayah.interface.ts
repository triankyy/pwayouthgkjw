export interface WilayahInterface {
    id?: number;
    name: string;
}
export type CreateWilayahInterface = Omit<WilayahInterface, 'id'>