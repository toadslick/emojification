import readImageFile from './read-image-file';

export default class Form {
  constructor(onSubmit, onCancel) {
    const e = {
      emojiSizeInput     : document.getElementById( 'input-emoji-size'     ),
      sampleCountInput   : document.getElementById( 'input-sample-count'   ),
      imageFileInput     : document.getElementById( 'input-image-file'     ),
      blurInput          : document.getElementById( 'input-blur'           ),
      cancelButton       : document.getElementById( 'cancel-button'        ),
      uploadButton       : document.getElementById( 'upload-button'        ),
      emojiSizeIndicator : document.getElementById( 'emoji-size-indicator' ),
      sampleIndicator    : document.getElementById( 'sample-indicator'     ),
      fileIndicator      : document.getElementById( 'file-indicator'       ),
      blurIndicator      : document.getElementById( 'blur-indicator'       ),
      outputContainer    : document.getElementById( 'output-container'     ),
    };

    registerEvents([
      { element: e.cancelButton     , event: 'click'  , handler: this.cancel          , propagate: false },
      { element: e.uploadButton     , event: 'click'  , handler: this.openFileDialog  , propagate: false },
      { element: e.emojiSizeInput   , event: 'input'  , handler: this.updateEmojiSize , propagate: true  },
      { element: e.sampleCountInput , event: 'input'  , handler: this.updateSample    , propagate: true  },
      { element: e.blurInput        , event: 'input'  , handler: this.updateBlur      , propagate: true  },
      { element: e.imageFileInput   , event: 'change' , handler: this.updateFile      , propagate: true  },
    ], this);

    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.elements = e;

    this.updateEmojiSize();
    this.updateSample();
    this.updateBlur();
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
    emojiSizeIndicator.textContent = `${value} × ${value} pixels per emoji`;
  }

  updateSample() {
    const {
      sampleIndicator,
      sampleCountInput: { value },
    } = this.elements;
    sampleIndicator.textContent = `${Math.pow(value, 2)} samples per emoji`;
  }

  updateBlur() {
    const {
      blurIndicator,
      outputContainer,
      blurInput: { value },
    } = this.elements;
    if (parseInt(value)) {
      blurIndicator.textContent = `${value} pixel blur`;
      outputContainer.style.filter = `blur(${value}px)`;
    } else {
      blurIndicator.textContent = 'none';
      outputContainer.style.filter = null;
    }
  }

  updateFile() {
    const {
      fileIndicator,
      imageFileInput,
      emojiSizeInput,
      sampleCountInput,
    } = this.elements;

    readImageFile(imageFileInput.files[0]).then((image) => {
      const emojiSize = parseInt(emojiSizeInput.value);
      const sampleCount = parseInt(sampleCountInput.value);
      this.onSubmit(emojiSize, sampleCount, image);
    }, () => {
      console.log('Error: invalid image file.');
    });

    // After reading the file, clear the value of the input so that the user
    // can select the same file twice in a row and still trigger the `change` event.
    imageFileInput.value = null;
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
