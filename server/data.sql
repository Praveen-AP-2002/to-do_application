Create database todoapp;

create table todos (
    id varchar(300) primary key,
    user_email varchar(200),
    title varchar(100),
    progress int,
    date varchar(20),
    description varchar(200)
);

create table users (
    email varchar(200) primary key,
    password varchar(200)
);

