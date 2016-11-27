use nodejs ;
-- 评论表
CREATE TABLE comments(
  -- IDENTIFIED
	id VARCHAR(48) NOT NULL  PRIMARY KEY,
	-- 内容
  content VARCHAR(32) NOT NULL,
	-- 评论时间
  createDate VARCHAR(32) NOT NULL,
	-- 用户id
  userId VARCHAR(48) NOT NULL,
	-- 电影id
  movieId VARCHAR(48) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;