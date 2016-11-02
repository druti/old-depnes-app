import Post from './models/post';
import cuid from 'cuid';

export default function () {
  Post.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const lorem1 = `Lorem ipsum dolor sit amet, dicam scaevola mea ut, ex qui habeo tractatos. Est eu pertinax gubergren, et pro officiis periculis. Ex nisl congue alterum mei, an tota illud scaevola sea. Pro quis singulis scripserit ei, ei facer graece nonumes his, pri ei alia ornatus alienum. Putant maluisset maiestatis pri in.\n\nPer latine appetere cu, possit admodum deseruisse vel ei. Ne mandamus liberavisse nam, ei meis vocent voluptaria has. Duo apeirian legendos scriptorem ut. Ut iusto conclusionemque vis, pericula suavitate dissentiunt has id. Vix persius numquam qualisque id. Eu cum prompta qualisque, exerci tacimates has no.\n\nEam an lorem euismod, illud viris complectitur et eam. Eos augue aliquip ne, sed eros praesent erroribus ei, in usu veniam luptatum. His in everti platonem instructior, illum scripserit mel te. Quaestio incorrupte ad mel, in harum volutpat eos.\n\nCu dicit utinam alienum sed, sed ei nullam audire interpretaris. At has liber principes. Nam eu case homero, errem invenire concludaturque ius ex. Viris facete pertinax eu his, quis accusata eum te.\n\nEx sint conceptam nec, te munere philosophia pri. Sit clita commodo euripidis ne. Ad pri iusto periculis, sea ad erant bonorum gloriatur. Diam praesent nam eu, tation delectus ullamcorper an duo.\n` // trailing line break is important because quill follows this convention.

    let pathsInitialData = [
      {
        cuid: cuid(),
        content: {},
        htmlContent: lorem1,
        textContent: lorem1,
      },
    ];

    for (let i = 0; i < 3; i++) {
      let lastPath = pathsInitialData[pathsInitialData.length - 1];

      let startIndex = lastPath.textContent.indexOf('.');
      let endIndex = lastPath.textContent.indexOf('.', startIndex + 1);

      let a = lastPath.textContent.slice(0, startIndex);
      let b = lastPath.textContent.slice(endIndex);
      let c = a + b;

      let p = {
        cuid: cuid(),
        content: {},
        htmlContent: c,
        textContent: c,
      };

      pathsInitialData.push(p);
    }

    // TODO refactor or remove before anything else
    for (let i = 0; i < 1; i++) {
      let lastPath = pathsInitialData[0];

      let startIndex = lastPath.textContent.indexOf('.');
      let endIndex = lastPath.textContent.indexOf('.', startIndex + 1);

      let a = lastPath.textContent.slice(0, startIndex);
      let b = lastPath.textContent.slice(endIndex);
      let c = a + '. Replacement sentence' + b;

      let p = {
        cuid: cuid(),
        content: {},
        htmlContent: c,
        textContent: c,
      };

      pathsInitialData.push(p);
    }
    // TODO end

    for (let i = 0; i < pathsInitialData.length; i++) {
      let p = pathsInitialData[i];

      p.htmlContent = p.textContent.split(/\n/).map(function (block) {
        if (block) {
          return `<p>${block}</p>`;
        } else {
          return '<p><br /></p>';
        }
      }).slice(0, -1).join('');
    }

    pathsInitialData = pathsInitialData.map(path => new Post({
      content: path.content,
      htmlContent: path.htmlContent,
      textContent: path.textContent,
      cuid: path.cuid,
    }));

    Post.create(pathsInitialData, (error) => {
      if (!error) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DUMMY_DATA_INJECTED'); // eslint-disable-line
      }
    });
  });
}
