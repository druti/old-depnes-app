import cuid from 'cuid';

const lorem = `Lorem ipsum dolor sit amet, dicam scaevola mea ut, ex qui habeo tractatos. Est eu pertinax gubergren, et pro officiis periculis. Ex nisl congue alterum mei, an tota illud scaevola sea. Pro quis singulis scripserit ei, ei facer graece nonumes his, pri ei alia ornatus alienum. Putant maluisset maiestatis pri in.

Per latine appetere cu, possit admodum deseruisse vel ei. Ne mandamus liberavisse nam, ei meis vocent voluptaria has. Duo apeirian legendos scriptorem ut. Ut iusto conclusionemque vis, pericula suavitate dissentiunt has id. Vix persius numquam qualisque id. Eu cum prompta qualisque, exerci tacimates has no.

Eam an lorem euismod, illud viris complectitur et eam. Eos augue aliquip ne, sed eros praesent erroribus ei, in usu veniam luptatum. His in everti platonem instructior, illum scripserit mel te. Quaestio incorrupte ad mel, in harum volutpat eos.

Cu dicit utinam alienum sed, sed ei nullam audire interpretaris. At has liber principes. Nam eu case homero, errem invenire concludaturque ius ex. Viris facete pertinax eu his, quis accusata eum te.

Ex sint conceptam nec, te munere philosophia pri. Sit clita commodo euripidis ne. Ad pri iusto periculis, sea ad erant bonorum gloriatur. Diam praesent nam eu, tation delectus ullamcorper an duo.

`; // trailing line break is important because quill follows this convention.

const pathsInitialState = [
  {
    cuid: cuid(), 
    content: {},
    htmlContent: lorem,
    textContent: lorem,
  },
];

for (let i = 0; i < 3; i++) {
  let lastPath = pathsInitialState[pathsInitialState.length - 1];

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

  pathsInitialState.push(p);
}

// TODO refactor or remove before anything else
for (let i = 0; i < 1; i++) {
  let lastPath = pathsInitialState[0];

  let startIndex = lastPath.textContent.indexOf('.');
  let endIndex = lastPath.textContent.indexOf('.', startIndex + 1);

  let a = lastPath.textContent.slice(0, startIndex);
  let b = lastPath.textContent.slice(endIndex);
  let c = a + '. Replacement sentence' + b;

  let p = {
    id: pathsInitialState.length,
    content: {},
    htmlContent: c,
    textContent: c,
  };

  pathsInitialState.push(p);
}
// TODO end

for (let i = 0; i < pathsInitialState.length; i++) {
  let p = pathsInitialState[i];

  p.htmlContent = p.textContent.split(/\n/).map(function (block) {
    if (block) {
      return `<p>${block}</p>`;
    } else {
      return '<p><br></p>';
    }
  }).slice(0, -1).join('');
}

export default { data: pathsInitialState };
