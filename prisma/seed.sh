#!/bin/sh
# Seeder for test
wrangler d1 execute books-management --command='INSERT INTO User ("email","name") VALUES ("hibara428@gmail.com","hibara428")'
wrangler d1 execute books-management --command='INSERT INTO Book ("title","titleFurigana","subtitle","subtitleFurigana","seriesName","seriesNameFurigana","authorName","authorNameFurigana","publisherName","size","isbn","caption","salesDate","salesDateText","price") VALUES ("ブックタイトル","ぶっくたいとる","サブタイトル","さぶたいとる","シリーズ①","しりーずいち","著者さん","ちょしゃさん","出版社","A4","ISBN-HFI5fdHFDH4","説明文キャプション","2024-05-19T06:21:59.000Z","もうじき",1500)'
wrangler d1 execute books-management --command='INSERT INTO UserNewPublicationBook ("userId","month","bookId") VALUES (1,"202405",1)'
wrangler d1 execute books-management --command='INSERT INTO UserKeyword ("userId","type","keyword") VALUES (1,1,"keyword1")'
