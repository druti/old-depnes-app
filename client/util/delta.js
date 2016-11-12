import Delta from 'quill-delta';

export function deltaToString(delta, strLength) {
  let str = '';
  delta = new Delta(delta);
  for (let i = 0; i < delta.ops.length; i++) {
    const text = delta.ops[i].insert;
    if (text) {
      str += text;
      if (str.length >= strLength) {
        break;
      }
    }
  }
  return str.slice(0, strLength || str.length);
}

export function deltaToContent(delta) {
  delta = JSON.parse(JSON.stringify(delta));
  delta.authors = [];
  delta.ops.forEach(op => {
    const attributes = op.attributes || {};
    if (attributes.contentAuthorId || attributes.formatAuthorId) {
      // we use jquery extend here to strip undefined values from the merged obj
      delta.authors.push($.extend({}, {
        contentAuthorId: attributes.contentAuthorId,
        formatAuthorId: attributes.formatAuthorId,
      }));
    } else {
      delta.authors.push(null);
    }
    delete attributes.contentAuthorId;
    delete attributes.formatAuthorId;
    if (!Object.keys(attributes).length) delete op.attributes;
  });
  // This ensures that the Delta is compact
  delta = new Delta(delta).compose({ops: [{insert: '\n'}]});
  return delta;
}
