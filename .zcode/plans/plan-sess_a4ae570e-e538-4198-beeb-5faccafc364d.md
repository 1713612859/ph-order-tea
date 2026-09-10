在 D:\Dev_project\ph-tea-order 内创建独立的 git 仓库并推送到 https://github.com/1713612859/ph-order-tea：

1. 在 ph-tea-order 下创建 .gitignore（忽略 node_modules、dist、tsconfig.tsbuildinfo、.claude）
2. 在该目录内 `git init`（初始化为 main 分支）、`git add .`、`git commit`
3. `git remote add origin https://github.com/1713612859/ph-order-tea.git`
4. 先尝试 `git push -u origin main`；若远端已有内容导致拒绝，再与你确认是否覆盖

注意：不使用父目录 D:\Dev_project 的仓库（它混入了大量无关项目文件）。