/**
 * Statut d'une table de poker
 */
export enum TableStatus {
  /** Partie en attente de joueurs */
  WAITING = 'waiting',
  /** Partie en cours */
  PLAYING = 'playing',
  /** Partie terminee */
  FINISHED = 'finished',
}
