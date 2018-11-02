# 修改 github 仓库名称

- 在本地仓库删除远程仓库

  ```
  git remote rm origin
  ```

- 修改 Github 仓库名称：  
  在 Github 页面中，进入要修改的仓库，在页面上方选择“Settings”，即可重命名远程仓库。

- 添加新的远程仓库

```
git remote add origin git@github.com:your_account_name/new_repo_name.git
```

- 修改远程地址

```
git remote set-url origin git@github.com:your_account_name/new_repo_name.git
```
