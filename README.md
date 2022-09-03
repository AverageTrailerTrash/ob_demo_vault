# ob_demo_vault
This will contain an (?) Obsidian vault that demonstrates a more extensible version of my category & automation system. I started this version because the way I initially implemented it in my personal vault (via pure Templater) is very ineffcient when I need to add new categories, metadata keys/values, templates, features... or extend similar systems to additional vaults. And I think others will benefit from the results once it's fleshed out.

(This repo may also include some secondary applets to manage local files and further enhance Obsidian, plus documentation and general tips about organization, notetaking, etc.)

Note that this version of the system is in the very early stages; if you're peeking in before any proper releases, expect things to break.

## Status: 

* Does **not** have all the base scripts and templates needed for new users to get started. 

* Currently working on rebuilding the scripts to use the Dataview API for greater efficiency.

* [See more.](https://github.com/AverageTrailerTrash/ob_demo_vault/tree/main/base_demo_vault#readme)

## Primary Use

This setup is designed with creative work and general organization in mind.

It's based on the following principles:

* **Permanence**: What we care about should have a permanent identity and place to live.
* **Interopability**: Programs should be able to interact with each other & the broader system.
* **Flexibility**: Our notes and systems shouldn't be locked into someone else's templates.
* **Automatism**: We should be able to work on our projects in a comfortable flow state.
* **Simplicity**: The systems we use should be plain, logical, and easy to build onto.

## Contents
* **base_demo_vault**: This will include just the base scripts, folders, etc. needed to implement the category-ID system, including tools to convert existing vaults.
* **main_demo_vault**: This will include additional systems that balance out the structure of the category-ID system with tools for more freeform note creation.
* **individual_packages**: This will include each system from the other vaults & more as separate add-ons that can be installed to any vault based on this struture. 
* **applets**: This will include small programs for desktop users to help vaults based on this structure communicate with each other and the rest of your computer.

[Documentation can now be found at the wiki.](https://github.com/AverageTrailerTrash/ob_demo_vault/wiki) Note that it is incomplete. The code is still in a highly volatile state with frequent refactorings etc. as we find a base system that's logically sound and efficient enough to build features overtop of.

My intention is for new users to start with the main vault to give Obsidian some structure, then add only packages that suit them over time, so as to extend its capabilities without having to reinvent the wheel. Eventually, I hope others will share their own add-ons that solve problems they faced as well.

## Required Plugins
This list will change over time as I flesh out the system.
* **CustomJS**: allows us to break js into reusable functions in multiple files. This keeps me sane & the code flexible, extensible...
* **Dataview**: more advanced queries, api gives easy access to metadata. The makes the code run much faster than accessing files every time.
* **Metadata Menu**: allows us to edit metadata values efficiently & suggest entries. You won't have to remember every value for consistency.
* **Advanced URI**: link notes from external tools & run commands from links. This simplifies cross-vault and cross-program workflows. 
 
**Core Plugins**: File Explorer, Quick Switcher, Search, Templates

## Recommended Plugins
* **Templater**: assign templates to folders, insert text w/ js more easily
* **Workspaces Plus**: allows us to save and load workspaces as commands
* **Commander**: allows us to install commands as icons in any sidebar
* **Recent Files**: quickly access recent files from sidebar
* **Various Complements**: IDE-style autofill / text suggestions
* **Advanced Tables**: painless markdown table creation
 
**Core Plugins**: Page Preview, Workspaces

## Incompatible Plugins
**Core Plugins**: Unique Note Creator

## Recommended Shortcuts
These are keyboard shortcuts I use often and find DVORAK-friendly.
* ALT+O | Quick Switcher: Open quick switcher.
* ALT+E | Templater: Insert template modal. 
* CTRL+N | Create New Note.

## Recommended Theme
Any CSS snippets I include will be based on this theme.
* **Minimal Theme**: It's predictable and extensible. 

## Recommended Software (Windows)
These are just some other free utilities that I find helpful.
* **AutoHotkey**: text expander that will work outside of Obsidian
* **Everything** by Void Tools: very fast yet powerful search tool
* **DeskPins**: quick & easy tool to pin windows on your pc
* **Lightscreen**: quick & easy screenshot tool
* **AltDrag**: less finnicky window movement
* **ReNamer**: quickly rename files in bulk (don't use in vaults!)
* **Notepad++**: lightweight text editor with dark theme & code highlights
* **VSCode**: lightweight IDE that can open folders as projects
* **Audacity**: record and edit audio files
* **Krita**: create and edit raster images, simple animations
* **OBS Studio**: for recording videos and livestreaming 
* **LibreOffice**: handles rich text, spreadsheets, slideshows & more
