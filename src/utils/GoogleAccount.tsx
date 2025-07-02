import { useEffect } from "react";
import { CLIENT_ID, SCOPES } from "@/config";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type CalendarEvent = {
  summary: string;
  start: {
    date?: string;
    dateTime?: string;
  };
};

const useGoogleCalendar = () => {
  useEffect(() => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse: TokenResponse) => {
        const accessToken = tokenResponse.access_token;
        fetchEvents(accessToken);
      },
    });

    tokenClient.requestAccessToken();
  }, []);

  const fetchEvents = async (accessToken: string) => {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfMonth}&timeMax=${endOfMonth}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data: { items: CalendarEvent[] } = await response.json();
    console.log("Events: ", data.items);
  };
};

export default useGoogleCalendar;
