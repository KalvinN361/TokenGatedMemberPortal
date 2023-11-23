import { Base } from './Base';

export interface Company extends Base {
    name: string;
    description: string;
    database: string;
    domain: string;
    heroImage: string;
}
