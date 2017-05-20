# spod (spit out data)
a little cli for spitting out data about a flat directory containing some json and markdown.

`npm i spod -g`

## example
take a directory of directories

```
/example
  /an-entry-name
    - data.json
    - text.md
  /another-one
    - data.json
    - text.md
    - image.jpg
```

and output a json file to the root directory

```
/example
  /an-entry-name
  /another-one
  - data.json
```

which looks like this

```
{
  "an-entry-name": {
    "path": "an-entry-name",
    "title": "An Entry Name",
    "tags": ["whatever", "yeah"],
    "text": "This was contained in the markdown. Title and tags where in the json. Path was added automatically."
  },
  "another-one": {
    "path": "another-one" ,
    "title": "Another One",
    "date": "4/20/17",
    "text": "You can add arbitrary date to the json."
  }
}
```

i’m using this to create a psuedo-api of content which is hosted on github pages. i then made a separate stateful app which loads the data.json and can pull in any assets based off the directory name.

the idea is to separate the site and the content. with a simple enough taxonomy i can re-use this structure across versions of my personal site. pretty highly specific, but, yeah.

somewhat related is [json feed](https://jsonfeed.org/version/1), although this follows a different formatting convention (perhaps this should be unified?)

## usage

### `spod add [dirname]`
- add/update entry to the log data

### `spod remove [dirname]`
- remove from the log data

### `spod watch`
- watch added entries for changes and write to the log.
- spins up a local server at port `3000` to access `/data.json`

## todo
- testing
- clean up entry methods
- use args for watch to use server, port, etc…
- add arg for including markdown text or not in the json