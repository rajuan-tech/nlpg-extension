//
// NOTE: If you choose to use this version of the javascript file
// you don't need jQuery.
//

var l = console.log.bind(console);

var simpleEditor = (function () {
  var textareas = [],
    editors = [],
    btnsB = [],
    btnsI = [],
    btnsU = [],
    /// NEW
    btnsH1 = [],
    btnsH2 = [],
    btnsPlus = [],
    btnsMinus = [],
    btnsBullets = [],   /// NEW 2023-05-03
    btnsUndo = [];

  var template =
  `
  <div class='simpledit te-wrapper' style='position: relative;background: white; width: 100%; border-radius: 24px; overflow: hidden;'> \
      <div class='hey-brain-main text' contentEditable='true' spellcheck='false' style='height: 92%; outline: none; padding: 2.5vmin; overflow:scroll;'></div> \
      <div class='hey-brain-main tag-buttons' style=' bottom:0; border-radius: 24px; border: 1px solid #F1F1F1; margin-top: 0vmin; position: absolute; width: 100%'> \
          <span class='hey-brain-main hyb-nt-btn bold cursor-pointer' style='font-weight: bold;'><img src=${chrome.runtime.getURL("assets/images/B.png")} alt="B"></span> \

          <span class='hey-brain-main hyb-nt-btn italic cursor-pointer' style='font-weight: lighter; font-style: italic; margin-left: 7px; margin-right: 7px;'><img src=${chrome.runtime.getURL("assets/images/I.png")} alt="I" class="notes-img hey-brain-main"></span> \

          <span class='hey-brain-main hyb-nt-btn underline cursor-pointer' style='font-weight: lighter; text-decoration: underline;'><img src=${chrome.runtime.getURL("assets/images/U.png")} alt="U" class="notes-img hey-brain-main"></span> \

          <span class='hey-brain-main hyb-nt-btn cursor-pointer head1' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/H1.png")} alt="H1" class="notes-img hey-brain-main"></span> \

          <span class='hey-brain-main hyb-nt-btn cursor-pointer head2' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/H2.png")} alt="H2" class="notes-img hey-brain-main"></span> \

          <span class='hey-brain-main hyb-nt-btn cursor-pointer bullets' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/bullets.png")} alt="arrow" class="hey-brain-main"></span> \
          
          <span class='hey-brain-main hyb-nt-btn cursor-pointer plus' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/+.png")} alt="plus" class=" notes-img hey-brain-main"></span> \
          
          <span class='hey-brain-main hyb-nt-btn cursor-pointer minus' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/-.png")} alt="minus" class="notes-img hey-brain-main"></span> \

          <span class='hey-brain-main hyb-nt-btn cursor-pointer undo' style='color:black; font-weight: bold'><img src=${chrome.runtime.getURL("assets/images/arrow.png")} alt="arrow" class="hey-brain-main"></span> \

                 
        </div> \
  </div> `;


  /**
   * Remove formatting upon pasting text into the editable area.
   */
  // 2023-05-09 COMMENTED OUT!
  // function plainTextOnPaste() {
  //   editors.forEach(function (editor) {
  //     editor.querySelector(".text").addEventListener("paste", function () {
  //       var _self = this;
  //       setTimeout(function () {
  //         // Set textContent with the result of textContent, which effectively
  //         // removes any formatting (textContent is plain text, unlike innerHTML).
  //         _self.textContent = _self.textContent;
  //       }, 3);
  //     });
  //   });
  // }



  /**
   * Apply bold and italic when ‘b’ and ‘i’ buttons are clicked.
   *
   * In some browsers, ^b and ^i shortcuts just work. Sadly, some browsers
   * already use those shortcuts for themselves (^b bookmarks, ^i page info).
   */

  // NEW!!! 2023-05-02
  let sz = 0;
  function getSize() {
    const sizes = [10, 13, 16, 18, 24, 32, 48]
    const selection = window.getSelection();
    if (selection) 
    {
      let size = window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
      size = Math.round(parseInt(size));
      for (let i = 0; i < sizes.length; i++)
      {
        if (sizes[i] <= size) sz = i+1
      }
      console.log("size: " + size)
      console.log("sz: " + sz)
    }
    return sz
  }


  function formatText() {
    // Prevent loosing text selection when clicking the buttons.
    //$(document).on('mousedown', '.simpledit .buttons i.bold, .simpledit .buttons i.italic, .simpledit .buttons i.underline', function (evt) {
    //    evt.preventDefault();
    //});

    btnsB.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          document.execCommand("bold");
        },
        false
      );
    });

    btnsI.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          document.execCommand("italic");
        },
        false
      );
    });

    btnsU.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          document.execCommand("underline");
        },
        false
      );
    });

    //// NEW
     btnsH1.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          let elem_parent_node = window.getSelection().getRangeAt(0).startContainer.parentNode;
          // NEW 2023-05-03
          if (elem_parent_node.nodeName == "LI") 
            document.execCommand("insertUnorderedList", false, null);
          if (elem_parent_node.nodeName == "H1")
            document.execCommand("formatBlock", false, "p") 
          else  { document.execCommand("formatBlock", false, "p")
          document.execCommand("formatBlock", false, "H1")  }
        },
        false
      );
    });

    btnsH2.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          let elem_parent_node = window.getSelection().getRangeAt(0).startContainer.parentNode;
          // NEW 2023-05-03
          if (elem_parent_node.nodeName == "LI") 
            document.execCommand("insertUnorderedList", false, null);
          if (elem_parent_node.nodeName == "H2")
            document.execCommand("formatBlock", false, "p") // elem_parent_node.remove();
          else { document.execCommand("formatBlock", false, "p")
            document.execCommand("formatBlock", false, "H2")  }
        },
        false
      );
    });

    btnsPlus.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          getSize() 
          if (sz < 7) {
            sz++
            document.execCommand("fontsize", false, sz);
          }
        },
        false
      );
    });

    btnsMinus.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          getSize() 
          if (sz > 1) {
            sz--
            document.execCommand("fontsize", false, sz);
          }
        },
        false
      );
    });

    btnsBullets.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          document.execCommand("insertUnorderedList", false, null);
          console.log('It works');
        },
        false
      );
    });


    btnsUndo.forEach(function (item) {
      item.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
      });

      item.addEventListener(
        "click",
        function () {
          document.execCommand("undo");
          console.log('undo clicked');
        },
        false
      );
    });



  }

  function setup(opts) {
    editors = [];  /// NEW CODE 2023-04-17
    textareas = [].slice.call(document.querySelectorAll(opts.selector));

    // Add rich editors in place of the original textareas.
    textareas.forEach(function (item) {
      item.style.display = "none";

      // We have to create a new object everytime otherwise
      // all editors are actually the same and that will give us problems.
      var tmpdiv = document.createElement("div");
      tmpdiv.innerHTML = template;
      editors.push(tmpdiv.firstElementChild);
      item.parentNode.insertBefore(tmpdiv.firstElementChild, item);

      // Every time we do editors.push(), we increase its length. We always want
      // to add the text in the current textarea to the last added editor.
      editors[editors.length - 1].querySelector(".text").innerHTML = item.value;
    });

    // Retrieve all buttons (b, i, u) from the available editors.
    editors.forEach(function (item) {
      btnsB.push(item.querySelector(".tag-buttons span.bold"));
      btnsI.push(item.querySelector(".tag-buttons span.italic"));
      btnsU.push(item.querySelector(".tag-buttons span.underline"));
      btnsH1.push(item.querySelector(".tag-buttons span.head1"));
      btnsH2.push(item.querySelector(".tag-buttons span.head2"));
      btnsPlus.push(item.querySelector(".tag-buttons span.plus"));
      btnsMinus.push(item.querySelector(".tag-buttons span.minus"));
      btnsUndo.push(item.querySelector(".tag-buttons span.undo"));
      btnsBullets.push(item.querySelector(".tag-buttons span.bullets"));
    });

    // Add listeners to btns.
    formatText();

    // 2023-05-09 COMMENTED OUT!
    // if (opts.pastePlain) {
    //   plainTextOnPaste();
    // }

    // 2025-05-09 NEW!!!! By Stanislav (plane paste)
    editors[editors.length - 1].addEventListener("paste", function(e) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand("insertHTML", false, text);
    });

    editors[editors.length - 1].addEventListener("input",  function(){
      if (!waitForAutosave) {
        waitForAutosave = true;
        AutoSaveTimer = setTimeout(function(){save(); saveNotes(); waitForAutosave = false }, 10000);
    }
    });
    /// ------------- END: 2025-05-09 NEW!!!! By Stanislav
  }

  /**
   * Sends text from the editable content to their respective textareas.
   */
  function save() {
    editors.forEach(function (editor, index) {
      textareas[index].value = editor.querySelector(".text").innerHTML != '' 
                             ? editor.querySelector(".text").innerHTML
                             : ' ';               // NEW 2023-05-10
    });
  }

  function init(opts) {
    checkOpts(opts);

    setup(opts);
  }

  function checkOpts(opts) {
    opts.selector = opts.selector || "textarea";
    opts.pastePlain = opts.pastePlain || false;
  }

  return {
    init: init,
    save: save,
  };
})();
