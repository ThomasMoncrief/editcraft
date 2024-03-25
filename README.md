# Copy EditorGPT Turbo 3000
A web app that sends text to OpenAI for copy editing.

<h1>Welcome to Copy EditorGPT Turbo 3000!</h1>
This web app helps you utilize OpenAI's GPT3.5 engine to copy edit your documents. Submit a .txt file with writing of any kind, and the site will return a document that has been edited for spelling, grammar, punctuation, syntax, and other specifications of the Chicago Manual of Style. 

While ChatGPT and the OpenAI API have length limitations for submissions, this web app will handle almost any length behind the scenes, breaking down large documents into chunks of about one thousand words, submitting them in successive API calls, then returning the results in one file. Be mindful that this app breaks documents down by paragraph, so if your document has huge paragraphs (specifically, two successive paragraphs totaling more than about 1500 words), then it may resort in an error. 

<h3>How to Install</h3>
Included in this repository is the single app folder "copyeditor" which can be installed into a standard Django project environment. 

Remember to alter the Django project's settings.py file:<br>
`INSTALLED_APPS = ['copyeditor']`<br>
`AUTH_USER_MODEL = "copyeditor.User"`

And alter the the project's urls.py file to include the app URLs:<br>
`from django.urls import path, include`<br>
`urlpatterns = [path("", include("copyeditor.urls"))]`

The requirements.txt includes three required libraries: Diff-match-patch, Python-docx, and Marvin. Diff-match-patch, and Python-docx are used to manage text comparison and creating a downloadable Word file, while the Marvin library will manage other dependencies to make API calls to large language models.

<h3>How to Use</h3>

<h4>API key</h4>
If you don't have an API key, head to <a href="https://platform.openai.com/account/api-keys/" target="_blank">OpenAI's API page</a> and create an account. You will also need to set up a payment method, as the API does cost a negligible amount for usage. Once you obtain an API key, save it in your account settings.

How much does it cost? The short answer is, very little.<br>
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

<h3>Distinctiveness and Complexity</h3>
Per the requirements of CS50W's specification, the following is a defense on the distinctiveness of this project in comparison to other class projects and its complexity of implementation.

<h4>Distinctiveness</h4>
This project stands apart from other CS50W projects as it offers a unique functionality - the ability to edit text. Not only is this project distinct from CS50W projects, it is also quite distinct from popular services available on the web. While projects such as "Search", "Wiki", "Commerce," and "Mail" each have the student create a replica of a well-known site (respectively, Google, Wikipedia, eBay, and Gmail"), Copy EditorGPT Turbo 3000 seeks to provide an innovative service that is diffficult to find on the web. Certainly there are services which edit a user's text for grammar and style, most notably Grammarly. But, given OpenAI's relatively new availabilty for API usage by developers, there are very few services which utilize this specific LLM for the purpose of providing copyediting services to a user. With OpenAI's GPT3.5 Turbo and GPT4 being known as the most powerful and accurate language models on the internet, Copy EditorGPT Turbo 3000 aims to provide the absolute best copy editing service available. With the relatively low token cost of the "gpt-3.5-turbo-instruct" engine, as explained above, along with many other powerful engines available from OpenAI, Copy EditorGPT Turbo 3000 seeks to lead the way towards a society completely free of typographical and grammatical errors in written word. No longer will a reader be confused by a body of text with poor punctuation or inconsistent grammar. With a wide range of possibilities for prompt customization, which will become available as this project remains in development, Copy Editor GPT Turbo 3000 will one day be able to serve as the ultimate tool for assisting writers.

<h4>Complexity</h4>
This project utilizes three additional Python packages: OpenAI, Python-docx, and Diff-Match-Patch. Utilizing these packages required me to read and understand more documentation files than what was required by the other projects. Copy EditorGPT Turbo 3000 does not just accept text pasted into a browser window, but can also handle text uploaded in two formats: .txt or .docx. This flexibility in functionality required me to gain a deeper understanding of how text is formatted between different file types and in browser windows. I also encountered challenges due to different character encodings between text files and the results returned by the OpenAI response. For example, directional quotation marks and emoji characters often resulted in unnecessary corrections being made to the edited text. Most importantly, this project makes use of an API call that requires a secret key to be provided. This presented new challenges, including selecting the most appropriate API model and parsing through a result returned as a JSON object. Along with these challenges, this project also implements concepts from previous projects, such as user models, using JavaScript to update the HTML document, asynchronous "PUT" and "GET" requests, and extensive CSS styling.

<h4>Additional Files</h4>
In addition to the standard set of Python files found in a Django app, I have included one additional file - "functions.py". This file contains four functions, three of which are called by the "uploader" function in "views.py". Most of the logic directly written in the "uploader" function verifies the text submitted by the user and prepares it in a "submit_text" variable so that paragraph formatting will be correctly preserved. The "run_editor" function from "functions.py" is then called. This function ensures that only 4000 characters are submitted to OpenAI in an API call and that the submission chunk does not cut the text in the middle of a word. It then calls the "openai_api" function to make the API call with the submission text and the prompt instructing the engine to perform copy editing. The result is stored in an "edited_text" variable. The "run_editor" function then eliminates from the "submit_text" variable the 4,000 characters which have been edited, and continues its processing until the "submit_text" is empty. Results successively returned by the "openai_api" function are added into the "edited_text" variable. Just before the "uploader" function finishes, the "get_title" function takes the result text and creates the title for the file by using the first paragraph or the first 50 characters in the text. The final function in this file, "compare_text," uses the Diff-Match-Patch library to render a comparison of the original text and the edited text in the browser window. After the user accepts or rejects changes and saves the results, the "compare_text" function will be called whenever the user views their file in the Workshop. The saved results will always be compared to the edited text returned by OpenAI, in case there are changes that the user wants to consider accepting later on.