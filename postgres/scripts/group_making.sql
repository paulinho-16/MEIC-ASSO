create table Groups (
    id SERIAL PRIMARY KEY,
    typeName varchar(100),
    title varchar(100),
    description varchar(100),
    mlimit integer,
    autoAccept boolean
   
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
    id SERIAL PRIMARY KEY,
    groupId integer,
    studentId integer,
    isAdmin boolean,
    isAccepted boolean,
    foreign key (groupId) references Groups(id),
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

INSERT INTO Groups (typeName,title, "description" , mlimit, autoAccept)
VALUES ('estudo','feup-meic4-study','grupo de estudo para o 4 ano do meic', 4, true);

INSERT INTO Groups (typeName,title, "description" , mlimit, autoAccept)
VALUES ('trabalho','feup-leic3-FSI','grupo de trabalho para a unidade curricular de FSI do 3 ano do meic', 3, true);
    
INSERT INTO Student 
VALUES (1, '23123', 'john', 'doe');

INSERT INTO Student 
VALUES (2, '23123', 'jane', 'doe');

INSERT INTO Student 
VALUES (3, '23123', 'Laura', 'doe');

INSERT INTO Group_Student (groupId, studentId)
VALUES (2, 1);    


