# 说明
简单的koa2框架练习，koa2相比koa在中间件实现上有较大改变，koa中间件基于generator函数、co模块实现，koa2基于async函数实现中间件的异步编程。 koa2 兼容原koa的generator函数方法，原理在于koa2的use函数将gen函数使用koa-convert包转化。 其中koa-convert的原理也是基于co模块将gen转换为Promise对象。这符合async函数执行后返回Promise的特点，从而达到兼容的目的。

# 目标
通过此项目 熟悉koa框架使用、了解其原理。 添加简单测试用例、简单持续集成等内容。

# 内容
koa是一个web框架，所以这次练习用koa做一个原来做过的，基于express框架的后台管理系统