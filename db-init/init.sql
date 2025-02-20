CREATE TABLE books (
                       id SERIAL PRIMARY KEY,
                       name varchar(255) NOT NULL,
                       genre varchar(255) NOT NULL
);

INSERT INTO books (name, genre) VALUES
                                    ('2001 Space Odyssey', 'Sci-Fi'),
                                    ('Harry Potter', 'Fantasy'),
                                    ('Hercule Poirot', 'Thriller'),
                                    ('Reykjavik', 'Thriller'),
                                    ('Narnia', 'Fantasy'),
                                    ('Game of Thrones', 'Fantasy'),
                                    ('The Hobbit', 'Fantasy'),
                                    ('Interstellar', 'Sci-Fi');
