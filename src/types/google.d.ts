// google.d.ts
export { };

declare global {


    interface GoogleOAuth2TokenClient {
        requestAccessToken: () => void;
    }

    interface TokenResponse {
        access_token: string;
    }

    interface GoogleAccountsOAuth2 {
        initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
        }) => GoogleOAuth2TokenClient;
    }

    interface GoogleAccounts {
        accounts: any;
        oauth2: GoogleAccountsOAuth2;
    }

    interface Window {
        google: GoogleAccounts;
    }



    interface Window {
        google: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string;
                        scope: string;
                        callback: (tokenResponse: {
                            access_token: string;
                            expires_in: number;
                            token_type: string;
                        }) => void;
                    }) => {
                        requestAccessToken: () => void;
                    };
                };
            };
        };
    }
}
