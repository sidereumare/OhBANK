drop database if exists dvba;
create database if not exists dvba;
use dvba;

create table users (
  id integer PRIMARY KEY auto_increment,
  username varchar(100) UNIQUE NOT NULL,
  password varchar(1024) NOT NULL,
  account_number integer UNIQUE,
  balance integer default 10000 NOT NULL,
  is_admin boolean default false
) engine = innodb;

create table transactions (
  id integer PRIMARY KEY auto_increment,
  from_account int(11) NOT NULL,
  to_account int(11) NOT NULL,
  amount int NOT NULL
) engine = innodb;

create table beneficiaries (
  id integer PRIMARY KEY auto_increment,
  account_number int(11) NOT NULL,
  beneficiary_account_number int(11) NOT NULL,
  approved boolean default false NOT NULL
) engine = innodb;

create table qnas(
  id integer PRIMARY KEY auto_increment,
  title varchar(100) NOT NULL,
  content varchar(10000) NOT NULL,
  writer_id integer NOT NULL,
  write_at DATE NOT NULL,
  FOREIGN KEY(writer_id) REFERENCES users(id)
) engine = innodb;

create table files(
  id integer PRIMARY KEY auto_increment,
  file_name varchar(100) NOT NULL,
  saved_name varchar(100) NOT NULL,
  qna_id integer,
  user_id integer NOT NULL,
  FOREIGN KEY(qna_id) REFERENCES qnas(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
) engine = innodb;

INSERT INTO `users` values (default, "bgseo", "bgseopw", 111111, default, default);
INSERT INTO `users` values (default, "user2", "password2", 222222, default, default);
INSERT INTO `users` values (default, "user3", "password3", 333333, default, default);
INSERT INTO `users` values (default, "user4", "password4", 444444, default, default);
INSERT INTO `users` values (default, "admin", "admin", 999999, default, true);

INSERT INTO `transactions` values (default, 111111, 222222, 100);
INSERT INTO `transactions` values (default, 222222, 111111, 200);
INSERT INTO `transactions` values (default, 111111, 333333, 100);
INSERT INTO `transactions` values (default, 111111, 444444, 100);

INSERT INTO `beneficiaries` values (default, 111111, 222222, true);
INSERT INTO `beneficiaries` values (default, 111111, 333333, true);
INSERT INTO `beneficiaries` values (default, 111111, 444444, true);

INSERT INTO `qnas` values (default, "비밀번호 5회 오류", "비밀번호 오류로 거래제한이 되었습니다. 어떻게 해야 하나요?", 1, "2022-11-03");
INSERT INTO `qnas` values (default, "적금 관련 문의", "적금", 1, "2022-10-01");
INSERT INTO `qnas` values (default, "인증서 설치 오류가 뜹니다", "~", 1, "2022-10-23");
INSERT INTO `qnas` values (default, "ARS가 오지 않습니다", "추가인증을 위한 ARS 전화가 오지 않습니다.", 1, "2022-11-03");
INSERT INTO `qnas` values (default, "휴면계좌 해제 문의", "휴면계좌가 된 통장을 다시 이용하려면 어떻게 해야하나요?", 1, "2022-11-03");
INSERT INTO `qnas` values (default, "적금 중도해지 관련", "적금해지~", 1, "2022-11-03");
INSERT INTO `qnas` values (default, "수수료 면제 신청", "재직증명서 첨부합니다", 1, "2022-11-03");

INSERT INTO `qnas` values (default, "비밀번호 5회 오류", "비밀번호 오류로 거래제한이 되었습니다. 어떻게 해야 하나요?", 2, "2022-11-03");
INSERT INTO `qnas` values (default, "적금 관련 문의", "적금", 2, "2022-10-01");
INSERT INTO `qnas` values (default, "인증서 설치 오류가 뜹니다", "~", 2, "2022-10-23");
INSERT INTO `qnas` values (default, "ARS가 오지 않습니다", "추가인증을 위한 ARS 전화가 오지 않습니다.", 2, "2022-11-03");
INSERT INTO `qnas` values (default, "휴면계좌 해제 문의", "휴면계좌가 된 통장을 다시 이용하려면 어떻게 해야하나요?", 2, "2022-11-03");
INSERT INTO `qnas` values (default, "적금 중도해지 관련", "적금해지~", 2, "2022-11-03");
INSERT INTO `qnas` values (default, "수수료 면제 신청", "재직증명서 첨부합니다", 2, "2022-11-03");


INSERT INTO `files` values (default, "capture_2022-10-28 132549.jpg", "abc.jpg", 1, 1);
INSERT INTO `files` values (default, "abc.jpg", "abc.jpg", 2, 1);
