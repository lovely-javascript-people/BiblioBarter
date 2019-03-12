DROP DATABASE IF EXISTS bibliobarter;
CREATE DATABASE bibliobarter;

-- example, follow this to create our db;
-- psql -h hostname -d databasename -U username -f file.sql
-- command to get into our db 
-- -U postgres part is where we are specifying that we want to connect with the postgres role.
-- psql -U postgres -d bibliobarter
-- 
USE bibliobarter;

-- USER table to hold user's information
CREATE TABLE user {
  id_user SERIAL,
  username VARCHAR(30),
  id_school SERIAL,
  address VARCHAR(50),
  email VARCHAR(30),
  phone_number INT,
  name_first VARCHAR(20),
  name_last VARCHAR(20),
  link_image TEXT,
  search_radius INT,
  PRIMARY KEY (id_user)
}

-- WANT table is the books the user would like / need
CREATE TABLE want {
  id SERIAL,
  id_user INT,
  isbn INT, 
  condition VARCHAR(25)
}

-- LISTING table is the books the user has to offer
CREATE TABLE listing {
  id SERIAL,
  id_user INT,
  id_book INT,
  date_created DATE,
  PRIMARY KEY (id)
}

-- SCHOOL table is the user's school, takes in geo location so that we can access map proximity for filter feature
CREATE TABLE school {
  id SERIAL, 
  name_school VARCHAR(200),
  geo_latitude INT,
  geo_longitude INT
}

-- BOOK table is the table that has all books for offering
CREATE TABLE book {
  id SERIAL, 
  isbn INT,
  title VARCHAR(50),
  condition VARCHAR(25),
  PRIMARY KEY (id)
}

-- OFFER LISTING table ties a user making an offer to a listing
CREATE TABLE offer_listing {
  id SERIAL, 
  id_offer INT,
  id_listing INT
}

-- OFFER table holds information on offer made between two people, negative money equals money out of listing owner
CREATE TABLE offer {
  id SERIAL,
  id_listing_recipient INT,
  id_offer_prev INT,
  id_listing_sending INT,
  money_exchange INT default null,
  accepted BOOLEAN default null,
}