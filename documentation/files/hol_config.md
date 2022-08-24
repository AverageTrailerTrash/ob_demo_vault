# File Usage: hol_config.md
This file holds configuration information needed for the base vault and the manageIDs class. Keys and values are divided Dataview-style, with two colons and a space.

## startingID
This is the minimum ID number you would like your files to have. I like starting from 50 because I stress less about what file is "#1," so that's the default value. But you can set it to whatever you like.

## catLength
This is the number of characters used in your categories. Having a consistent length simplifies parsing through everything, which is why it's enforced. Some things to consider when deciding on a category length and your personal naming conventions:

* How many combinations are possible? If you're only using two characters and numbers 1-9, you can only have 81 categories. I use three character alphanumeric categories, which has something like over 13k possibilites -- you're not going to run out of options there.

* How legible are your categories? While I like the aesthetic of three-letter categories and find them easy to remember, I know others can find it overwhelming / hard to parse what means what. In that case, 4-6 character categories may make more sense.

* How easy is it to read through and navigate your files? It can be hard to see the actual name of your file when you get into IDs that are too long, especially when browsing with the graph view or using your file explorer while it's minimized. 6-8+ looks cluttered.