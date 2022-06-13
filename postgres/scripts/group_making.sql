create table Groups (
    id SERIAL PRIMARY KEY,
    typeName varchar(100),
    title varchar(100),
    description varchar(100),
    mlimit integer,
    autoAccept boolean,
    classId integer
);

create table Student (
    id integer,
    studentNumber varchar(100),
    firstName varchar(100),
    lastName varchar(100),

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


INSERT INTO Groups (typeName, title, "description" , mlimit, autoAccept, classId)
VALUES ('estudo','feup-meic4-study','grupo de estudo para o 4 ano do meic', 4, true, 1);

INSERT INTO Groups (typeName, title, "description" , mlimit, autoAccept, classId)
VALUES ('trabalho','feup-leic3-FSI','grupo de trabalho para a unidade curricular de FSI do 3 ano do meic', 3, true, 1);

INSERT INTO Groups (typeName, title, "description" , mlimit, autoAccept, classId)
VALUES ('estudo','PRI Projeto','grupo de trabalho para a unidade curricular de MEIC do 1 ano do meic', 3, false, 2);
    
INSERT INTO Student 
VALUES (1, '23123', 'john', 'doe');

INSERT INTO Student 
VALUES (2, '23123', 'jane', 'doe');

INSERT INTO Student 
VALUES (3, '23123', 'Laura', 'doe');

INSERT INTO Group_Student (groupId, studentId)
VALUES (2, 1);


