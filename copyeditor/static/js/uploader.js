document.addEventListener('DOMContentLoaded', () => {
    console.log("uploader script ready");
    const uploadFile = document.getElementById('upload-file');
    const uploadText = document.getElementById('upload-text');

    document.getElementById('upload-form').addEventListener('submit', function(event) {

        if (event.submitter.value === "upload_file") {
            if (uploadFile.files.length === 0) {
                document.getElementById('blank-upload-alert').style.display = "block";
                event.preventDefault();
            }
        }
        if (event.submitter.value === "upload_text") {
            if (uploadText.value == "") {
                document.getElementById('blank-text-alert').style.display = "block";
                event.preventDefault();
            }
        }
    });
});