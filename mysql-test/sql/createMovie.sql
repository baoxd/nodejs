use nodejs ;
-- 电影表
CREATE TABLE movie(
  -- IDENTIFIED
	id VARCHAR(48) NOT NULL  PRIMARY KEY,
	-- 导演
  doctor VARCHAR(32) NOT NULL,
	-- 标题
  title VARCHAR(32) NOT NULL,
	-- 语言
  language VARCHAR(32) NOT NULL,
	-- 国家
  country VARCHAR(32) NOT NULL,
	-- 简介
  summary VARCHAR(108) NOT NULL,
	-- 电影路径
  flash VARCHAR(108) NOT NULL,
	-- 海报
  poster VARCHAR(108) NOT NULL,
	-- 年份
  year VARCHAR(6) NOT NULL,
	-- 录入时间
  createDate VARCHAR(108)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;