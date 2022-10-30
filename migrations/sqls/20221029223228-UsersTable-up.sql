CREATE TABLE Users 
(
    Id SERIAL PRIMARY KEY, 
    FirstName VARCHAR(200), 
    LastName VARCHAR(200),
    Password VARCHAR,
    Email VARCHAR(100)
);