const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElemenet = document.querySelector('#image-upload-control img');

function updateImagePreview(){
    const files = imagePickerElement.files;
    if(!files || files.length === 0){
        imagePreviewElemenet.style.display = 'none';
    }

    const pickedFile = files[0];
    imagePreviewElemenet.src = URL.createObjectURL(pickedFile);
    imagePreviewElemenet.style.display = 'block';
}


imagePickerElement.addEventListener('change', updateImagePreview);