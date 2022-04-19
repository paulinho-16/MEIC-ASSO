create table GroupType (id integer, typeName varchar(100));
create table GroupInfo (id integer, title varchar(100), description varchar(100), membersNumberLimit integer, autoAccept boolean, typeId integer);
create table Group_Student (id integer, groupId integer, studentId integer, isAdmin boolean, isAccepted boolean);
create table Student (id integer, studentNumber varchar(100), firstName varchar(100), lastName varchar(100));
create table Student_Class (id integer, studentId integer, classId integer);
create table Class (id integer, classIdentifier varchar(100), className varchar(100), courseId integer);
create table Course (id integer, courseIdentifier varchar(100), courseName varchar(100));
create table Student_Course (id integer, studentId integer, courseId integer);