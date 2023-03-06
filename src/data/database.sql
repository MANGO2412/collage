create database gallery;

create table account(
    id integer auto_increment primary key,
    correo varchar(250) not null,
    password char(12) not null 
);

create table user(
    id integer auto_increment primary key,
    username varchar(20) not null,
    date_create datetime not null,
    account integer not null,
    foreign key(account) references account(id)
);


create table collections(
     id integer auto_increment primary key,
     code_image varchar(50) not null,
     file_path varchar(500) not null,
     users  integer not null,
     foreign key(users) references user(id)
)
