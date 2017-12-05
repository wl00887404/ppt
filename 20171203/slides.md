{{{

# 專案

---

## 分組名單已經出來了

---

## 環境

+ Ip Address => 140.123.175.101
+ Server => Nginx
+ Http => 8080
+ PHP 5.6
+ Mysql 5.7

---

## 帳密

+ Accout => teamXX [ XX <= [01,02 ... 10] ]
+ Password => 每組不一樣，選一個組長找我拿

### SSH、資料庫 同一組

---

## No FTP

## Just Git

---

<div style="font-size:1em;">
    <h1>Just Git</h1>
</div>

---

<div style="font-size:1.5em;">
    <h1>Just Git</h1>
</div>

---

<div style="font-size:2em;">
    <h1>Just Git</h1>
</div>

}}}

{{{

# Server

---

## Checkout here

<a href="http://140.123.175.101:8080/phpinfo.php" target="_blank">http://140.123.175.101:8080/phpinfo.php</a>

---

## Clone this

```bash
git clone <team>@140.123.175.101:/www/<team>/.git
```

}}}

{{{

# Git

---

## Get Started

```bash
# 初始化一個版本庫
git init

# 複製遠端的本庫
git clone
```

---

## Remote

```bash
# show 出所有的 remote
# origin 預設是你 clone 的來源
git remote -v
git remote add <name> <source>
git remote remove <name>
git remote set-url <name> <new_source>
```

---

## Information

```bash
# 目前工作區的追蹤狀態
git status

# 所有 commit 紀錄
# HEAD 為當前的 commit
# HEAD^ 為上則 commit
git log

# commit 的變更
git show <commit>
```

---

## Commit

```bash
# 追蹤檔案
git add <path>

# Commit
git commit -m <message>

# 切換版本
git checkout <commit>
# 單個檔案
git checkout <file> <commit>

```

---

## Branch

```bash
# 查看分支
# 主線叫做 master
git branch

# 新增分支
git branch <branch_name>

# 刪除
git branch -d <branch_name>

# 切換分支
git checkout <branch_name>
```

---

## 合併 branch (Merge)

```bash
# 在 master
git merge <branch_name>
```

---

## Conflict

### 以 PHP 為例

```php
<?php
<<<<<<< HEAD
// 在 HEAD 中的程式碼
=======
// 在 branch 中的程式碼
>>>>>>> branch
?>
```

---

1. 將檔案編輯成目標
1. `git add <name>`
1. `git commit`
1. 完成

---

## Commit 打錯怎麼辦？

```bash
# 回復到上則 commit
git reset HEAD^

# 包含檔案內容
git reset HEAD^ --hard
```
---

## 同步遠端版本庫

```bash
# 上傳
# 如果遇到衝突，要先 pull
git push <remote_name> <branch_name>

# 強制更新
git push <remote_name> <branch_name> -f

# 下載
# 如果有衝突，處理如同 Merge
git pull <remote_name> <branch_name>
```

---

<a href="https://backlog.com/git-tutorial/tw/" target="_blank">連猴子都能懂的Git入門指南</a>

}}}

{{{

# MySql

---

![](./xampp.jpg)

---

## 登入

```bash
# -u 使用者
# -p 使用密碼
# -h 連接遠端
mysql -u <account> -p -h 140.123.175.101
```

---

## 備分

```bash
mysqldump -u <account> -p -h 140.123.175.101 <database> > <output_file>
```

---

## 匯入

```bash
mysql -u <account> -p -h 140.123.175.101 <database> < <output_file>
```

---

## 查詢

```bash
# 看所有資料庫
MySQL [(none)]> show database;

# 選擇資料庫
MySQL [(none)]> use test;

# 看所有 table
MySQL [test]> show tables;

# 看 table 設定
MySQL [test]> show columns from table;
```

---

## Create Table

```sql
CREATE TABLE table_name(
    id int AUTO_INCREMENT NOT NULL,
    name var_char(255) NOT NULL
)
```

---

## 插入資料

```sql
CREATE TABLE table_name(
    id int AUTO_INCREMENT NOT NULL,
    name var_char(255) NOT NULL
)
```

---

### 資料庫行為稱為 CRUD

1. Create
1. Read
1. Update
1. Delete

---

## 剩下google都有

}}}