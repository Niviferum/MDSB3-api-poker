/**
 * Actions possibles pendant un tour
 */
export enum ActionType {
  /** Se coucher */
  FOLD = 'fold',
  /** Checker */
  CHECK = 'check',
  /** Suivre */
  CALL = 'call',
  /** Relancer */
  RAISE = 'raise',
  /** Tapis */
  ALL_IN = 'all_in',
}
