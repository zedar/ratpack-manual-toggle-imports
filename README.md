## PoC for collapsing imports in [ratpack](http://ratpack.io/) manual/docs

### Javascript code
Required changes are in ```js/import.js``` file.
Dependency with jquery.
Works for code samples in Groovy and Java.

All DOM operations depend on the way [prismjs](http://prismjs.com/) library constructs DOM. Prismjs is lib for source code highlighting.

### Css code
Added two new classes for folded and open section with imports. Currently in ```css/stylesheet.css```

    .gutter-folded:before {
      content: "\25B8";
      position: absolute;
      left: 5px;
    }

    .gutter-open:before {
      content: "\25BE";
      position: absolute;
      left: 5px;
    }

### Html

The ```page.html``` is sample page generated by ```ratpack-manual``` subproject.