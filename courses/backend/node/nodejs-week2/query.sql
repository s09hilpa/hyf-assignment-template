CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  confirmed_at DATETIME DEFAULT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  token TEXT UNIQUE
);

CREATE TABLE snippets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  contents TEXT NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
);

INSERT INTO users (first_name, last_name, email, token, confirmed_at)
VALUES
('Aiko', 'Tanaka', 'aiko.tanaka@example.com', 'tok123', '2025-01-12 10:30:00'),
('Mateo', 'García', 'mateo.garcia@example.com', 'mad456', '2025-02-18 14:22:00'),
('Liam', "O'Connor", 'liam.oconnor@example.com', 'dub789', '2025-03-09 09:45:00'),
('Fatima', 'Al-Sayed', 'fatima.alsayed@example.com', 'cai321', '2025-04-01 16:15:00'),
('Zanele', 'Khumalo', 'zanele.khumalo@example.com', 'jhb654', NULL); -- Not yet confirmed


INSERT INTO snippets (user_id, title, contents, is_private)
VALUES
(1, 'Async in Python', 'A quick guide to using asyncio for concurrent tasks.', 0),
(1, 'SQL Basics', 'An introduction to SELECT, WHERE, and JOIN in SQL.', 1),

(2, 'React Hooks', 'Explaining useState and useEffect with examples.', 0),
(2, 'Docker 101', 'Setting up containers for web apps.', 1),
(2, 'Node.js Tips', 'Best practices for writing clean async code.', 0),

(3, 'Rust Ownership', 'A simple explanation of the ownership model.', 0),
(3, 'Linux Commands', 'Common shell commands for beginners.', 1),

(4, 'CSS Grid Layout', 'How to build responsive layouts with CSS Grid.', 0),
(4, 'Tailwind Shortcuts', 'Useful utility classes for quick design.', 1),
(4, 'Flask REST API', 'Creating a small REST API in Flask.', 0);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
SELECT * FROM tags;

INSERT INTO tags (name) VALUES ("javascript");
INSERT INTO tags (name) VALUES ("backend");

CREATE TABLE snippets_tags (
  snippet_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (snippet_id, tag_id),
  FOREIGN KEY (snippet_id) REFERENCES snippets(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

INSERT INTO snippets_tags (snippet_id, tag_id) VALUES (3, 1);
INSERT INTO snippets_tags (snippet_id, tag_id) VALUES (5, 2);

SELECT * FROM snippets_tags;
SELECT * FROM users;