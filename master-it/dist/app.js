const menu=document.querySelector('#menu'),nav=document.querySelector('#navigation');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const tabs=[...document.querySelectorAll('[data-sem]')],panel=document.querySelector('#modules');
let modules=null,current='s1';
const english=document.documentElement.lang==='en';
const labels=english?{s1:'Semester 1 · Foundations',s2:'Semester 2 · Methods',s3:'Semester 3 · Specialisation',s4:'Semester 4 · Final-year project'}:{s1:'Semestre 1 · Les fondements',s2:'Semestre 2 · Les méthodes',s3:'Semestre 3 · La spécialisation',s4:'Semestre 4 · Projet de fin d’études'};
function display(sem){
 current=sem;
 tabs.forEach(t=>{const active=t.dataset.sem===sem;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
 panel.setAttribute('aria-labelledby','tab-'+sem);if(!modules)return;
 panel.replaceChildren();const h=document.createElement('h3');h.textContent=labels[sem];panel.append(h);
 const grid=document.createElement('div');grid.className=sem==='s3'?'s3-options':'';
 for(const key of sem==='s3'?['ia','rt']:[sem]){
  const section=document.createElement('section');section.id='option-'+key;
  if(sem==='s3'){const title=document.createElement('h4');title.textContent=key==='ia'?(english?'Computer Science and Applied AI':'Informatique et IA appliquée'):(english?'Networks and Telecommunications':'Réseaux et télécommunications');section.append(title)}
  const list=document.createElement('ul');list.className='module-list';modules[key].forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li)});section.append(list);grid.append(section);
 }panel.append(grid);
}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>display(t.dataset.sem));t.addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?3:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:3))%4;display(tabs[n].dataset.sem);tabs[n].focus()}})});
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{display('s3');panel.focus({preventScroll:true});document.querySelector('#programme').scrollIntoView({behavior:'smooth'})}));
fetch('programme.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{modules=d;display(current)}).catch(()=>{panel.textContent=english?'Unable to load the curriculum. Please consult the programme brochure.':'Le programme ne peut pas être chargé. Consultez la plaquette de formation.'});
