-- CREATE DATABASE NCDP;

-- USE sql12326196;

	
-- DROP TABLE IF EXISTS USERS;

-- CREATE TABLE USERS
-- (

--     userID INT AUTO_INCREMENT UNIQUE PRIMARY  KEY,
--     userName VARCHAR  (100) NOT NULL,
--     Email VARCHAR  (100) NOT NULL,
--     Image VARCHAR(100) ,
--     salt VARCHAR(100) NOT NULL,
--     password VARCHAR(300) NOT NULL
    

-- );
-- ALTER TABLE USERS MODIFY  Image  VARCHAR(400);
	
-- DROP TABLE IF EXISTS MODELS;

-- CREATE TABLE MODELS
-- (

--   ModelID INT AUTO_INCREMENT PRIMARY KEY,
--     Title VARCHAR  (100) NOT NULL UNIQUE ,
--     Icon VARCHAR  (300) ,
--     CreatedBy INT NOT NULL ,
--     FOREIGN KEY (CreatedBy) REFERENCES USERS(userID) ON DELETE CASCADE


-- );
-- ALTER TABLE   MODELS  CONVERT TO CHARACTER SET utf8;


-- DROP TABLE IF EXISTS Topics;
-- CREATE TABLE Topics
-- (
 
--    TopicID INT AUTO_INCREMENT PRIMARY KEY,
--     ModelID int not  NULL,
--     Icon VARCHAR  (300) ,
--     Title VARCHAR(200) NOT NULL UNIQUE ,
--     FOREIGN KEY (ModelID) REFERENCES MODELS(ModelID) ON DELETE CASCADE

-- );
-- ALTER TABLE Topics MODIFY  Icon  VARCHAR(400);
-- ALTER TABLE   Topics  CONVERT TO CHARACTER SET utf8;


-- DROP TABLE IF EXISTS ;
-- CREATE TABLE Article
-- (

--     ArticleID INT AUTO_INCREMENT PRIMARY KEY,
--     TopicID int NOT NULL,
--     Icon VARCHAR  (300) ,
--     Title VARCHAR(200) NOT NULL UNIQUE,
--     UpdateDate DATETIME ,
--     UpdateByUser int ,
--     CreatedByUser int not null,
--     CreatedDate DATETIME,
--     TimesViewd int ,
--     Notes varchar(500),
--     FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE

-- );
-- ALTER TABLE Article MODIFY  Icon  VARCHAR(400);
-- ALTER TABLE   Article  CONVERT TO CHARACTER SET utf8;

-- DROP TABLE IF EXISTS Content;
--   CREATE TABLE Content
--   (
--   contentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--   ArticleID INT NOT NULL,
--   FOREIGN KEY (ArticleID) REFERENCES Article(ArticleID) ON DELETE CASCADE
--   );
--     ALTER TABLE   Content  CONVERT TO CHARACTER SET utf8;


-- DROP TABLE IF EXISTS Media;
--   CREATE TABLE Media 
--   (
--     MediaID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--     ContentID INT NOT NULL,
--     MediaLink varchar(400) not null,
--     MediaOrder int NOT NULL,
--     MediaType VARCHAR(20) NOT NULL,
--     FOREIGN KEY (ContentID) REFERENCES Content(contentID) ON DELETE CASCADE
--   );
--     ALTER TABLE   Media  CONVERT TO CHARACTER SET utf8;


-- DROP TABLE IF EXISTS TEXT;
--    CREATE TABLE Text 
--   (
--     TextID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--     ContentID INT NOT NULL,
--     ContentText varchar(10000) NOT NULL,
--     MediaOrder int NOT NULL,
--     MediaType VARCHAR(20) NOT NULL,
--     FOREIGN KEY (ContentID) REFERENCES Content(contentID) ON DELETE CASCADE
--   );
--   ALTER TABLE Text  CONVERT TO CHARACTER SET utf8;

