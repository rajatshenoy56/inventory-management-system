CREATE TABLE company(id SERIAL PRIMARY KEY,  
name VARCHAR,
email VARCHAR,
address VARCHAR,
phone INTEGER,
gst VARCHAR,
no_of_godowns INTEGER DEFAULT 0);