import textwrap, re
from openai import OpenAI
from openai import AuthenticationError
from diff_match_patch import diff_match_patch


def run_editor(submit_text, key):
    """
    Called in 'uploader' in 'views.py'
    """

    #OpenAI API call
    client = OpenAI()
    client.api_key = key
    prompt = "You are a professional copy editor who fixes typos and grammatical mistakes in text. You follow MLA style for making corrections. You make MINIMAL edits to the voice or style of the prose, only correcting when there are obvious errors."
    edited_text = ""
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": submit_text}
            ],
            stream=True
        )

        for chunk in completion:
            if chunk.choices[0].delta.content is not None:
                print(chunk.choices[0].delta.content, end="")
                edited_text += chunk.choices[0].delta.content
        #invalid key error
    except AuthenticationError:
        return "key invalid"

    return edited_text


def get_title(text):
    """
    Called in 'uploader'
    Take result text from uploader() and generate a title.
    Selects first 50 characters. If there is a line-break before the first 50, the title will end there.
    """
    text = text[:50].split("\n")
    #clear any blank lines at top. Response saved from chatGPT usually has one.
    if text[0] == "":
        text = text[1:]
    title = text[0]
    return title


def compare_text(original_text, edited_text):
    """
    Called in 'workshop_render'. Builds a set of text to show the user on the HTML page.
    """

    dmp = diff_match_patch()
    dmp.Diff_Timeout = 0
    diffs = dmp.diff_main(original_text, edited_text)
    dmp.diff_cleanupSemantic(diffs)
    
    html_preview = dmp.diff_prettyHtml(diffs)
    
    #clean out blank <ins> tags which diff_prettyHtml creates
    pattern = re.compile(r'<ins>\s*</ins>')
    html_preview = re.sub(pattern, '', html_preview)
    return html_preview