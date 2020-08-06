## 总结

### 用闭包实现递归 (Y Combinator)
```JavaScript
let y = g => (f => f(f))(self => g((...args) => self(self)(...args)))

let f = y(self => {
  return n => n > 0 ? self(n - 1) + n : 0
})

f(100)
```

### 工具链

![工具链](./tools.png)

主要学习了如何使用yeoman生成自己的generator工具以及如何原生实现命令行工具 市面上也有一些相对成熟的工具 例如ink(react风格的命令行生成器)