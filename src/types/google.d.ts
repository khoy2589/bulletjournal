export { };

declare global {
    interface TokenResponse {
        access_token: string;
        expires_in: number;
        token_type: string;
    }

    interface GoogleOAuth2TokenClient {
        requestAccessToken: () => void;
    }

    interface GoogleAccountsOAuth2 {
        initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
        }) => GoogleOAuth2TokenClient;
    }

    interface Window {
        google: {
            accounts: {
                oauth2: GoogleAccountsOAuth2;
            };
        };
    }
}
