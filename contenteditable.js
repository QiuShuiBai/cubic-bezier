(function() {
  var editables = $$('.param');
  function onInput(editable) {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var startOffset = range.startOffset;
  
    var content = editable.innerText;
    var isNegative = content[0] === '-';
    if (isNegative) {
      content = content.slice(1);
    }
    if (/[^0-9.]/g.test(content)) {
      content = content.replace(/[^0-9.]/g, '');
      startOffset = startOffset - 1;
    }
    content = isNegative ? '-' + content : content;
  
    // only one decimal point
    var parts = content.split('.');
    if (parts.length > 2) {
      content = parts[0] + '.' + parts.slice(1).join('');
      startOffset = startOffset - 1;
    }
    content.replace(/<br\s*\/?>/gi, ''); 
  
    editable.innerText = content;
  
    if (editable.firstChild) {
      range.setStart(editable.firstChild, Math.min(startOffset, content.length));
      range.setEnd(editable.firstChild, Math.min(startOffset, content.length));
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  
  function onKeydown(event, editable, i) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (['.', '-'].includes(editable.innerText)) return;
      editable.blur();
    }
  }
  
  function onBlur(editable, index) {
    var xy = editable.innerText;
    if (isNaN(xy) || (!(index % 2) && (xy < 0 || xy > 1))) {
      editable.innerText = 0;
    }

    updateBezier(editable.parentElement.innerText);
    update();
    updateDelayed();
  }
  
  editables.forEach(function(editable, index) {
    editable.addEventListener('input', function() {
      onInput(editable, index);
    });
    editable.addEventListener('keydown', function(event) {
      onKeydown(event, editable, index);
    });
    editable.addEventListener('blur', function() {
      onBlur(editable, index);
    });
  });
})()