use nodejs ;
-- 人员表
CREATE TABLE USER(
  -- IDENTIFIED
	id VARCHAR(48) NOT NULL  PRIMARY KEY,
	-- 姓名
  	name VARCHAR(32) NOT NULL,
	-- 密码
  	password VARCHAR(32) NOT NULL,
	-- 角色
  	role VARCHAR(32) ,
	-- 注册时间
	createDate VARCHAR(32) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;