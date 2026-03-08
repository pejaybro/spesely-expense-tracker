# GitHub SSH Setup Commands (Windows) -- Bash vs PowerShell vs CMD

This guide lists the correct commands depending on the terminal you use.

Windows developers commonly use **Git Bash**, **PowerShell**, or
**CMD**.\
Some commands work only in specific terminals.

------------------------------------------------------------------------

# 1. Generate a New SSH Key

Works in **Git Bash / PowerShell / CMD**

``` bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press **Enter for all prompts**.

This creates:

    ~/.ssh/id_ed25519
    ~/.ssh/id_ed25519.pub

------------------------------------------------------------------------

# 2. Start the SSH Agent

## PowerShell (Recommended)

``` powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
```

------------------------------------------------------------------------

# 3. Add the SSH Key to the Agent

## PowerShell

``` powershell
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

## Git Bash

``` bash
ssh-add ~/.ssh/id_ed25519
```

------------------------------------------------------------------------

# 4. Verify the Key is Added

Works in **PowerShell / Git Bash**

``` bash
ssh-add -l
```

------------------------------------------------------------------------

# 5. View the Public Key

## Git Bash

``` bash
cat ~/.ssh/id_ed25519.pub
```

## PowerShell

``` powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

## CMD

``` cmd
type %USERPROFILE%\.ssh\id_ed25519.pub
```

Copy the entire output and add it to:

GitHub → Settings → SSH and GPG Keys → New SSH Key

------------------------------------------------------------------------

# 6. Test the Connection

Works in **all terminals**

``` bash
ssh -T git@github.com
```

Expected output:

    Hi <username>! You've successfully authenticated.

------------------------------------------------------------------------

# 7. Check Your .ssh Folder

## Git Bash

``` bash
ls ~/.ssh
```

## PowerShell

``` powershell
ls ~/.ssh
```

or

``` powershell
Get-ChildItem ~/.ssh
```

## CMD or Git CMD

``` cmd
dir %USERPROFILE%\.ssh
```

If you are already inside `C:\Users\yourname`:

``` cmd
dir .ssh
```

------------------------------------------------------------------------

# 8. Clone Repository Using SSH

``` bash
git clone git@github.com:username/repository.git
```

------------------------------------------------------------------------

# 9. Typical Git Workflow

``` bash
git add .
git commit -m "your message"
git push origin main
```

------------------------------------------------------------------------

# Recommended Terminal

Most developers prefer **Git Bash** or **PowerShell** because tutorials
use Linux-style commands like:

    ls
    cat
    ~

These do **not work in CMD**.
