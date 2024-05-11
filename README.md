# Copy EditorGPT Turbo 3000
A web app that sends text to OpenAI for copy editing.

<h2>Welcome to Copy EditorGPT Turbo 3000!</h2>
This web app helps you utilize OpenAI's GPT3.5 engine to copy edit your documents. Submit a .txt file with writing of any kind, and the site will return a document that has been edited for spelling, grammar, punctuation, syntax, and other specifications of the Chicago Manual of Style.<br><br> 

While ChatGPT and the OpenAI API have length limitations for submissions, this web app will handle almost any length behind the scenes, breaking down large documents into chunks of about one thousand words, submitting them in successive API calls, then returning the results in one file. Be mindful that this app breaks documents down by paragraph, so if your document has huge paragraphs (specifically, two successive paragraphs totaling more than about 1500 words), then it may resort in an error. 

<h3>How to Install</h3>
Included in this repository is the single app folder "copyeditor" which can be installed into a standard Django project environment.<br><br> 

Remember to alter the Django project's settings.py file:<br>
`INSTALLED_APPS = ['copyeditor']`<br>
`AUTH_USER_MODEL = "copyeditor.User"`

And alter the the project's urls.py file to include the app URLs:<br><br>
`from django.urls import path, include`<br><br>
`urlpatterns = [path("", include("copyeditor.urls"))]`

The requirements.txt includes three required libraries: Diff-match-patch, Python-docx, and Marvin. Diff-match-patch, and Python-docx are used to manage text comparison and creating a downloadable Word file, while the Marvin library will manage other dependencies to make API calls to large language models.

<h3>How to Use</h3>

<h4>API key</h4>
If you don't have an API key, head to <a href="https://platform.openai.com/account/api-keys/" target="_blank">OpenAI's API page</a> and create an account. You will also need to set up a payment method, as the API does cost a negligible amount for usage. Once you obtain an API key, save it in your account settings.<br><br>

How much does it cost? The short answer is, very little.<br><br>
This app is using the gpt-3.5-turbo-instruct model, which costs $0.0015 per one thousand tokens of usage. Analysis of one thousand words will use about 2,500 tokens. So, editing a full-length article will run you about ten cents. A novel of one hundred thousand words will run you about half the cost of a cup of coffee.

<h4>Uploader</h4>
On the uploader page, you may submit a text file, Word document, or paste your text directly into the web page. Click submit and let ChatGPT do the work! Longer pieces will require about 20 seconds per thousand words, so if you are editing a long piece, please have patience!

<h4>Workshop</h4>
All of your submissions are stored in the workshop. Click on an article to review ChatGPT's edits against your submission. If reviewing an article after you have already saved changes, you will only see the remaining edits that were not saved. Removed text appears in red, while inserted text appears in green.

<h3>Updates and Contributions</h3>
There are a number of updates in the works, and contributions along these lines are welcomed.

<h4>Ability to customize prompts and depth of editing</h4>
Currently, the settings on the API call are fixed, but it would not be difficult to implement a frontend panel which lets the client alter some of the settings. They may want to alter the prompt, style guide to follow, "temperature," or other settings. These will need to be succinctly explained to the user and made easy to alter through a menu.

<h4>Use of OpenAI Assistants</h4>
Further tuning of prompts and experimentation with other models are necessary to ensure optimization of results. Currently, the Assistant tends to over-edit the prose. This issue could be tackled by using a lower "temperature" or by using more effective prompts.

<h3>Thanks for reading!</h3>
Thank you for reading and please contribute if you are interested in Django, editing with language models, or improving frontend design!