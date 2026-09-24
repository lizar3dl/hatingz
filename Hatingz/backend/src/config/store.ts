import type { Match, Player, Team, User, Lineup, LineupVote, ExpulsionVote } from '../models';

export const teams: Team[] = [
  { id: 'team-palmeiras', name: 'Palmeiras', slug: 'palmeiras', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
  { id: 'team-bahia', name: 'Bahia', slug: 'bahia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Escudo_do_Bahia.svg' },
  { id: 'team-corinthians', name: 'Corinthians', slug: 'corinthians', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Corinthians_simbolo.svg' },
  { id: 'team-sao-paulo', name: 'São Paulo', slug: 'sao-paulo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Sao_Paulo_FC_logo.svg' },
  { id: 'team-vasco', name: 'Vasco', slug: 'vasco', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/CR_Vasco_da_Gama.svg' },
];

export const players: Player[] = [
  { id: 'palmeiras-1', teamId: 'team-palmeiras', name: 'Weverton', shirtNumber: 12, position: 'GOL' },
  { id: 'palmeiras-2', teamId: 'team-palmeiras', name: 'Marcos Rocha', shirtNumber: 2, position: 'LD' },
  { id: 'palmeiras-3', teamId: 'team-palmeiras', name: 'Murilo', shirtNumber: 15, position: 'ZAG' },
  { id: 'palmeiras-4', teamId: 'team-palmeiras', name: 'Gustavo Gómez', shirtNumber: 15, position: 'ZAG' },
  { id: 'palmeiras-5', teamId: 'team-palmeiras', name: 'Zé Rafael', shirtNumber: 8, position: 'VOL' },
  { id: 'palmeiras-6', teamId: 'team-palmeiras', name: 'Aníbal Moreno', shirtNumber: 30, position: 'VOL' },
  { id: 'palmeiras-7', teamId: 'team-palmeiras', name: 'Rony', shirtNumber: 9, position: 'ATA' },
  { id: 'palmeiras-8', teamId: 'team-palmeiras', name: 'Estêvão', shirtNumber: 41, position: 'ATA' },
  { id: 'palmeiras-9', teamId: 'team-palmeiras', name: 'Raphael Veiga', shirtNumber: 23, position: 'MEI' },
  { id: 'palmeiras-10', teamId: 'team-palmeiras', name: 'Flaco López', shirtNumber: 19, position: 'ATA' },
  { id: 'palmeiras-11', teamId: 'team-palmeiras', name: 'José Manuel', shirtNumber: 28, position: 'ATA' },
  { id: 'bahia-1', teamId: 'team-bahia', name: 'Marcos Felipe', shirtNumber: 1, position: 'GOL' },
  { id: 'bahia-2', teamId: 'team-bahia', name: 'Cicinho', shirtNumber: 2, position: 'LD' },
  { id: 'bahia-3', teamId: 'team-bahia', name: 'Gabriel Xavier', shirtNumber: 5, position: 'ZAG' },
  { id: 'bahia-4', teamId: 'team-bahia', name: 'Kanu', shirtNumber: 13, position: 'ZAG' },
  { id: 'bahia-5', teamId: 'team-bahia', name: 'Ademir', shirtNumber: 6, position: 'VOL' },
  { id: 'bahia-6', teamId: 'team-bahia', name: 'Everaldo', shirtNumber: 11, position: 'VOL' },
  { id: 'bahia-7', teamId: 'team-bahia', name: 'Breno', shirtNumber: 7, position: 'MEI' },
  { id: 'bahia-8', teamId: 'team-bahia', name: 'Thaciano', shirtNumber: 17, position: 'ATA' },
  { id: 'bahia-9', teamId: 'team-bahia', name: 'Luciano Juba', shirtNumber: 9, position: 'ATA' },
  { id: 'bahia-10', teamId: 'team-bahia', name: 'Cauly', shirtNumber: 21, position: 'ATA' },
  { id: 'bahia-11', teamId: 'team-bahia', name: 'Rafael Ratão', shirtNumber: 22, position: 'ATA' },
  { id: 'corinthians-1', teamId: 'team-corinthians', name: 'Cássio', shirtNumber: 12, position: 'GOL' },
  { id: 'corinthians-2', teamId: 'team-corinthians', name: 'Fagner', shirtNumber: 23, position: 'LD' },
  { id: 'corinthians-3', teamId: 'team-corinthians', name: 'Gil', shirtNumber: 3, position: 'ZAG' },
  { id: 'corinthians-4', teamId: 'team-corinthians', name: 'Bruno Méndez', shirtNumber: 4, position: 'ZAG' },
  { id: 'corinthians-5', teamId: 'team-corinthians', name: 'Raniele', shirtNumber: 6, position: 'VOL' },
  { id: 'corinthians-6', teamId: 'team-corinthians', name: 'José Martínez', shirtNumber: 8, position: 'MEI' },
  { id: 'corinthians-7', teamId: 'team-corinthians', name: 'Yuri Alberto', shirtNumber: 9, position: 'ATA' },
  { id: 'corinthians-8', teamId: 'team-corinthians', name: 'Matheuzinho', shirtNumber: 29, position: 'LD' },
  { id: 'corinthians-9', teamId: 'team-corinthians', name: 'Pedro', shirtNumber: 7, position: 'ATA' },
  { id: 'corinthians-10', teamId: 'team-corinthians', name: 'Róger Guedes', shirtNumber: 10, position: 'MEI' },
  { id: 'corinthians-11', teamId: 'team-corinthians', name: 'Deivid', shirtNumber: 11, position: 'ATA' },
  { id: 'sao-paulo-1', teamId: 'team-sao-paulo', name: 'Rafael', shirtNumber: 1, position: 'GOL' },
  { id: 'sao-paulo-2', teamId: 'team-sao-paulo', name: 'Auro', shirtNumber: 2, position: 'LD' },
  { id: 'sao-paulo-3', teamId: 'team-sao-paulo', name: 'Arboleda', shirtNumber: 3, position: 'ZAG' },
  { id: 'sao-paulo-4', teamId: 'team-sao-paulo', name: 'Sabino', shirtNumber: 4, position: 'ZAG' },
  { id: 'sao-paulo-5', teamId: 'team-sao-paulo', name: 'James Rodr?guez', shirtNumber: 5, position: 'VOL' },
  { id: 'sao-paulo-6', teamId: 'team-sao-paulo', name: 'Paulinho', shirtNumber: 7, position: 'MEI' },
  { id: 'sao-paulo-7', teamId: 'team-sao-paulo', name: 'Luciano', shirtNumber: 9, position: 'ATA' },
  { id: 'sao-paulo-8', teamId: 'team-sao-paulo', name: 'Alvarez', shirtNumber: 11, position: 'ATA' },
  { id: 'sao-paulo-9', teamId: 'team-sao-paulo', name: 'Wesley', shirtNumber: 14, position: 'ATA' },
  { id: 'sao-paulo-10', teamId: 'team-sao-paulo', name: 'Calleri', shirtNumber: 18, position: 'ATA' },
  { id: 'sao-paulo-11', teamId: 'team-sao-paulo', name: 'Moreira', shirtNumber: 30, position: 'ATA' },
  { id: 'vasco-1', teamId: 'team-vasco', name: 'Léo Jardim', shirtNumber: 1, position: 'GOL' },
  { id: 'vasco-2', teamId: 'team-vasco', name: 'João Victor', shirtNumber: 2, position: 'LD' },
  { id: 'vasco-3', teamId: 'team-vasco', name: 'Lucas Oliveira', shirtNumber: 3, position: 'ZAG' },
  { id: 'vasco-4', teamId: 'team-vasco', name: 'Marlon', shirtNumber: 4, position: 'ZAG' },
  { id: 'vasco-5', teamId: 'team-vasco', name: 'Zeca', shirtNumber: 5, position: 'VOL' },
  { id: 'vasco-6', teamId: 'team-vasco', name: 'Gum', shirtNumber: 8, position: 'MEI' },
  { id: 'vasco-7', teamId: 'team-vasco', name: 'Tchê Tchê', shirtNumber: 10, position: 'MEI' },
  { id: 'vasco-8', teamId: 'team-vasco', name: 'Pablo Vegetti', shirtNumber: 9, position: 'ATA' },
  { id: 'vasco-9', teamId: 'team-vasco', name: 'Rayan', shirtNumber: 11, position: 'ATA' },
  { id: 'vasco-10', teamId: 'team-vasco', name: 'Erick', shirtNumber: 19, position: 'ATA' },
  { id: 'vasco-11', teamId: 'team-vasco', name: 'Jair', shirtNumber: 27, position: 'ATA' },
];

export const users: User[] = [];
export const matches: Match[] = [
  { id: 'match-corinthians-bahia', homeTeamId: 'team-corinthians', awayTeamId: 'team-bahia', homeScore: 1, awayScore: 1, status: 'scheduled', startsAt: '2026-09-22T20:00:00-03:00' },
  { id: 'match-palmeiras-sao-paulo', homeTeamId: 'team-palmeiras', awayTeamId: 'team-sao-paulo', homeScore: 2, awayScore: 0, status: 'live', startsAt: '2026-09-21T18:00:00-03:00' },
  { id: 'match-vasco-corinthians', homeTeamId: 'team-vasco', awayTeamId: 'team-corinthians', homeScore: 0, awayScore: 2, status: 'finished', startsAt: '2026-09-20T16:00:00-03:00' },
  { id: 'match-bahia-vasco', homeTeamId: 'team-bahia', awayTeamId: 'team-vasco', homeScore: 0, awayScore: 1, status: 'finished', startsAt: '2026-09-18T15:30:00-03:00' },
];

export const lineups: Lineup[] = [];
export const lineupVotes: LineupVote[] = [];
export const expulsionVotes: ExpulsionVote[] = [];

