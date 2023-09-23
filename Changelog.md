# UserScript History Changelog

## V4

### VER. v4.16 (Beta) [4.16.0](https://greasyfork.org/scripts/428651-tabview-youtube) - 11 Jul 2023

- Update as per Layout Change in 2023.07.11

### VER. v4.15 (Stable) [4.15.26](https://greasyfork.org/scripts/428651-tabview-youtube?version=1217319) - 09 Jul 2023

- New Feature: History Popstate Issue Bug Fix for YouTube engine

### VER. v4.14 (Stable) [4.14.8](https://greasyfork.org/scripts/428651-tabview-youtube?version=1215133) - 04 Jul 2023

- New Feature: Bypass video pause during linkedCommentBadgeChanged
- New Fix due to YouTube engine changes: Update customYtElements library
- Various minor CSS fixes

### VER. v4.13 (Stable) [4.13.29](https://greasyfork.org/scripts/428651-tabview-youtube?version=1213046) - 30 Jun 2023

- Various Compatibility Fixes and Features Fixes (v4.13.0 ~ v4.13.18)
- Fixed Issue that No Chat Messages on Background Tab (v4.13.19)

### VER. v4.12 (Stable) [4.12.2](https://greasyfork.org/scripts/428651-tabview-youtube?version=1206344) - 17 Jun 2023

- Added CSS for YouTube Shorts shown in Videos Tab (due to YouTube Design Change) (v4.12.0)
- Remove chat iframe CSS rules `-tabview-chat-message-xxxx` (v4.12.1)

### VER. v4.11 (Stable) [4.11.9](https://greasyfork.org/scripts/428651-tabview-youtube?version=1202141) - 09 Jun 2023

- Fixed drag handler issue for playlist (v4.11.1)
- Remove the newlines spacing mismatch in metainfo duplication check due to YouTube custom element regeneration under pop state navigation (v4.11.3)
- Fixed YouTube Native Bug: the incorrect row will be highlighted after playlist reorder (v4.11.4 & v4.11.5)
- Add CSS experimental-playlist-grid-render-boost (v4.11.6 & v4.11.7)

### VER. v4.10 (Stable) [4.10.15](https://greasyfork.org/scripts/428651-tabview-youtube?version=1198995) - 02 Jun 2023

