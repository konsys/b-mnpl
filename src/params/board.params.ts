export const BOARD_PARAMS = {
  LINE_TRANSITION_TIMEOUT: 700,
  JAIL_TURNS: 3,
  JAIL_POSITION: 10,
  UN_JAIL_PRICE: 500,

  START_BONUS: 3000,
  START_PASSING_BONUS: 2000,

  BANK_PLAYER_ID: 0,
  MORTGAGE_TURNS: 3,

  INIT_MONEY: 40000,

  BRANCHES: {
    BUILD_QEUEU: true,
    ONE_BRANCH_PER_TURN: false,
  },
  // 3 hours TTl
  REDIS_TTL: 3600 * 3,
};
