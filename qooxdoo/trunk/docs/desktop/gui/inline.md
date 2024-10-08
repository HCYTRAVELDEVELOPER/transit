# Inline Widgets

This page describes how you can use Qooxdoo widgets inside HTML-dominated pages.
This use case is different from creating a regular, "standalone" Qooxdoo
application.

## Target Audience

Integrating Qooxdoo widgets into existing HTML pages could be interesting to all
users who already have (many) existing pages, often some kind of "portal", and
therefore don't want to transform these into a standalone rich Internet
application (RIA).

## Online Demos

Take a look at the online demos to see the use of inline widgets in action.

- [Absolute positioning demo](apps://demobrowser/demo/root/Page.html)
- [Page flow using Inline](apps://demobrowser/demo/root/Inline.html)
- [Dynamic resize for Inline](apps://demobrowser/demo/root/Inline_Dynamic_Resize.html)
- [Inline window](apps://demobrowser/demo/root/Inline_Window.html)

## Set Up An Inline Application

An inline application is set up by using the `create-application` script
described in the Hello World
getting_started/helloworld.md#create_your_application section. You just have to
add the additional option `-t` with the value `inline` and you're done.

```
/opt/qooxdoo-sdk/tool/bin/create-application.py -n myapp -t inline
```

Once executed you get a skeleton application which is ready-to-use to develop an
inline application. The skeleton also demonstrates the different integration
approaches which are described in the next section.

## Ways of Integration

There are basically two ways to integrate a Qooxdoo widget into an existing
HTML-dominated page:

- positioning a widget with absolute coordinates (maybe overlaying existing
  content)
- adding the widget within the page flow by using an existing DOM node as an
  isle

Which way you should choose depends on what you wish to achieve. Technically
both share the same foundation.

Instead of using `qx.application.Standalone` as a base application class you
need to extend from `qx.application.Inline` as a starting point. So basically
your (empty) application looks like this:

```javascript
qx.Class.define("myPortal.Application",
{
  extend : qx.application.Inline,

  members :
  {
    main()
    {
      super.main();

      // your code follows here
    }
  }
});
```

### Absolute Positioning

Adding a widget to the page without regarding the page flow is a no-brainer.
Just create the desired widget and add it to the application root. As the
application root is an instance of  
[qx.ui.layout.Basic](apps://apiviewer/#qx.ui.layout.Basic) you can only use
`left` and `top` coordinates to position your widgets.

> :memo: Absolute positioning requires no existing DOM node in the target document.

```javascript
qx.Class.define("myPortal.Application",
{
  extend : qx.application.Inline,

  members :
  {
    main()
    {
      super.main(arguments);

      // add a date chooser widget
      var dateChooser = new qx.ui.control.DateChooser();

      // add the date chooser widget to the page
      this.getRoot().add(dateChooser, { left : 100, top : 100 });
    }
  }
});
```

### Page Flow

However, the former solution won't fit for e.g. a portal where the page is
divided into several parts. In this case you won't have any absolute coordinates
you could work with reliably.

To add widgets at certain locations inside the page you can create or reuse DOM
nodes which act as islands where the Qooxdoo widgets live in regard to the page
flow.

> :memo: You need to define specific DOM nodes in your document which act as islands
> for the Qooxdoo widgets.
>
> Additionally if you use the dynamic mode (automatic resizing) it is important
> that the used DOM node is **not** styled using CSS rules concerning the
> _width_ and _height_ attribute. Instead style your DOM node with inline
> styles, otherwise the dynamic resizing won't work correctly.

```javascript
qx.Class.define("myPortal.Application",
{
  extend : qx.application.Inline,

  members :
  {
    main()
    {
      super.main();

      // create the island by connecting it to the existing
      // "dateChooser" DOM element of your HTML page.
      // Typically this is a DIV as in <div id="dateChooser"></div>
      var dateChooserIsle = new qx.ui.root.Inline(document.getElementById("dateChooser"));

      // create the date chooser widget and add it to the inline widget (=island)
      var dateChooser = new qx.ui.control.DateChooser();
      dateChooserIsle.add(dateChooser);
    }
  }
});
```
