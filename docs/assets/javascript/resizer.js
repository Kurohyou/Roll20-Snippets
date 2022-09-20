const headerNav = document.querySelector('header + nav');
const resizeObserve = new ResizeObserver((entries)=>{
  console.log('blockSize',entries[0].borderBoxSize[0].blockSize);
  const root = document.documentElement;
  console.log('root',root);
  root.style.setProperty('--scrollPad',`${entries[0].borderBoxSize[0].blockSize + 8}px`);
});
resizeObserve.observe(headerNav);