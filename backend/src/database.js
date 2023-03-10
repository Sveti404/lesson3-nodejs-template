const Sequelize = require('sequelize');

// Initialize local database file
const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: './db/chat.sqlite',
});

// Initialize chat table with a required (not null)
// text field "message"
const Chat = sequelize.define('chats', {
  message: {
    // Message field is a string
    type: Sequelize.TEXT,
    // Disallows creating chat entries without a message
    allowNull: false,
  },
  nickname: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  room: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Export the sequelize instance
exports.sequelize = sequelize

// Export the sequelize model to be used in asynchronous middleware
exports.Chat = Chat;
