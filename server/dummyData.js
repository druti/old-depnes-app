import Post from './models/post';
import cuid from 'cuid';
import Delta from 'quill-delta';

export default function () {
  Post.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    let pathsInitialData = [
      {
        content: {},
        cuid: cuid(),
      },
    ];

    pathsInitialData = pathsInitialData.map(path => new Post({
      content: path.content,
      cuid: path.cuid,
    }));

    Post.create(pathsInitialData, (error) => {
      if (!error) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DUMMY_DATA_INJECTED'); // eslint-disable-line
      }
    });
  });
}
