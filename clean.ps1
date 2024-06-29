# Define the paths to be cleaned
$paths = @(
    ".\frontend\node_modules",
    ".\frontend\.next",
    ".\frontend\package-lock.json",
    ".\backend\upload_files",
    ".\backend\__pycache__",
    ".\backend\controllers\__pycache__",
    ".\backend\database\__pycache__",
    ".\backend\modules\__pycache__",
    ".\backend\user\__pycache__",
    ".\backend\Include",
    ".\backend\Lib",
    ".\backend\Scripts",
    ".\backend\pyvenv.cfg",
    ".\backend\.env"
)

# Function to remove files and directories
function Remove-ItemSafely {
    param (
        [string]$Path
    )

    if (Test-Path -Path $Path) {
        if (Get-Item -Path $Path -Force | Where-Object { $_.PSIsContainer }) {
            Remove-Item -Path $Path -Recurse -Force
            Write-Host "Directory removed: $Path"
        } else {
            Remove-Item -Path $Path -Force
            Write-Host "File removed: $Path"
        }
    } else {
        Write-Host "Path does not exist: $Path"
    }
}

# Loop through each path and remove it
foreach ($path in $paths) {
    Remove-ItemSafely -Path $path
}

Write-Host "Cleanup completed."
