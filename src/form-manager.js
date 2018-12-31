import readImageFile from './read-image-file';

export default class Form {
  constructor(onSubmmit, onCancel) {
    const e = {
      form               : document.getElementById( 'form'                 ),
      emojiSizeInput     : document.getElementById( 'input-emoji-size'     ),
      sampleCountInput   : document.getElementById( 'input-sample-count'   ),
      imageFileInput     : document.getElementById( 'input-image-file'     ),
      cancelButton       : document.getElementById( 'cancel-button'        ),
      uploadButton       : document.getElementById( 'upload-button'        ),
      submitButton       : document.getElementById( 'submit-button'        ),
      emojiSizeIndicator : document.getElementById( 'emoji-size-indicator' ),
      sampleIndicator    : document.getElementById( 'sample-indicator'     ),
      fileIndicator      : document.getElementById( 'file-indicator'       ),
    };

    registerEvents([
      { element: e.form             , event: 'submit' , handler: this.submit          , propagate: false },
      { element: e.cancelButton     , event: 'click'  , handler: this.cancel          , propagate: false },
      { element: e.uploadButton     , event: 'click'  , handler: this.openFileDialog  , propagate: false },
      { element: e.emojiSizeInput   , event: 'input'  , handler: this.updateEmojiSize , propagate: true  },
      { element: e.sampleCountInput , event: 'input'  , handler: this.updateSample    , propagate: true  },
      { element: e.imageFileInput   , event: 'change' , handler: this.updateFile      , propagate: true  },
    ], this);

    this.onSubmmit = onSubmmit;
    this.onCancel = onCancel;
    this.elements = e;

    this.updateEmojiSize();
    this.updateSample();

    this.allowSubmit = false;
  }

  submit() {
    const {
      emojiSizeInput,
      sampleCountInput,
      imageFileInput,
    } = this.elements;

    const emojiSize = parseInt(emojiSizeInput.value);
    const subdivisions = parseInt(sampleCountInput.value);
    const file = imageFileInput.files[0];

    if (file) {
      this.onSubmmit(emojiSize, subdivisions, file);
    } else {
      console.log('Error: no file was provided.');
    }
  }

  cancel() {
    this.onCancel();
  }

  openFileDialog() {
    const { imageFileInput } = this.elements;
    imageFileInput.click();
  }

  updateEmojiSize() {
    const {
      emojiSizeIndicator,
      emojiSizeInput: { value },
    } = this.elements;
    emojiSizeIndicator.textContent = `${value} × ${value} pixels`;
  }

  updateSample() {
    const {
      sampleIndicator,
      sampleCountInput: { value },
    } = this.elements;
    sampleIndicator.textContent = `${Math.pow(value, 2)} colors`;
  }

  updateFile() {
    const {
      fileIndicator,
      imageFileInput,
    } = this.elements;
    readImageFile(imageFileInput.files[0]).then((image) => {
      const { width, height } = image;
      fileIndicator.textContent = `${width} × ${height} pixels`;
      this.allowSubmit = true;
    }, () => {
      fileIndicator.innerHTML = "<span class='error'>Please choose an image file.</span>";
      imageFileInput.value = null;
      this.allowSubmit = false;
    });
  }

  set allowSubmit(value) {
    const { submitButton } = this.elements;
    if (value) {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', true);
    }
  }
};

function registerEvents(objects, scope) {
  objects.forEach(function({ element, event, handler, propagate }) {
    const boundHandler = handler.bind(scope);
    element.addEventListener(event, function(e) {
      if (!propagate) { e.preventDefault(); }
      boundHandler();
    });
  });
};
