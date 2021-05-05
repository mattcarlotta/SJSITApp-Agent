import { getStartOfNextNextMonth } from "~helpers";
import { eventFormat } from "~utils/dateFormats";
import { TNHLResponseData } from "~types";

const nextMonth = getStartOfNextNextMonth();

const data = {
  copyright:
    "NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2021. All Rights Reserved.",
  totalItems: 15,
  totalEvents: 0,
  totalGames: 15,
  totalMatches: 0,
  wait: 10,
  dates: [
    {
      date: nextMonth.format(eventFormat),
      totalItems: 1,
      totalEvents: 0,
      totalGames: 1,
      totalMatches: 0,
      games: [
        {
          gamePk: 2020020584,
          link: "/api/v1/game/2020020584/feed/live",
          gameType: "R",
          season: "20202021",
          gameDate: nextMonth.format(),
          teams: {
            away: {
              leagueRecord: {
                wins: 4,
                losses: 4,
                ot: 0,
                type: "league"
              },
              score: 0,
              team: {
                id: 52,
                name: "Winnipeg Jets",
                link: "/api/v1/teams/52"
              }
            },
            home: {
              leagueRecord: {
                wins: 3,
                losses: 4,
                ot: 0,
                type: "league"
              },
              score: 0,
              team: {
                id: 28,
                name: "San Jose Sharks",
                link: "/api/v1/teams/28"
              }
            }
          },
          venue: {
            name: "SAP Center at San Jose",
            link: "/api/v1/venues/null"
          },
          content: {
            link: "/api/v1/game/2020020584/content"
          }
        }
      ]
    },
    {
      date: nextMonth.format(eventFormat),
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
                type: "league"
              },
              score: 0,
              team: {
                id: 28,
                name: "San Jose Sharks",
                link: "/api/v1/teams/28"
              }
            },
            home: {
              leagueRecord: {
                wins: 4,
                losses: 2,
                ot: 0,
                type: "league"
              },
              score: 0,
              team: {
                id: 24,
                name: "Anaheim Ducks",
                link: "/api/v1/teams/24"
              }
            }
          },
          venue: {
            id: 5046,
            name: "Honda Center",
            link: "/api/v1/venues/5046"
          },
          content: {
            link: "/api/v1/game/2020020584/content"
          }
        }
      ]
    }
  ]
} as TNHLResponseData;

export default data;
