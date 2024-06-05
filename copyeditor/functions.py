import textwrap, re
from openai import OpenAI
from openai import AuthenticationError
from diff_match_patch import diff_match_patch


def run_editor(submit_text, key):
    """
    Called in 'uploader' in 'views.py'
    """

    edited_text = ""
    run_count = 0
    chunk_count = (len(submit_text) // 4000) + 1 #for updating progress on terminal
    wrapped_text = textwrap.wrap(submit_text, width=4000, replace_whitespace=False, drop_whitespace=False)
    
    #OpenAI API call
    client = OpenAI()
    client.api_key = key
    prompt = "You are a professional copy editor who fixes typos and grammatical mistakes in text. You follow the Chicago Manual of Style for writing numbers, capitalization, headers, and punctuation. You make minimal edits to the voice or style of the prose."
    
    for submit_chunk in wrapped_text:
        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": submit_chunk}
                ]
            )
            edited_text += str(completion.choices[0].message.content)
        
        #invalid key error
        except AuthenticationError:
            return "key invalid"

        #Prints progress to terminal. Need to get something working for client side.
        run_count += 1
        print("Finished {:.0%}".format(run_count / chunk_count))
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