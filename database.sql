DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS  password_reset_codes;
DROP TABLE IF EXISTS  friendships;
DROP TABLE IF EXISTS  chats;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  first VARCHAR(255) NOT NULL,
  last VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  bio VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE password_reset_codes
(
  id SERIAL PRIMARY KEY,
  code VARCHAR,
  email VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships
(
  id SERIAL PRIMARY KEY,
  receiver_id INT NOT NULL REFERENCES users(id),
  sender_id INT NOT NULL REFERENCES users(id),
  accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats
(
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id),
  message_text VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);