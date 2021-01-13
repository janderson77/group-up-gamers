DROP DATABASE IF EXISTS groupupgamers_db;
CREATE DATABASE groupupgamers_db;

\c groupupgamers_db;

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(20) NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    discord_url TEXT,
    profile_img_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    UNIQUE(username, email)
);

CREATE TABLE games (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_name TEXT NOT NULL,
    slug TEXT,
    cover_art TEXT,
    summary TEXT,
    platforms INTEGER[],
    game_modes INTEGER[]
);

CREATE TABLE games_playing (
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    game_id INTEGER REFERENCES games ON DELETE CASCADE,
    in_game_name TEXT
);

CREATE TABLE groups (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    group_name TEXT UNIQUE NOT NULL,
    group_slug TEXT UNIQUE NOT NULL,
    group_game_id INTEGER NOT NULL REFERENCES games ON DELETE CASCADE,
    group_owner_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    group_discord_url TEXT,
    group_logo_url TEXT
);

CREATE TABLE group_members (
    group_id INTEGER REFERENCES groups ON DELETE CASCADE,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    is_group_admin BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false
);

CREATE TABLE group_messages (
    message_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message_user_id INTEGER REFERENCES users ON DELETE CASCADE,
    message_group_id INTEGER REFERENCES groups ON DELETE CASCADE,
    message_body TEXT NOT NULL,
    posted_at DATE DEFAULT NOW()
);

CREATE TABLE game_modes (
    mode_id integer PRIMARY KEY,
    mode_name TEXT,
    mode_slug TEXT
);

CREATE TABLE platforms (
    platform_id INTEGER PRIMARY KEY,
    abbreviation TEXT,
    alternative_name TEXT,
    platform_name TEXT
);