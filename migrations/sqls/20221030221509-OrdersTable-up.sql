CREATE TABLE Orders (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES Users(Id),
    Quantity INTEGER,
    Status VARCHAR(50)
);

CREATE TABLE OrderProducts (
    OrderId INTEGER REFERENCES Orders(Id), 
    ProductId INTEGER REFERENCES Products(Id),
    PRIMARY KEY (OrderId, ProductId)
);