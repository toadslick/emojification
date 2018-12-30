export default class Form {
  constructor(onSubmmit, onCancel) {
    const e = {
      form               : document.getElementById( 'form'                 ),
      emojiSizeInput     : document.getElementById( 'input-emoji-size'     ),
      sampleCountInput   : document.getElementById( 'input-sample-count'   ),
      imageFileInput     : document.getElementById( 'input-image-file'     ),
      cancelButton       : document.getElementById( 'cancel-button'        ),
      emojiSizeIndicator : document.getElementById( 'emoji-size-indicator' ),
      sampleIndicator    : document.getElementById( 'sample-indicator'     ),
      fileIndicator      : document.getElementById( 'file-indicator'       ),
    };

    registerEvents([
      { element: e.form             , event: 'submit' , handler: this.submit          , propagate: false },
      { element: e.cancelButton     , event: 'click'  , handler: this.cancel          , propagate: false },
      { element: e.emojiSizeInput   , event: 'input'  , handler: this.updateEmojiSize , propagate: true  },
      { element: e.sampleCountInput , event: 'change' , handler: this.updateSample    , propagate: true  },
      { element: e.imageFileInput   , event: 'change' , handler: this.updateFile      , propagate: true  },
    ], this);

    this.onSubmmit = onSubmmit;
    this.onCancel = onCancel;
    this.elements = e;

    this.updateEmojiSize();
    this.updateSample();
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

  updateEmojiSize(element) {
    const {
      emojiSizeIndicator,
      emojiSizeInput,
    } = this.elements;
    emojiSizeIndicator.innerHTML = emojiSizeInput.value;
  }

  updateSample(element) {
    console.log('TODO: display sample size');
  }

  updateFile(element) {
    console.log('TODO: display sample size');
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
