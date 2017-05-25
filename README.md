# Photos

Hi!

This repository is meant to contain the bulk of my photo-processing scripts.
I take many photos, and have some specific needs for processing and organising my photo collection.
I had a few issues for which I could not find satisfactory available software:

1. Creating "contact sheets": I needed a way to review thousands of (mostly raw .ORF)  photos that are distributed over several folders. I created a script that extracts JPEG thumbnails from the raw files and dumps them all in the same folder (see mksample below).

1. Reviewing "contact sheets": I needed a way to browse the generated "contact sheet" JPEGs. I do not know any software to quickly and easily browser a folder with thousands of photos. Well just opening the folder in exporer works OK (depending on the OS). Now I have created a web interface for the same purpose, with infinite scrolling at the bottom and top. I am planning to enable it to do more, such as organising or searching photos by tags, compiling and sending to facebook or zip file, etc.


## Sample Generation

mksample is a Linux bash script (tested on Ubuntu / Debian)
This is how you can use mksamples:
```
find ~/photo/originals | ./mksamples ~/photo/out/
```

What this does is generate a list of files using `find`, feed this list to mksamples, with one argument which is the destination directory.
mksamples will try to open every raw file in the given list, generate "samples" (at the moment two: "thumb" and "large") and save the results in ~/photo/out

It is tested with ORF files. It should work for other formats with minor alteration.

It requires package netpbm (or alternatively can be made to work with imagemagick) and dcraw.
