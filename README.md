---
topic: sample
products:
- office-word
- office-365
languages:
- typescript
- javascript
extensions:
  contentType: samples
  technologies:
  - Add-ins
  createdDate: 9/28/2016 3:29:10 PM
---
# Word-Add-in-Markdown-Editor
Learn how you can write in Word and convert the document to markdown, save to Github and vice versa.    

## Table of Contents
* [Change History](#change-history)
* [Prerequisites](#prerequisites)
* [Configure the project](#configure-the-project)
* [Run the project](#run-the-project)
* [Questions and comments](#questions-and-comments)
* [Additional resources](#additional-resources)

## Change History

November 2016:
* Initial sample version.


## Prerequisites

* Word 2016 for Windows, build 16.0.6912.1000 or later.
* [Node and npm](https://nodejs.org/en/)
* [Git Bash](https://git-scm.com/downloads) - You should use a later build as earlier builds can show an error when generating the certificates.
* GitHub account. 

## GitHub account
- You’d use your GitHub account to sign-in when prompted by the add-in.	
- Your email address should be made public in GitHub. To do this, browse to your profile page on GitHub and make the email address public. 
- Your organizational memberships should be made public in GitHub. If they are not public, those repos will not be listed in the add-in.
- The repositories you work with should be initialized and should have at least the Master branch. It may or may not have any files.
- You must grant the add-in access to browse and edit your repos when presented with this information in the dialog during sign in.


## Configure the project

Run the following commands from your Bash shell for this project:

1. Clone this repo to your local machine.
2. Navigate to **Word-Addin-Ang2-Word-to-MD/WordToGitHub** folder. Run```npm install``` command to install all of the dependencies in package.json.
3. Navigate to **Word-Addin-Ang2-Word-to-MD/WordToGitHub/certificates** folder. Run ```bash gen_cert.bat``` command to create the certificates needed to run this sample. 
* Then in the repo on your local machine, double-click ca.crt, and select **Install Certificate**. 
* Select **Local Machine** and select **Next** to continue. 
* Select **Place all certificates in the following store** and then select **Browse**.  
* Select **Trusted Root Certification Authorities** and then select **OK**. 
* Select **Next** and then **Finish** and now your certificate authority cert has been added to your certificate store.
4. Navigate to **Word-Addin-Ang2-Word-to-MD/WordToGitHub** folder. Run ```npm start``` command to start the node web server service.

Now you need to let Microsoft Word know where to find the add-in.

1. Create a network share, or [share a folder to the network](https://technet.microsoft.com/en-us/library/cc770880.aspx) and place the [word-add-in-javascript-speckit-manifest.xml](word-add-in-javascript-speckit-manifest.xml) manifest file in it.
3. Launch Word and open a document.
4. Choose the **File** tab, and then choose **Options**.
5. Choose **Trust Center**, and then choose the **Trust Center Settings** button.
6. Choose **Trusted Add-ins Catalogs**.
7. In the **Catalog Url** field, enter the network path to the folder share that contains word-add-in-js-redact-manifest.xml, and then choose **Add Catalog**.
8. Select the **Show in Menu** check box, and then choose **OK**.
9. A message is displayed to inform you that your settings will be applied the next time you start Microsoft Office. Close and restart Word.

## Run the project

1. Open a Word document.
2. On the **Insert** tab in Word 2016, choose **My Add-ins**.
3. Select the **SHARED FOLDER** tab.
4. Choose **Word Redact add-in**, and then select **OK**.
5. If add-in commands are supported by your version of Word, the UI will inform you that the add-in was loaded.

### Launch the task pane

On the Ribbon:
* Select **Home** tab and choose **Edit markdown** to launch the task pane.

 > Note: The add-in will load in a task pane if add-in commands are not supported by your version of Word.

## Questions and comments

We'd love to get your feedback about this sample. You can send your feedback to us in the *Issues* section of this repository.

Questions about Microsoft Office 365 development in general should be posted to [Stack Overflow](http://stackoverflow.com/questions/tagged/office-js+API). Make sure that your questions are tagged with [office-js] and [API].

## Additional resources

* [Office add-in documentation](https://msdn.microsoft.com/en-us/library/office/jj220060.aspx)
* [Office Dev Center](http://dev.office.com/)
* [Office 365 APIs starter projects and code samples](http://msdn.microsoft.com/en-us/office/office365/howto/starter-projects-and-code-samples)

## Copyright
Copyright (c) 2016 Microsoft Corporation. All rights reserved.




This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
