(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const story = document.querySelector('.story');
  const stage = document.querySelector('.story-stage');
  const delivery = document.querySelector('.delivery');
  const intro = document.querySelector('.intro h1');
  const ideaHeading = document.querySelector('.idea-heading');
  const productHeading = document.querySelector('.product-heading');
  const idea = document.querySelector('.idea-image');
  const product = document.querySelector('.product-image');
  const assembly = document.querySelector('.assembly-scene');
  const copy = document.querySelector('.ready-copy');
  const command = document.querySelector('#typed-command');
  const checks = [...document.querySelectorAll('.checks p')];
  const bar = document.querySelector('.progress > div');
  const complete = document.querySelector('.complete');
  const animated = [stage, intro, ideaHeading, productHeading, idea, product, assembly, copy, bar, complete, ...checks];
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (x, start, end) => clamp((x - start) / (end - start));
  const ease = x => x * x * (3 - 2 * x);
  let pending = false;

  const matrixAlphabet = Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/{}');
  // Each symbol overlays its original letter, preserving word wrapping and width.
  function prepareMatrix(heading) {
    const title = heading.querySelector('h2');
    title.setAttribute('aria-label', title.textContent.trim());
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const glyphs = [];
    [...title.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) {
        visual.append(node.cloneNode(true));
        return;
      }
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { visual.append(document.createTextNode(word)); return; }
        const group = document.createElement('span');
        group.className = 'matrix-word';
        Array.from(word).forEach(letter => {
          const cell = document.createElement('span');
          cell.className = 'matrix-glyph';
          const base = document.createElement('span');
          base.className = 'matrix-base';
          base.textContent = letter;
          const symbol = document.createElement('span');
          symbol.className = 'matrix-symbol';
          symbol.textContent = letter;
          cell.append(base, symbol);
          group.append(cell);
          glyphs.push({ cell, symbol, letter });
        });
        visual.append(group);
      });
    });
    title.replaceChildren(visual);
    return glyphs;
  }
  const matrixSource = prepareMatrix(ideaHeading);
  const matrixTarget = prepareMatrix(productHeading);
  let matrixProgress = 0;
  let matrixTimer;
  function resetMatrix() {
    clearTimeout(matrixTimer);
    matrixTimer = undefined;
    [...matrixSource, ...matrixTarget].forEach(({ cell, symbol, letter }) => {
      cell.classList.remove('is-scrambling');
      symbol.textContent = letter;
    });
  }
  function renderMatrix(progress) {
    matrixProgress = progress;
    const active = progress > 0 && progress < 1;
    const targetVisible = progress >= .5;
    ideaHeading.style.opacity = targetVisible ? 0 : 1;
    productHeading.style.opacity = targetVisible ? 1 : 0;
    const glyphs = targetVisible ? matrixTarget : matrixSource;
    const tick = Math.floor(performance.now() / 90);
    glyphs.forEach(({ cell, symbol, letter }, index) => {
      const rank = index / Math.max(1, glyphs.length - 1);
      const scrambled = active && (targetVisible ? progress < .56 + rank * .42 : progress > .03 + rank * .40);
      cell.classList.toggle('is-scrambling', scrambled);
      symbol.textContent = scrambled ? matrixAlphabet[(tick * 7 + index * 13) % matrixAlphabet.length] : letter;
    });
    if (active && !document.hidden && matrixTimer === undefined) {
      matrixTimer = setTimeout(() => {
        matrixTimer = undefined;
        renderMatrix(matrixProgress);
      }, 90);
    } else if (!active) resetMatrix();
  }

  // Keep the complete accessible heading and reserve its space while typing.
  const typedIntro = intro.querySelector('.intro-typed');
  const remainingIntro = intro.querySelector('.intro-remaining');
  const introCharacters = Array.from(typedIntro.textContent);
  let introTimer;
  let introObserver;
  let introStarted = false;
  function finishIntro() {
    clearTimeout(introTimer);
    typedIntro.textContent = introCharacters.join('');
    remainingIntro.textContent = '';
    intro.classList.add('typing-complete');
  }
  function startIntro() {
    if (introStarted || preference.matches) return;
    introStarted = true;
    introObserver?.disconnect();
    intro.classList.add('typing');
    let position = 0;
    typedIntro.textContent = '';
    remainingIntro.textContent = introCharacters.join('');
    function typeCharacter() {
      position += 1;
      typedIntro.textContent = introCharacters.slice(0, position).join('');
      remainingIntro.textContent = introCharacters.slice(position).join('');
      if (position === introCharacters.length) finishIntro();
      else introTimer = setTimeout(typeCharacter, introCharacters[position - 1] === ',' ? 240 : 85);
    }
    introTimer = setTimeout(typeCharacter, 350);
  }
  if (!preference.matches) {
    introObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) startIntro();
    }, { threshold: .5 });
    introObserver.observe(intro);
  }
  preference.addEventListener('change', () => {
    if (preference.matches) {
      introObserver?.disconnect();
      finishIntro();
      intro.classList.remove('typing');
    }
  });

  function render() {
    pending = false;
    if (!root.classList.contains('motion')) return;
    const view = innerHeight;
    const rect = story.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height - view));
    const overwrite = ease(phase(progress, .24, .60));
    const assembled = ease(phase(progress, .60, .96));
    const entry = ease(clamp(1 - rect.top / (view * .65)));
    stage.style.opacity = entry;
    stage.style.setProperty('--product-phase', overwrite);
    intro.style.opacity = 1 - clamp(scrollY / (view * .75));
    intro.style.transform = `translateY(${-Math.min(scrollY * .16, 80)}px)`;
    renderMatrix(overwrite);
    idea.style.opacity = 1 - overwrite * .68;
    product.style.transform = `translateX(${(1 - overwrite) * 140}%)`;
    assembly.style.setProperty('--spread', 1 - assembled);
    const finish = delivery.getBoundingClientRect();
    const done = clamp(-finish.top / Math.max(1, finish.height - view));
    copy.style.transform = `translateY(${(1 - ease(phase(done, .38, .95))) * 70}px)`;
    command.textContent = '$ produto.publish()'.slice(0, Math.round(19 * phase(done, 0, .25)));
    checks.forEach((node, i) => { node.style.opacity = phase(done, .2 + i * .18, .32 + i * .18); });
    bar.style.transform = `scaleX(${phase(done, .18, .9)})`;
    complete.style.opacity = phase(done, .78, .98);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(render); }
  }
  function configure() {
    // Compact landscape windows use the readable static layout.
    const enabled = !preference.matches && innerHeight >= 540;
    root.classList.toggle('motion', enabled);
    if (!enabled) {
      resetMatrix();
      animated.forEach(node => node.removeAttribute('style'));
      command.textContent = '$ produto.publish()';
    }
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', configure);
  preference.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetMatrix();
    else schedule();
  });
  document.fonts.ready.then(schedule);
  configure();
})();
