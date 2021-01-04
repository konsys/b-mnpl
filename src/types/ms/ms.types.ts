export enum MsNames {
  USERS = 'users',
  FIELDS = 'fields',
  ACTIONS = 'actions',
  CHAT = 'chat',
  ROOMS = 'rooms',
  INVENTORY = 'inventory',
}
export enum MsFieldsPatterns {
  GET_INIT_FIELDS = 'getInitFields',
  SAVE_FIELDS = 'saveFields',
  UPDATE_FIELD = 'updateField',
  GET_FIELDS_BY_IDS = 'getFieldsByIds',
}

export enum MsUsersPatterns {
  GET_ALL_USERS = 'getAllUsers',
  GET_USER = 'getUser',
  GET_USERS_BY_IDS = 'getUsersByIds',
  GET_USERS_BY_EMAIL = 'getUsersByEmail',
  GET_USER_BY_CREDENTIALS = 'getUserByCredentials',
  SAVE_USERS = 'saveUsers',
  SAVE_USER = 'saveUser',
  UPDATE_USER = 'updateUser',
  ACTIVATE_USER = 'activateUser',
  SAVE_REFRESH_TOKEN = 'saveRefreshToken',
  GET_REFRESH_TOKEN = 'getRefreshToken',
  DELETE_REFRESH_TOKEN = 'deleteRefreshToken',
}

export enum MsChatPatterns {
  ADD_MESSAGE = 'addMessage',
  GET_ALL_MESSAGES = 'getAllMessages',
}

export enum MsActionsPatterns {
  INIT_PLAYERS = 'initPlayers',
}

export enum MsRoomsPatterns {
  DELETE_ROOMS = 'deleteRooms',
  GET_ROOM = 'getRoom',
  GET_ROOMS = 'getRooms',
  CREATE_ROOM = 'createRoom',
  ADD_PLAYER = 'addPlayer',
  REMOVE_PLAYER = 'removePlayer',
  PLAYER_SURRENDER = 'playerSurrender',
}

export enum MsInventoryPatterns {
  GET_USER_FIELDS = 'getUserFields',
  ADD_INVENTORY = 'addInventory',
}
