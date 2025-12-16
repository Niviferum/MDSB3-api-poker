/**
 * Représente les états possibles d'une table de poker
 */
export enum TableStatus {
  /** Partie en attente de joueurs */
  WAITING = 'waiting',
  /** Partie en cours, les joueurs jouent activement */
  PLAYING = 'playing',
  /** Partie terminée, statistiques enregistrées */
  FINISHED = 'finished',
}