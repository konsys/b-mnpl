export enum MsNames {
  USERS = 'users',
  FIELDS = 'fields',
  ACTIONS = 'actions',
  CHAT = 'chat',
  ROOMS = 'ROOMS',
}
export enum MsFieldsPatterns {
  GET_INIT_FIELDS = 'getInitFields',
  SAVE_FIELDS = 'saveFields',
  UPDATE_FIELD = 'updateField',
}

export enum MsUsersPatterns {
  GET_ALL_USERS = 'getAllUsers',
  GET_USER = 'getUser',
  GET_USERS_BY_IDS = 'getUsersByIds',
  GET_USER_BY_CREDENTIALS = 'getUserByCredentials',
  SAVE_USERS = 'saveUsers',
}

export enum MsChatPatterns {
  ADD_MESSAGE = 'addMessage',
  GET_ALL_MESSAGES = 'getAllMessages',
}

export enum MsActionsPatterns {
  INIT_PLAYERS = 'initPlayers',
}

export enum MsRoomsPatterns {
  GET_ROOMS = 'getRooms',
  CREATE_ROOM = 'createRoom',
  ADD_PLAYER = 'addPlayer',
}
