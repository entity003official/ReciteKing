##############################################
# GitHub自动上传脚本 - ReciteKing项目
# 创建日期: 2025-09-06
##############################################

Write-Host "========================================"
Write-Host "   ReciteKing项目 - GitHub上传工具      "
Write-Host "========================================"
Write-Host ""

# 检查是否已经初始化Git仓库
if (-not (Test-Path -Path ".git")) {
    Write-Host "正在初始化Git仓库..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Git初始化失败，请确保已安装Git" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git仓库初始化成功！" -ForegroundColor Green
} else {
    Write-Host "Git仓库已存在，继续上传流程..." -ForegroundColor Green
}

# 检查远程仓库配置
$remoteExists = git remote -v
if ($remoteExists -eq $null -or $remoteExists -eq "") {
    Write-Host ""
    Write-Host "请输入您的GitHub用户名:" -ForegroundColor Cyan
    $githubUsername = Read-Host
    
    Write-Host "请输入仓库名称 (默认: ReciteKing):" -ForegroundColor Cyan
    $repoName = Read-Host
    if ($repoName -eq "") {
        $repoName = "ReciteKing"
    }
    
    $repoUrl = "https://github.com/$githubUsername/$repoName.git"
    Write-Host "正在配置远程仓库: $repoUrl" -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "远程仓库配置成功！" -ForegroundColor Green
} else {
    Write-Host "远程仓库已配置，将使用现有配置" -ForegroundColor Green
    $repoUrl = git remote get-url origin
    Write-Host "当前仓库URL: $repoUrl" -ForegroundColor Cyan
}

# 添加所有文件
Write-Host ""
Write-Host "正在准备文件..." -ForegroundColor Yellow
git add .
Write-Host "文件准备完成！" -ForegroundColor Green

# 提交更改
Write-Host ""
Write-Host "请输入提交信息 (默认: 'Initial commit - Complete vocabulary database for 初级1'):" -ForegroundColor Cyan
$commitMessage = Read-Host
if ($commitMessage -eq "") {
    $commitMessage = "Initial commit - Complete vocabulary database for 初级1"
}

Write-Host "正在提交更改..." -ForegroundColor Yellow
git commit -m "$commitMessage"
if ($LASTEXITCODE -ne 0) {
    Write-Host "提交失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
Write-Host "提交成功！" -ForegroundColor Green

# 创建.gitignore文件
if (-not (Test-Path -Path ".gitignore")) {
    Write-Host ""
    Write-Host "正在创建.gitignore文件..." -ForegroundColor Yellow
    @"
# 系统文件
.DS_Store
Thumbs.db
desktop.ini

# IDE配置
.idea/
.vscode/
*.swp
*.swo

# 临时文件
*.log
*.tmp
temp/
tmp/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host ".gitignore文件创建成功！" -ForegroundColor Green
    git add .gitignore
    git commit -m "Add .gitignore file"
}

# 推送到远程仓库
Write-Host ""
Write-Host "是否要推送到GitHub? (Y/N，默认为Y):" -ForegroundColor Cyan
$pushConfirm = Read-Host
if ($pushConfirm -eq "" -or $pushConfirm.ToUpper() -eq "Y") {
    # 检查分支名称
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
        Write-Host "当前分支为: $currentBranch" -ForegroundColor Yellow
        Write-Host "是否要重命名为main分支? (Y/N，默认为Y):" -ForegroundColor Cyan
        $renameConfirm = Read-Host
        if ($renameConfirm -eq "" -or $renameConfirm.ToUpper() -eq "Y") {
            git branch -M main
            Write-Host "分支已重命名为main" -ForegroundColor Green
            $currentBranch = "main"
        }
    }
    
    Write-Host "正在推送到GitHub..." -ForegroundColor Yellow
    git push -u origin $currentBranch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "推送失败，请检查错误信息" -ForegroundColor Red
        Write-Host "如果这是您第一次推送，可能需要在GitHub上先创建仓库" -ForegroundColor Yellow
        Write-Host "仓库创建链接: https://github.com/new" -ForegroundColor Cyan
        exit 1
    }
    Write-Host "推送成功！项目已上传到GitHub" -ForegroundColor Green
    
    # 提取仓库URL并去除.git后缀
    $repoUrl = git remote get-url origin
    $repoUrl = $repoUrl -replace "\.git$", ""
    Write-Host "您可以通过以下链接访问您的仓库:" -ForegroundColor Cyan
    Write-Host "$repoUrl" -ForegroundColor White
} else {
    Write-Host "已取消推送操作，您的更改已保存在本地" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================"
Write-Host "   上传流程完成！谢谢使用              "
Write-Host "========================================"
