declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATA_PROXY_URL: string;
            DATABASE_URL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
        }
    }
}

export {}
