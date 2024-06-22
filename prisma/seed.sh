#!/bin/sh
# Seeder for test

## User
wrangler d1 execute books-management --command='INSERT INTO User ("email","name") VALUES ("hibara428@gmail.com","hibara428")'
## SearchCondition
wrangler d1 execute books-management --command='INSERT INTO User ("type","keyword") VALUES (0,"哲学")'
## UserSearchCondition
wrangler d1 execute books-management --command='INSERT INTO UserSearchCondition ("userId","searchConditionId") VALUES (1,1)'
## Book
wrangler d1 execute books-management --command='INSERT INTO Book ("title","titleFurigana","subtitle","subtitleFurigana","seriesName","seriesNameFurigana","authorName","authorNameFurigana","publisherName","size","isbn","caption","salesDate","salesDateText","price") VALUES ("哲学だよ","ぶっくたいとる","サブタイトル","さぶたいとる","シリーズ①","しりーずいち","著者さん","ちょしゃさん","出版社","A4","ISBN-HFI5fdHFDH4","説明文キャプション","2024-05-19T06:21:59.000Z","もうじき",1500)'
## UserBook
wrangler d1 execute books-management --command='INSERT INTO UserBook ("userId","month","bookId") VALUES (1,"202405",1)'
