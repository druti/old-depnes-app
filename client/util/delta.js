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
  const content = JSON.parse(JSON.stringify(delta));

  // This ensures that the Delta is compact
  const compactDelta = new Delta(content).compose({ops: [{insert: '\n'}]});
  compactDelta.authors = [];

  compactDelta.ops.forEach(op => {
    const attributes = op.attributes || {};
    if (attributes.contentAuthorId || attributes.formatAuthorId) {
      // we use jquery extend here to strip undefined values from the merged obj
      compactDelta.authors.push($.extend({}, {
        contentAuthorId: attributes.contentAuthorId,
        formatAuthorId: attributes.formatAuthorId,
      }));
    } else {
      compactDelta.authors.push(null);
    }
    delete attributes.contentAuthorId;
    delete attributes.formatAuthorId;
    if (!Object.keys(attributes).length) delete op.attributes;
  });

  return compactDelta;
}
