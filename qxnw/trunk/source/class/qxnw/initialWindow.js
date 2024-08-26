qx.Class.define("qxnw.initialWindow", {
    extend: qx.core.Object,
    properties:  {
        widget:  {
            check: "qx.ui.container.Composite"
        }
    },
    construct: function (backGroundImage, logo){
        this.base(arguments);
        var composite = new qx.ui.container.Composite(new qx.ui.layout.Dock());
        
        var leftContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        leftContainer.set({
            minWidth: 200,
            maxWidth: 200
        });
        leftContainer.set({
            backgroundColor: "white"
        });
        composite.add(leftContainer, {
            edge: "west"
        });
        
        var rightContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        rightContainer.set({
            minWidth: 200,
            maxWidth: 200
        });
        rightContainer.set({
            backgroundColor: "white"
        });
        composite.add(rightContainer, {
            edge: "east"
        });
        
        var upContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        upContainer.set({
            minHeight: 50,
            maxHeight: 50
        });
        upContainer.set({
            backgroundColor: "white"
        });
        composite.add(upContainer, {
            edge: "north"
        });
        
        var centerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        centerContainer.set({
            minHeight: 200,
            maxHeight: 600
        });
        centerContainer.set({
            backgroundColor: "white"
        });
        composite.add(centerContainer, {
            edge: "center"
        });
        
        var gridLayout = new qx.ui.layout.Grid();
        gridLayout.setColumnFlex(1,2,3,4);
        
        var gridContainer = new qx.ui.container.Composite(gridLayout);
        centerContainer.add(gridContainer);
        
        var firstContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        firstContainer.set({
            minHeight: 100,
            backgroundColor: "white",
            maxWidth: 100
        });
        
        gridContainer.add(firstContainer, {
            row: 1,
            column: 1
        });
        
        var imageContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        imageContainer.set({
            minHeight: 900,
            maxHeight: 900,
            maxWidth: 800,
            minWidth: 800,
            backgroundColor: "white"
        });
        var myBackgroundImage = new qx.ui.decoration.Background('#000');
        if (typeof backGroundImage != 'undefined' && backGroundImage!=""){
            myBackgroundImage.setBackgroundImage(backGroundImage);
        }
        myBackgroundImage.setBackgroundRepeat("no-repeat");
        imageContainer.set({
            decorator : myBackgroundImage
        });
        gridContainer.add(imageContainer, {
            row: 1,
            column: 2 
        });
        
        var logoContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        logoContainer.set({
            minHeight: 100,
            minWidth: 100
        });
        var myBackgroundLogo = new qx.ui.decoration.Background('#000');
        if (typeof logo != 'undefined' && logo != ""){
            myBackgroundLogo.setBackgroundImage(logo);
        }
        myBackgroundLogo.setBackgroundRepeat("no-repeat");
        /*logoContainer.set({
            decorator : myBackgroundLogo
        });*/
        gridContainer.add(logoContainer, {
            row: 1,
            column: 3
        });
        
        this.setWidget(composite);
        
        var borderColor = "black";
        var border = new qx.ui.decoration.Single(3, "solid", borderColor);
        
        composite.set({
            backgroundColor: "white",
            decorator: border
        });
    }
})