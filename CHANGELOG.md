## 2.2.0 - Chilling

- This update is for PF2e `6.5.0`
- **MAJOR NOTE**
  - in previous versions of this module I treated minutes as seconds on accident, so all previous cooldowns are off by a factor of 60 (IE 60 x less than what they should've been)
- Cooldowns now accurately reflect time left
- Removed handling of updating item usage as it is handled by system now
- Removed handling of refreshing cooldowns for `turn` and `round` abilities as they are handled by the system now

## [2.1.5](https://github.com/ChasarooniZ/pf2e-usage-updater/compare/2.1.4...2.1.5) - Fixing End Turn Stuff

- ~~`End turn`~~ -> `Start of Turn` to check for turn cooldowns
- Handled can't find max frequency error

## 2.1.4 - Oh the Commas

- Fixed bug with end turn automation (@YoSoyEd)

## 2.1.3 - Ready, Steady, Go Latest

- Fixed bug where turn and around effects weren't resetting at combat start (@samgrieve)

## 2.1.2

- `Bug Fixes` (thank to @Maple)
  - Fixed localization of some settings choices
  - fixed `Auto` so that it adds the HP, not sets you to the HP

## 2.1.1 - Run it Back

- Actually merged the feature branch this time

## 2.1.0

- `Aeon Stone (Pearly White Spindle) automation`
  - Changed settings options
    - `Disabled` - Disabled
    - `Roll` - Roll healing to chat
    - `Automatic` - Heal actor automatically and then send chat message
- `Automatic Round Fixes`
  - Causes Round + Turn counters to reset on combat start
  - Fix them not reseting on next round
  - Adds cooldown flags to items already used without one

## 2.0.1

- Fixed Aeon Stone (Pearly White Spindle) automation

## 2.0.0 - V12 Support

- Added Support for Fvtt `v12`

## 1.0.0 - Full Release

- Fixed error messages for items that don't have usage
- Added option to automate Aeon Stone (Pearly White Spindle) to settings

## 0.9.5 - Fixed Localization

- Fixed localization name to be correct

## 0.9.4 - More Bug Fixes Latest

- Catches scenarios where items don't have flags

## 0.9.3 - Oh what a difference capitalization can make

- Fixed issue with settings not populating (@Ghost_desu)

## 0.9.2 - Features + Bugfixes

- Added detection for if your frequency changes so that, it won't be stuck to the old cooldown
- Added setting to allow you to toggle time based refresh for all tokens on current canvas
  - _Note: If you have a lot of tokens, may have performance implications_

_Shout out to @Rigo for a lot of early bug testing_

## 0.9.1 - Usage Fixes + Extra Module support

- Added Support for `pf2e-additional-automations` (@Mecha Maya)
- Fix bug with usage not ticking down action count

## 0.9.0 - Initial Release

- This simple module exists to update item uses of the party, and of combatants.
- **Features**
  - **Decrease Action uses when sent to chat**
    - When you send an action like Orc Ferocity etc. to Chat will automatically reduce the uses
  - **Refresh Party actions on Time Update**
    - When time is progressed will track and refresh the party's actions when enough (world time) has passed for them to be up again
    - **Limitation** The cooldown for refresh starts whenever you first reduce your action's use count so take that as you will
    - **Note** - Actions with a cooldown of `Day` refresh on taking `Rest for the Night` (is a base pf2e feature)
  - **Refresh Combatants Actions in Combat**
    - For actions with a `per turn` or `per round` use count this refreshes those
- **Compatibility**
  - [Pf2e Action Support](https://github.com/reyzor1991/foundry-vtt-pf2e-action-support) - Automatically detects if you have this module active, and its decrease frequency feature and will disable this module's decrease frequency feature
