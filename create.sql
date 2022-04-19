-- CREATE TABLES
create table GroupType (
    id integer,
    typeName varchar(100),
    unique (id),
    primary key (id)
);

create table GroupInfo (
    id integer,
    title varchar(100),
    description varchar(100),
    membersNumberLimit integer,
    autoAccept boolean,
    typeId integer,
    unique (id),
    primary key (id),
    foreign key (typeID) references GroupType(id)
);

create table Student (
    id integer,
    studentNumber varchar(100),
    firstName varchar(100),
    lastName varchar(100),
    unique (id),
    primary key (id)
);

create table Class (
    id integer,
    classIdentifier varchar(100),
    className varchar(100),
    courseId integer,
    unique (id),
    primary key (id)
);

create table Course (
    id integer,
    courseIdentifier varchar(100),
    courseName varchar(100),
    unique (id),
    primary key (id)
);

create table Group_Student (
    id integer,
    groupId integer,
    studentId integer,
    isAdmin boolean,
    isAccepted boolean,
    unique (id),
    primary key (id),
    foreign key (groupId) references GroupInfo(id),
    foreign key (studentId) references Student(id)
);

create table Student_Class (
    id integer,
    studentId integer,
    classId integer,
    unique (id),
    primary key (id),
    foreign key (studentId) references Student(id),
    foreign key (classId) references Class(id)
);

create table Student_Course (
    id integer,
    studentId integer,
    courseId integer,
    unique (id),
    primary key (id),
    foreign key (studentId) references Student(id),
    foreign key (courseId) references Course(id)
);

-- INSERT DATA
insert into
    GroupType
values
    (1, "Study Group");

insert into
    GroupType
values
    (2, "Project Group");