import {loadPeople, normalize, escapeHTML, profileURL} from './personnes.js';

const search = document.querySelector('#roster-search');
const status = document.querySelector('#roster-status');
const institution = document.querySelector('#roster-institution');
const groups = document.querySelector('#roster-groups');
const message = document.querySelector('#roster-status-message');
const reset = document.querySelector('#roster-reset');
const parameters = new URLSearchParams(location.search);
const categories = [
  {value: 'permanent', id: 'permanents', title: 'Membres permanents'},
  {value: 'associe', id: 'associes', title: 'Membres associés'},
  {value: 'doctorant', id: 'doctorants', title: 'Doctorants'}
];

try {
  const people = await loadPeople();
  const institutions = [...new Set(people.map(person => person.etablissement).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'en'));
  institutions.forEach(name => institution.add(new Option(name, name)));
  search.value = parameters.get('q') || '';
  if (categories.some(category => category.value === parameters.get('statut'))) {
    status.value = parameters.get('statut');
  }
  if (institutions.includes(parameters.get('etablissement'))) {
    institution.value = parameters.get('etablissement');
  }

  function render() {
    const query = normalize(search.value.trim());
    const filtered = people.filter(person =>
      (status.value === 'all' || person.statut === status.value) &&
      (institution.value === 'all' || person.etablissement === institution.value) &&
      normalize([person.name, person.displayName, person.etablissement, person.supervision, person.year].join(' ')).includes(query)
    );

    groups.innerHTML = categories.map(category => {
      const rows = filtered.filter(person => person.statut === category.value);
      const hidden = !rows.length && (query || status.value !== 'all' || institution.value !== 'all');
      return `<section id="${category.id}" class="roster-group" ${hidden ? 'hidden' : ''}>
        <h2>${category.title}</h2>
        <ul class="roster-list">${rows.map(person => {
          const description = [person.grade, person.etablissement].filter(Boolean).join(' · ');
          const details = person.statut === 'doctorant'
            ? 'Inscription ' + person.year + (person.supervision ? ' · Encadrement ' + person.supervision.replace(/\s+/g, ' ') : '')
            : description;
          return `<li><a href="${profileURL(person)}"><strong>${escapeHTML(person.name)}</strong></a>
            <span>${escapeHTML(details)}</span></li>`;
        }).join('')}</ul>
      </section>`;
    }).join('');
    message.textContent = filtered.length
      ? filtered.length + ' personne' + (filtered.length > 1 ? 's' : '')
      : 'Aucun résultat. Essayez un autre nom ou réinitialisez les filtres.';

    const next = new URLSearchParams();
    if (search.value.trim()) next.set('q', search.value.trim());
    if (status.value !== 'all') next.set('statut', status.value);
    if (institution.value !== 'all') next.set('etablissement', institution.value);
    history.replaceState(null, '', location.pathname + (next.size ? '?' + next : '') + location.hash);
  }

  search.addEventListener('input', render);
  status.addEventListener('change', render);
  institution.addEventListener('change', render);
  reset.addEventListener('click', () => {
    search.value = '';
    status.value = 'all';
    institution.value = 'all';
    render();
    search.focus();
  });
  render();

  // Category links also restore a category hidden by a previous search.
  function revealCategory() {
    const target = categories.find(category => '#' + category.id === location.hash);
    if (!target) return;
    search.value = '';
    status.value = 'all';
    institution.value = 'all';
    render();
    document.getElementById(target.id).scrollIntoView({block: 'start'});
  }
  window.addEventListener('hashchange', revealCategory);
  if (location.hash) revealCategory();
} catch (error) {
  message.textContent = 'L’annuaire ne peut pas être chargé. Actualisez la page pour réessayer.';
}
