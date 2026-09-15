# Gain your token by heading to your NordVPN account and going to "Get Access Token"
# URL: https://my.nordaccount.com/dashboard/nordvpn/access-tokens/authorize/
$username = "token"
# Prompt for token securely (input will be masked)
$securePassword = Read-Host -Prompt "Enter your NordVPN Access Token" -AsSecureString
# Convert SecureString to plain text for API authentication
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
$auth = "$($username):$($password)"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($auth)
$encodedCredentials = [Convert]::ToBase64String($bytes)
$url = "https://api.nordvpn.com/v1/users/services/credentials"
$headers = @{
    Authorization = "Basic $encodedCredentials"
}
# Prints out Username, Password, and Nordlynx Private Key
Invoke-RestMethod -Uri $url -Headers $headers -Method Get | Format-List
# Clear the password from memory
$password = $null
 
# Keep the window open until a key is pressed
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
