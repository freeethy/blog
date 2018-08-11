# git 记一次 rm 操作

今天学习 webpack 时，在.gitignore 中忽略了/node_modules/，但是没生效，然后执行了下面的命令，
不知道是不是在 webpack 目录下执行 git add .的原因，差点把之前的文件全搞没了，使用 git reset --hard xxx（之前提交的版本）还原了

```
git rm --cached .
git add .
git commit
git push
```

## problems

有两个问题：

- 在.gitignore 中忽略了/node_modules/，为什么没生效，怎么解决
- 文件为什么全没了，与 git rm --cache 有关？还是与提交目录有关？

## git rm 与 git rm --cache

当我们需要删除暂存区或分支上的文件, 同时工作区也不需要这个文件了, 可以使用

```
git rm file_path
git commit -m 'delete somefile'
git push
```

当我们需要删除暂存区或分支上的文件, 但本地又需要使用, 只是不希望这个文件被版本控制, 可以使用

```
git rm --cached file_path
git commit -m 'delete remote somefile'
git push
```
