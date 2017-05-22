# photos

This is how you can use mksamples:
```
find ~/photo/originals | ./mksamples ~/photo/out/
```

What this does is generate a list of files using `find`, feed this list to mksamples, with one argument which is the destination directory.
mksamples will try to open every raw file in the given list, generate "samples" (at the moment two: "thumb" and "large") and save the results in ~/photo/out

It is tested with ORF files. It should work for other formats with minor alteration.
