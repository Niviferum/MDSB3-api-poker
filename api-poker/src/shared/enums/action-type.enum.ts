export enum ActionType {
  /** Se coucher - abandonner la main */
  FOLD = 'fold',
  /** Checker - ne pas miser mais rester en jeu */
  CHECK = 'check',
  /** Suivre - égaler la mise en cours */
  CALL = 'call',
  /** Relancer - augmenter la mise en cours */
  RAISE = 'raise',
  /**Tapis - miser tous ses jetons */ 
  ALL_IN = 'all_in',
}