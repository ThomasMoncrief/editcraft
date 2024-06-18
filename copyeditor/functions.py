import textwrap, re
from openai import OpenAI
from openai import AuthenticationError
from diff_match_patch import diff_match_patch
from json import dumps, loads

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
    Use diff-match-patch to return a string of diffs data.
    Later, json.loads() is used to render the diffs into a list.
    """

    dmp = diff_match_patch()
    dmp.Diff_Timeout = 0
    diffs = dmp.diff_main(original_text, edited_text)
    dmp.diff_cleanupSemantic(diffs)

    # make the list of diffs a string so SQLite can store it
    diffs = dumps(diffs)
    return diffs

    
def create_html(diffs):
    """
    Called in 'workshop_render'. Builds the HTML page from the diffs and original text.
    """
    # "unpack" the diff data back into a list
    diffs = loads(diffs)
    dmp = diff_match_patch()
    html = []
    
    # This is the dmp.diff_prettyHtml method with added lines (commented below) so that we can
    # separate inserted or deleted <br> tags ("\n" characters) into their own HTML elements.
    for op, data in diffs:
        text = (
            data.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\n", "<br>")
        )
        if op == dmp.DIFF_INSERT:
            if text != "<br>": 
                text = re.sub(r'<br>', r'</ins><ins><br></ins><ins>', text) #added for this project
            html.append('<ins>%s</ins>' % text)
        elif op == dmp.DIFF_DELETE:
            if text != "<br>": 
                text = re.sub(r'<br>', r'</del><del><br></del><del>', text) #added for this project
            html.append('<del>%s</del>' % text)
        elif op == dmp.DIFF_EQUAL:
            html.append("<span>%s</span>" % text)

    return "".join(html)