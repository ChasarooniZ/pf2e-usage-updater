![](https://img.shields.io/badge/Foundry-v12-informational)
![All Downloads](https://img.shields.io/github/downloads/ChasarooniZ/pf2e-usage-updater/total?color=5e0000&label=All%20Downloads)
![Latest Release Download Count](https://img.shields.io/github/downloads/ChasarooniZ/pf2e-usage-updater/latest/module.zip)

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fpf2e-item-activations&colorB=4aa94a)
[![Kofi](https://img.shields.io/badge/Kofi-F16061.svg?logo=ko-fi&logoColor=white)](https://ko-fi.com/Chasarooni)


![module_banner](https://github.com/ChasarooniZ/pf2e-usage-updater/assets/79132112/3b2a4f8c-7ba1-4647-b073-d8ecac9d93a6)

# PF2e Usage Updater
This simple module exists to update item uses of the party for items that can only by used `every X`

## Features
**Refresh Party actions on Time Update**
- When time is progressed will track and refresh the party's actions when enough (world time) has passed for them to be up again
- **Limitation** The cooldown for refresh starts whenever you first reduce your action's use count so take that as you will
- **Note** - Actions with a cooldown of `Day` refresh on taking `Rest for the Night` (is a base pf2e feature)
  - `Turn` and `Round` are also handled by the system **in combat**
 
**Show how long till actions refresh**
  - This is also customizable for visibility and tooltips
 
**_Action Refresh timer in action_**

![in action](https://private-user-images.githubusercontent.com/79132112/380103615-ed3c3b11-942c-4329-83c1-d602331c7b67.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjk4NTAxNTMsIm5iZiI6MTcyOTg0OTg1MywicGF0aCI6Ii83OTEzMjExMi8zODAxMDM2MTUtZWQzYzNiMTEtOTQyYy00MzI5LTgzYzEtZDYwMjMzMWM3YjY3LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDEwMjUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMDI1VDA5NTA1M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTEwZTQwMTc3MjNkZTAzNjQxNWM3MTg4ZjAxN2ZhNGQxYTY2NTMwY2M1MGI1Mzc1YzhmMTY1MmRlOWU4MmI2OGYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.M90kMv3uFt8gG6g_ner1ofBeh-fGY5UwLKI4R-i8F78)
