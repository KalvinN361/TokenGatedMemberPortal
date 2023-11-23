declare global {
    namespace Express {
        export interface Request {
            decodedAddress?: string;
            //TODO: use Data source here instead of exporting and importing
            // dataSource?: ReturnType<typeof getDataSource>;
        }
    }
}
export {};
