import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import indexedDBrepository from '../infra/repository/indexedDBrepository';
import defaultCover from '../templates/defaultCover';

async function exportEPUB() {
  const zip = new JSZip();
  const project = await indexedDBrepository.getCurrentProject();

  // Set the metadata for the book
  const mimetype = 'application/epub+zip';
  zip.file('mimetype', mimetype);

  const container = '<?xml version="1.0"?>'
    + '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
    + '  <rootfiles>'
    + '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />'
    + '  </rootfiles>'
    + '</container>';
  zip.file('META-INF/container.xml', container);

  const metadata = '<?xml version="1.0"?>'
    + '<package version="3.0" xml:lang="en" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id">'
    + '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">'
    + '    <dc:identifier id="book-id">urn:uuid:B9B412F2-CAAD-4A44-B91F-A375068478A0</dc:identifier>'
    + '    <meta refines="#book-id" property="identifier-type" scheme="xsd:string">uuid</meta>'
    + '    <meta property="dcterms:modified">2000-03-24T00:00:00Z</meta>'
    + '    <dc:language>en</dc:language>'
    + `    <dc:title>${project?.title}</dc:title>`
    + `    <dc:creator>${project?.author}</dc:creator>`
    + '  </metadata>'
    + '  <manifest>'
    + '    <item id="cover" href="cover.jpeg" media-type="image/jpeg"/>'
    + '  </manifest>'
    + '  <spine toc="toc">'
    + '  </spine>'
    + '</package>';

  const generateManifest = () => {
    const manuscript = project?.data?.manuscript || [];
    let manifestItems = '<item id="coverPage" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`';
    for (let index = 0; index < manuscript.length; index += 1) {
      manifestItems += `    <item id="text${index}" href="text${index}.xhtml" media-type="application/xhtml+xml"/>\n`;
    }
    return manifestItems;
  };

  const metadataWithManifest = metadata.replace(
    '<manifest>',
    `<manifest>\n${generateManifest()}`,
  );

  const generateSpine = () => {
    const manuscript = project?.data?.manuscript || [];
    let spineItems = '    <itemref idref="coverPage"/>\n';
    for (let index = 0; index < manuscript.length; index += 1) {
      spineItems += `    <itemref idref="text${index}"/>\n`;
    }
    return spineItems;
  };

  const metadataWithSpine = metadataWithManifest.replace(
    '<spine toc="toc">',
    `<spine toc="toc">\n${generateSpine()}`,
  );

  zip.file('OEBPS/content.opf', metadataWithSpine);

  // Convert the base64 image to a Blob
  const imageData = project?.image_project || defaultCover;
  const imageBlob = await fetch(`${imageData}`).then((response) => response.blob());

  // Add the image to the zip file
  zip.file('OEBPS/cover.jpeg', imageBlob);

  const styles = 'p {text-indent: 2em; margin: 0px}';
  zip.file('OEBPS/styles.css', styles);

  function getText(title: string, scene: string, type: string) {
    const text = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
      + '<!DOCTYPE html>'
      + '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">'
      + '  <head>'
      + '    <meta charset="UTF-8" />'
      + '    <link rel="stylesheet" type="text/css" href="styles.css" />'
      + `    <title>${title}</title>`
      + '  </head>'
      + '  <body>'
      + '    <section>'
      + `      ${type === 'Cena' ? '<h3>' : '<h1>'}${title}${type === 'Cena' ? '</h3>' : '</h1>'}`
      + `      <div>${scene}</div>`
      + '    </section>'
      + '  </body>'
      + '</html>';
    return text;
  }

  function getCover() {
    const text = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
      + '<!DOCTYPE html>'
      + '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">'
      + '  <head>'
      + '    <meta charset="UTF-8" />'
      + '  </head>'
      + '  <body>'
      + '    <section>'
      + '      <div><img src="cover.jpeg" alt="Cover Image"/></div>'
      + '    </section>'
      + '  </body>'
      + '</html>';
    zip.file('OEBPS/cover.xhtml', text);
  }
  getCover();

  const generateManuscript = () => {
    const manuscript = project?.data?.manuscript || [];
    for (let index = 0; index < manuscript.length; index += 1) {
      const element = manuscript[index];
      zip.file(`OEBPS/text${index}.xhtml`, getText(element.title, element.content || '', element.type));
    }
  };
  generateManuscript();

  // Generate a downloadable EPUB file from the ZIP file
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, 'epub.epub');
  });
}

export default exportEPUB;