- Hide duplicated meta ([example](https://www.youtube.com/watch?v=kGihxscQCPE)) (v4.10.0)
- Icon Fix in v4.10.2
  - Before:
    - <img height="160" src="https://na.cx/i/MyqSuYP.png">
  - After:
    - <img height="160" src="https://na.cx/i/MqHUJiP.png">
- Fixed comment sizing issue with zoom (v4.10.10)

### VER. v4.9 (Stable) [4.9.17](https://greasyfork.org/scripts/428651-tabview-youtube?version=1192334) - 18 May 2023

- Automatic Userscript Generation by GitHub Actions (v4.9.0 ~ v4.9.10)
- Fix minor visual CSS issues (v4.9.7, v4.9.11 ~ v4.9.15)
- Fix minor translation issues (v4.9.16 ~ v4.9.16)

### VER. v4.8 (Stable) [4.8.10](https://greasyfork.org/scripts/428651-tabview-youtube?version=1190135) - 14 May 2023

- Added JP Version for Duration Display by Hovering Video Title (v4.8.0)
- Fixed compatibility issue for Waterfox Classic (v4.8.2)
- Fixed compatibility issue for Firefox (v4.8.5)
- Fixed #actions menu buttons tooltips (v4.8.x ~ 4.8.7)
- Fixed compatibility issue with translation button (v4.8.8)
- Fixed thousand representation (v4.8.9)

### VER. v4.7 (Stable) [4.7.48](https://greasyfork.org/scripts/428651-tabview-youtube?version=1189016) - 11 May 2023

- Changed duplication information detection mechanism to fit the latest YouTube design (v4.7.0 ~ v4.7.4, v4.7.20)
- Amend comment count fetching (v4.7.5 ~ v4.7.6, v4.7.8 ~ v4.7.20)
- Migrated YouTube Layout Change from `ytd-watch-metadata[modern-metapanel]` to `ytd-watch-metadata` for new and confirmed info layout (v4.7.7, v4.7.20)
- Updated core coding for ytd custom elements (v4.7.9 ~ v4.7.42)
- Visual Design Update, Remove Old Code, etc (v4.7.30 ~ v4.7.4x)
- Added CSS Hack for YouTube's layout bug of `ytd-menu-renderer[has-flexible-items]` (v4.7.43 ~ v4.7.47)

### VER. v4.6 (Stable) [4.6.1](https://greasyfork.org/scripts/428651-tabview-youtube?version=1185824) - 05 May 2023

- Changed CSS for border related issues in Darker Dark Theme

### VER. v4.5 (Stable) [4.5.1](https://greasyfork.org/scripts/428651-tabview-youtube) - 03 May 2023

- Dialog for Default Tab Setting

### VER. v4.4 (Stable) [4.4.8](https://greasyfork.org/scripts/428651-tabview-youtube) - 24 Mar 2023

- Added Feature: Single Column with PIP
- Minor bug fix for YouTube element removal during page transition (v4.4.8)

### VER. v4.4 (Stable) [4.4.5](https://greasyfork.org/scripts/428651-tabview-youtube) - 12 Mar 2023

- Added Feature: Bypass video progress change if the user is using keyboard shift arrow to change the selected text (e.g., video title)

### VER. v4.4 (Stable) [4.4.4](https://greasyfork.org/scripts/428651-tabview-youtube) - 04 Feb 2023

### VER. v4.3 (Beta) [4.3.3](https://greasyfork.org/scripts/428651-tabview-youtube?version=1146541) - 04 Feb 2023

- Adaption with Donation Panel `ytd-donation-shelf-renderer`

### VER. v4.2 (Stable) [4.2.7](https://greasyfork.org/scripts/428651-tabview-youtube?version=1143127) - 29 Jan 2023

### VER. v4 (Alpha) [4.1.47](https://greasyfork.org/scripts/428651-tabview-youtube?version=1141591) - 24 Jan 2023

- Fix YouTube Native Bug: constantly refresh participant list once it is shown before. (related to full reload with filter option) (v4.2.0)
- Code Change for Playback Live Messages (v4.1.30, v4.1.38, v4.1.39, v4.1.47)
- Fixed bugs due to YouTube coding changes for ChatFrame (v4.1.0, v4.1.6~v4.1.8)
- (Possibly) Fixed affected subtitle lagging issue in v4.2.5
- Fixed issue with integrated use with Youtube Genius Lyrics in v4.2.6

### VER. v4 (Beta) [4.0.10](https://greasyfork.org/scripts/428651-tabview-youtube?version=1137914) - 11 Jan 2023

- Integration with Live Chat Popup

## V3

### VER. v3 (Beta) [3.16.15](https://greasyfork.org/scripts/428651-tabview-youtube?version=1134999) - 04 Jan 2023

- Added Livestream Time Tooltips (v3.16.4 ~ v3.16.11)
- Implementation Change for playback backward's seeking/reloading chat messages (v3.16.3 ~ v3.16.10)

### VER. v3 (Stable) [3.16.2](https://greasyfork.org/scripts/428651-tabview-youtube?version=1134052) - 02 Jan 2023

### VER. v3 (Stable) [3.15.8](https://greasyfork.org/scripts/428651-tabview-youtube?version=1133222) - 30 Dec 2022 (Obsolete)

### VER. v3 (Beta) [3.8.6](https://greasyfork.org/scripts/428651-tabview-youtube?version=1121481) - 27 Nov 2022 (Obsolete)

### VER. v3 (Beta) [3.6.14](https://greasyfork.org/scripts/428651-tabview-youtube?version=1119628) - 21 Nov 2022

- Reduce DOM Manipulation Checking by using YouTube Event Driven Mechanism

## V2

### VER. v2 (Stable) [2.12.2](https://greasyfork.org/scripts/428651-tabview-youtube?version=1115180) - 09 Nov 2022

- Darker Dark Theme (Cinematics) [2022.10 Official] Support

### VER. v2 (Semi-Obsolete, Stable) [2.9.9](https://greasyfork.org/scripts/428651-tabview-youtube?version=1082858) - 18 Aug 2022

- Miniview Support & 'Teaser UI' [2022.02~2022.07 Experimental] Support

## V1

### VER. v1 (Obsolete) [1.8.51](https://greasyfork.org/scripts/428651-tabview-youtube?version=1046028) - 1 May 2022 (Broken since 2022/07/12)

- First Version

### VER. v0 (Obsolete) 0.1 - 30 Jun 2021

- Initial Version
