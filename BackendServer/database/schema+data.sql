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
  qna_id integer NOT NULL,
  user_id integer NOT NULL,
  FOREIGN KEY(qna_id) REFERENCES qnas(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
) engine = innodb;


INSERT INTO `users` values (default, "user1", "password1", 111111, default, default);
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

INSERT INTO `qnas` values (default, "title1", "나는 자랑스런 태극기 앞에 조국과 민족의 무궁한 영광을 위하여 충성은 개뿔 아무거나 씁시다.\n가나다라 마바사 아니 이건 뭘 넣어서 쓸까요\n abcasdfawefksdfksadkfaskfkajwef \nwejfk3j2kfjasdkjfasjdfsadfsad", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "title2", "ㅁ낭러ㅏㅁㅈㄷ란아차추라ㅜㄷ람ㄴ\n가다아아아아두라ㅓ차ㅓ챠챠ㅓ챠ㅓ가ㅜㅏ구ㅏㅜ라ㅜ아ㅜ냐나 \nadsfaksjfkawheibfibcivbawib sdgtwkkasdjvg a\n a fiaw9ef9awfjsadfvfj3fnasdknva df", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "134", "3243434234afdwae", 3, "2020-01-01");
INSERT INTO `qnas` values (default, "제목이지롱", "tssaf", 3, "2020-01-01");
INSERT INTO `qnas` values (default, "가나다람", "content2", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "tawefa", "awefewevasdf", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "title2", "content2", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "ㅇㄹ33", "content2", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "ㅌㅇㅈㄷㅍ", "content2", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "asdvcasv", "content2", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "test525", "content2", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "title3", "content2", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "333333", "content2", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "342", "content2", 1, "2020-01-01");
INSERT INTO `qnas` values (default, "234", "content2", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "233", "ㅁ낭러ㅏㅁㅈㄷ란아차추라ㅜㄷ람ㄴ\n가다아아아아두라ㅓ차ㅓ챠챠ㅓ챠ㅓ가ㅜㅏ구ㅏㅜ라ㅜ아ㅜ냐나 \nadsfaksjfkawheibfibcivbawib sdgtwkkasdjvg a\n a fiaw9ef9awfjsadfvfj3fnasdknva df", 2, "2020-01-01");
INSERT INTO `qnas` values (default, "343", "ㅁ낭러ㅏㅁㅈㄷ란아차추라ㅜㄷ람ㄴ\n가다아아아아두라ㅓ차ㅓ챠챠ㅓ챠ㅓ가ㅜㅏ구ㅏㅜ라ㅜ아ㅜ냐나 \nadsfaksjfkawheibfibcivbawib sdgtwkkasdjvg a\n a fiaw9ef9awfjsadfvfj3fnasdknva df", 3, "2020-01-01");


INSERT INTO `files` values (default, "file1", 1, 1);
INSERT INTO `files` values (default, "file2", 1, 1);
INSERT INTO `files` values (default, "file3", 3, 2);
