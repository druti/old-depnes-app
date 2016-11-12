import Post from './models/post';

export default function () {
  Post.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    let pathsInitialData = [
      {
        content: {
          ops: [{insert: '\n'}],
          authors: [null],
        },
        cuid: 'blank',
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
