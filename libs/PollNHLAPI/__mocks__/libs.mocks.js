import { getStartOfNextNextMonth } from "shared/helpers";

const nextMonth = getStartOfNextNextMonth();

const data = {
  dates: [
    {
      date: nextMonth.format("YYYY-MM-DD"),
      totalItems: 1,
      totalEvents: 0,
      totalGames: 1,
      totalMatches: 0,
      games: [
        {
          gameDate: nextMonth.toDate(),
          teams: {
            away: {
              leagueRecord: {
                wins: 4,
                losses: 4,
                ot: 0,
                type: "league",
              },
              score: 0,
              team: {
                id: 52,
                name: "Winnipeg Jets",
                link: "/api/v1/teams/52",
              },
            },
            home: {
              leagueRecord: {
                wins: 3,
                losses: 4,
                ot: 0,
                type: "league",
              },
              score: 0,
              team: {
                id: 28,
                name: "San Jose Sharks",
                link: "/api/v1/teams/28",
              },
            },
          },
          venue: {
            name: "SAP Center at San Jose",
            link: "/api/v1/venues/null",
          },
        },
      ],
    },
    {
      date: nextMonth.format("YYYY-MM-DD"),
      totalItems: 1,
      totalEvents: 0,
      totalGames: 1,
      totalMatches: 0,
      games: [
        {
          gameDate: nextMonth.toDate(),
          teams: {
            away: {
              leagueRecord: {
                wins: 2,
                losses: 4,
                ot: 0,
                type: "league",
              },
              score: 0,
              team: {
                id: 28,
                name: "San Jose Sharks",
                link: "/api/v1/teams/28",
              },
            },
            home: {
              leagueRecord: {
                wins: 4,
                losses: 2,
                ot: 0,
                type: "league",
              },
              score: 0,
              team: {
                id: 24,
                name: "Anaheim Ducks",
                link: "/api/v1/teams/24",
              },
            },
          },
          venue: {
            id: 5046,
            name: "Honda Center",
            link: "/api/v1/venues/5046",
          },
        },
      ],
    },
  ],
};

export default data;
