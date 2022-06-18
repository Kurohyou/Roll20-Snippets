(async function(){
  const typeLookup = {
    js:'jsdoc-ast.json',
    pug:'_pugdoc.json'
  };
  const funcLookup = {
    js:parseJSdoc,
    pug:parsePugdoc
  };
  const docType = window.location.href.replace(/.+?(pug|js)\.html(?:#.+)?/,'$1');
  const response = await fetch(`/docs/data/${typeLookup[docType]}`);
  const docData = await response.json();
  const contentTarget = document.getElementById('doc-target');
  const tocTarget = document.getElementById('toc-target')
  if(funcLookup[docType]){
    funcLookup[docType](contentTarget,tocTarget,docData);
  }
  PR.prettyPrint();
})();

function parsePugdoc(contentTarget,tocTarget,docData){
  docData.forEach((item,index)=>{
    const meta = item.meta;
    addTOCLink(tocTarget,meta.name);
    const detailObj = {
      description:meta.description,
      example:meta.example.replace(/include _htmlelements\.pug\n/,''),
      args:meta.arguments ?
        meta.arguments.map((arg)=>{
          return {name:arg.name,type:arg.type,description:arg.description,optional:arg.optional};
        }) :
        []
    }
    createEntry({target:contentTarget,index,name:meta.name,output:item.output,...detailObj})
  });
}

function parseJSdoc(contentTarget,tocTarget,docData){
  docData = docData.filter((data)=>data.comment && data.kind !== 'typedef' && data.description);
  docData.forEach((data,index)=>{
    console.log(data.name,data);
    if(data.name === 'set'){
      data.name = 'k.setAttrs'
    }else{
      data.name = `k.${data.name.replace(/^'?k\.|'|_|`/g,'')}`;
    }
    addTOCLink(tocTarget,data.name);
    const args = [...(data.params||[]),...(data.properties||[])].map((arg)=>{
      return {
        name:arg.name,
        description:arg.description,
        type:arg?.type?.names?.join('|')
      };
    });
    const detailObj = {
      description:data.description,
      example:data.examples?.join('|') || '',
      args,
      type:data?.type?.names.join('|')
    }
    createEntry({target:contentTarget,index,name:data.name,...detailObj})
  });
}

/**
 * Function to add a link to the item into the table of contents.
 * @param {HTMLDOMElement} tocTarget - The table of contents container
 * @param {string} name - The name of the mixin or function
 * @param {number} index - The index of the item
 */
function addTOCLink(tocTarget,name){
  const listItem = document.createElement('li');
  const link = document.createElement('a');
  link.href = `#${name.toLowerCase()}`;
  link.append(name);
  listItem.append(link);
  tocTarget.append(listItem);
}

function createEntry({target,name,index,output,description,example,args,type}){
  if(name === 'kscript'){
    output = output.replace(/(<script.+?>)(?:\n|.)+(<\/script>)/,"$1\n  //K-Scaffold Code here\n  //Followed by your code\n$2");
  }
  if(index === 0){
    const docLink = document.getElementById('doc-link');
    docLink.href=`#${name}`;
  }
  const docContainer = document.createElement('section');
  docContainer['aria-labelledby'] = `#${name.toLowerCase()}`;
  const headerContainer = document.createElement('div');
  const header = document.createElement('h3');
  header.append(name);
  header.className = 'no-capital';
  header.id = name.toLowerCase();
  headerContainer.append(header);
  if(type){
    const typeHead = document.createElement('span');
    typeHead.className = 'subhead typeHead';
    typeHead.append(type);
    headerContainer.append(typeHead);
  }
  const contentContainer = document.createElement('div');
  contentContainer.className = 'content';
  const borderContainer = document.createElement('div');
  borderContainer.className = 'border';
  docContainer.append(headerContainer,borderContainer,contentContainer);

  const descriptions = createDescriptionElements(description)
  const argContainer = document.createElement('div');
  if(args.length){
    const argHeader = document.createElement('h4');
    argHeader.append('arguments');
    argContainer.append(argHeader);
    argContainer.className = 'arguments-container';
    args.forEach((arg)=>{
      const typeSpan = document.createElement('span');
      typeSpan.append(arg.type);
      const nameSpan = document.createElement('span');
      nameSpan.append(arg.name);
      const descs = createDescriptionElements(arg.description);
      argContainer.append(typeSpan,nameSpan,...descs);
    });
  }

  const exampleContainers = [];
  if(example){
    if(output){
      const pugHead = document.createElement('h4');
      pugHead.append('pug');
      exampleContainers.push(pugHead);
    }
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.append(example);
    pre.append(code);
    pre.className = 'prettyprint';
    code.className = 'language-jade'
    exampleContainers.push(pre);
    if(output){
      const htmlHead = document.createElement('h4');
      htmlHead.append('html');
      exampleContainers.push(htmlHead);
      const oPre = document.createElement('pre');
      oPre.className = 'prettyprint';
      const oCode = document.createElement('code');
      const spacedOutput = output.replace(/>\s*</g,'>\n<');
      oCode.append(spacedOutput);
      oPre.append(oCode);
      exampleContainers.push(oPre);
    }
  }

  //Add the elements to the document
  contentContainer.append(...descriptions,argContainer,...exampleContainers);
  target.append(docContainer);
}

/**
 * Splits a string into it's component parts based on newline characters. Returns an array of all the description elements in p tags.
 * @param {string} description - A description string to be split into separate paragraphs
 * @returns {array} - An array of paragraph elements containing the description paragraphs
 */
function createDescriptionElements(description){
  return (description || '').split(/\n/).map((desc)=>{
    const p = document.createElement('p');
    const linkedDesc = desc
      .replace(/\{@link (.+?)\}/g,`<a href="#$1">$1</a>`)
      .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
    p.innerHTML = linkedDesc;
    return p;
  });
}