# Excel-Add-in-JS-WoodGrove-Expense-Trends

The WoodGrove Bank Expense Trends add-in demonstrates how you can use the new JavaScript API for Microsoft Excel 2016 to create a compelling Excel add-in. With Expense Trends, you can import expense transactions into the workbook, create dashboard and trackers, view and analyze trends, and track special transactions such as charitable donations and follow up items. The sample provides two experiences: one with task pane and another with add-in commands. The following figures show the main screens of this add-in.

_Applies to: Excel 2016, Excel for iPad, Excel for Mac_

![WoodGrove Bank Expense Trends Add-in - Ribbon] (images/woodgrove_taskpane_ribbon.PNG)

## Table of Contents

* [Prerequisites](#prerequisites)
* [Run the project](#run-the-project)
* [Additional resources](#additional-resources)

## Prerequisites

You'll need:

* [Visual Studio 2015](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
* [Office Developer Tools for Visual Studio](https://www.visualstudio.com/en-us/features/office-tools-vs.aspx)
* Excel 2016, version 6769.2011 or later

## Properties
| Property	   | Type	|Description
|:---------------|:--------|:----------|
|style|string|Gets or sets the style used for the body. This is the name of the pre-installed or custom style.|
|text|string|Gets the text of the body. Use the insertText method to insert text. Read-only.|

_See property access [examples.](#property-access-examples)_

## Relationships
| Relationship | Type	|Description|
|:---------------|:--------|:----------|
|contentControls|[ContentControlCollection](contentcontrolcollection.md)|Gets the collection of rich text content control objects that are in the body. Read-only.|
|font|[Font](font.md)|Gets the text format of the body. Use this to get and set font name, size, color, and other properties. Read-only.|
|inlinePictures|[InlinePictureCollection](inlinepicturecollection.md)|Gets the collection of inlinePicture objects that are in the body. The collection does not include floating images. Read-only.|
|paragraphs|[ParagraphCollection](paragraphcollection.md)|Gets the collection of paragraph objects that are in the body. Read-only.|
|parentContentControl|[ContentControl](contentcontrol.md)|Gets the content control that contains the body. Returns null if there isn't a parent content control. Read-only.|

## Method details

### clear()
Clears the contents of the body object. The user can perform the undo operation on the cleared content.

#### Syntax
```js
bodyObject.clear();
```

#### Parameters
None

#### Returns
void

#### Examples
```js
// Run a batch operation against the Word object model.
Word.run(function (context) {

    // Create a proxy object for the document body.
    var body = context.document.body;

    // Queue a commmand to clear the contents of the body.
    body.clear();

    // Synchronize the document state by executing the queued commands,
    // and return a promise to indicate task completion.
    return context.sync().then(function () {
        console.log('Cleared the body contents.');
    });
})
.catch(function (error) {
    console.log("Error: " + JSON.stringify(error));
    if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
});
```

The [Silly stories](https://aka.ms/sillystorywordaddin) add-in sample shows how the **clear** method can be used to clear the contents of a document.

## Support details

Use the [requirement set](https://msdn.microsoft.com/EN-US/library/office/mt590206.aspx) in run time checks to make sure your application is supported by the host version of Word. For more information about Office host application and server requirements, see [Requirements for running Office Add-ins](https://msdn.microsoft.com/EN-US/library/office/dn833104.aspx).


[body.insertOoxml]: https://github.com/OfficeDev/Word-Add-in-DocumentAssembly/blob/master/WordAPIDocAssemblySampleWeb/App/Home/Home.js#L127 "insert OOXML"
[body.insertParagraph]: https://github.com/OfficeDev/Word-Add-in-DocumentAssembly/blob/master/WordAPIDocAssemblySampleWeb/App/Home/Home.js#L153 "insert paragraph"
[body.search]: https://github.com/OfficeDev/Word-Add-in-DocumentAssembly/blob/master/WordAPIDocAssemblySampleWeb/App/Home/Home.js#L261 "body search"