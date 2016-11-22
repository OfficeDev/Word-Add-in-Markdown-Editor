# Word Add-in Markdown Editor

Learn how you use the the add-in after you've installed it.    

## Table of Contents
* [Change History](#change-history)
* [Overview](#overview)
* [Add-in capabilities](#capabilities)
* [Instructions for using the add-in](#instructions)
* [Questions and comments](#questions-and-comments)
* [Additional resources](#additional-resources)

## Change History

November 2016:
* Initial sample version.


## Overview
The Word Add-in Markdown Editor add-in is designed to make working with markdown file, tables, adding images, etc, easier. You can use Word to edit the document . When you’re ready to sync the changes to GitHub, the add-in converts the document to markdown and uploads it to GitHub.  You don’t have to format it to markdown; the add-in does it for you.
 >  **Note:** For instructions on how to install and run the add-in, see [ReadMe] (..\ReadMe.md)


## Add-in capabilities
The add-in in has the following capabilities:
1.	Sign in to GitHub from within Word.
2.	Browse your personal and organizational repositories.
3.	Mark favorite repositories so you can quickly access them in the future.
4.	Browse the markdown files in your repos, drilling down into folders.
5.	Create new markdown files in the folder structure you want in a repositories.
6.	Ability to create object definition, sample readme, conceptual documents based on predefined templates, as well as blank documents.
7.	Edit markdown files. Support includes text, lists, tables, pictures, hyperlinks, etc.
8.	Sync to GitHub.
9.	Pull the latest from GitHub.
10.	Get notification in case of a merge conflict.


## Instructions for using the add-in
Try out the add-in and use it to do the usual things you’d do to create your typical markdown files. There are, however, a few things to point out:


### Styles
GitHub only supports HTML styles. Therefore, instead of using Title, Subtitle, etc., use Heading1, Heading2, etc. in your Word documents. 

### Bulleted and numbered lists
- Although you can edit lists that already exist in a document, if you want to start a new list, you cannot use the lists UI in Word (for now). To work around this, the add-in has two buttons – **Insert Bullets** and **Insert Numbering**, on the **File Details** page. Use them when you want to start a new list and once the list is inserted, you can edit them. 
- Only two levels of nesting are supported in lists. In addition, for now, each list inserted this way needs to be followed by a paragraph (the paragraph can be empty).

### Code
If you want to insert new code fragments and style them as code, you can do so using the **HTML Code** style in Word. However, this may not be as straightforward as it seems because Word only shows the recommended styles by default in the UI. To get the **HTML Code** style to show up in the UI, you need to follow these steps once. 
1.	At the bottom of the style pane, click on the **options...** hyperlink to display the **Style Pane Options** dialog.
2.	In the **Select Styles to Show** drop down, select **All Styles**. Click **OK**.  

You should now see all the styles in the **Styles** box. When you want to format a selection as code, simply apply the **HTML Code** style to it.


### Favorite repositories
For repositories you access often, you can add them as favorites. You can then easily access them in the future from the hamburger menu which is displayed at launch, skipping the repositories screen altogether. 
> **Note:** Currently there is no indicator that made a repository a favorite on the repositories screen. 

## Questions and comments

We'd love to get your feedback about this sample. You can send your feedback to us in the *Issues* section of this repository.

Questions about Microsoft Office 365 development in general should be posted to [Stack Overflow](http://stackoverflow.com/questions/tagged/office-js+API). Make sure that your questions are tagged with [office-js] and [API].

## Additional resources

* [Office add-in documentation](https://msdn.microsoft.com/en-us/library/office/jj220060.aspx)
* [Office Dev Center](http://dev.office.com/)
* [Office 365 APIs starter projects and code samples](http://msdn.microsoft.com/en-us/office/office365/howto/starter-projects-and-code-samples)

## Copyright
Copyright (c) 2016 Microsoft Corporation. All rights reserved.
