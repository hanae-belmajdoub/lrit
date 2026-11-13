import {loadPeople, labels, normalize, escapeHTML, profileURL} from './personnes.js';

const container = document.querySelector('#member-profile');
const id = new URLSearchParams(location.search).get('id') || container.dataset.profileId;
const grades = {
  PES: 'Professeur de l’enseignement supérieur',
  MCH: 'Maître de conférences habilité',
  MC: 'Maître de conférences',
  DR: 'Docteur',
  Dr: 'Docteur'
};

function supervisorKey(name) {
  return normalize(name).replace(/[^a-z0-9]/g, '');
}

function externalLink(link) {
  if (!/^https?:\/\//i.test(link.url)) return '';
  return `<a href="${escapeHTML(link.url)}" target="_blank" rel="noopener">${escapeHTML(link.label)} ↗</a>`;
}

try {
  const people = await loadPeople();
  const person = people.find(candidate => candidate.id === id);
  if (!person) {
    document.title = 'Fiche introuvable — LRIT';
    container.innerHTML = '<h1>Fiche introuvable</h1><p>Cette adresse ne correspond à aucune fiche de l’annuaire.</p><a class="text-link" href="membres.html">Consulter l’annuaire →</a>';
  } else {
    document.title = person.displayName + ' — LRIT';
    const category = labels[person.statut];
    const group = {permanent: 'permanents', associe: 'associes', doctorant: 'doctorants'}[person.statut];
    const grade = person.gradeLabel || grades[person.grade] || person.grade || '';
    const initials = person.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('');
    const photo = person.photo
      ? `<img class="profile-photo" src="${escapeHTML(person.photo)}" alt="Portrait de ${escapeHTML(person.displayName)}">`
      : `<div class="profile-initials" aria-hidden="true">${escapeHTML(initials)}</div>`;
    const information = [
      ['Statut', category],
      ['Grade', grade],
      ['Établissement', person.etablissement],
      ['Contact', person.email],
      ['Laboratoire', 'Laboratoire de Recherche en Informatique et Télécommunications · Faculté des Sciences de Rabat'],
      ['Année d’inscription', person.year]
    ].filter(([, value]) => value);

    const supervisors = person.supervision ? person.supervision.split('/').map(name => {
      const cleanName = name.trim().replace(/\s+/g, ' ');
      const matches = people.filter(member => member.statut !== 'doctorant' && supervisorKey(member.nom) === supervisorKey(cleanName));
      return matches.length === 1
        ? `<a href="${profileURL(matches[0])}">${escapeHTML(matches[0].displayName)}</a>`
        : escapeHTML(cleanName);
    }).join(' / ') : '';

    const students = person.statut !== 'doctorant' ? people.filter(student =>
      student.statut === 'doctorant' && (student.supervision || '').split('/').some(name => supervisorKey(name) === supervisorKey(person.nom))
    ) : [];
    const searchName = person.nom || person.name;
    const research = person.specialties?.length
      ? `<h3>Spécialités</h3><ul class="profile-topics">${person.specialties.map(topic => `<li>${escapeHTML(topic)}</li>`).join('')}</ul>`
      : '';
    const publications = person.publications?.length
      ? `<h3>Sélection de publications</h3><div class="profile-publications">${person.publications.map(publication => `<article><small>${escapeHTML(publication.journal)} · ${escapeHTML(publication.year)}</small><h4>${escapeHTML(publication.title)}</h4><p>${escapeHTML(publication.authors)}</p>${externalLink({label: 'Consulter la publication', url: publication.url})}</article>`).join('')}</div>`
      : '';

    container.innerHTML = `
      <div class="breadcrumb"><a href="index.html">Accueil</a><span>/</span><a href="membres.html#${group}">${escapeHTML(category)}</a><span>/</span>${escapeHTML(person.displayName)}</div>
      <header class="profile-heading">${photo}<div><p class="profile-category">${escapeHTML(category)} · LRIT</p><h1>${escapeHTML(person.displayName)}</h1>${grade ? `<p class="profile-grade">${escapeHTML(grade)}</p>` : ''}<p>${escapeHTML(person.etablissement || '')}</p></div></header>
      <div class="profile-columns"><aside class="profile-identity"><h2>Informations</h2><dl>${information.map(([label, value]) => `<dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd>`).join('')}${supervisors ? `<dt>Encadrement</dt><dd>${supervisors}</dd>` : ''}</dl><a class="text-link" href="membres.html#${group}">Retour à l’annuaire →</a></aside>
      <div class="profile-content">
        <section><h2>Présentation</h2>${person.presentation?.length ? person.presentation.map(text => `<p>${escapeHTML(text)}</p>`).join('') : `<p>${escapeHTML(person.displayName)} est ${category.toLowerCase()} du LRIT${person.year ? ', avec une inscription en ' + escapeHTML(person.year) : ''}.</p>`}</section>
        <section><h2>Recherche et publications</h2>${research}<a class="button secondary" href="publications.html?q=${encodeURIComponent(searchName)}">Rechercher des références dans les publications du LRIT ↗</a>${person.links?.length ? `<h3>Profils et sites scientifiques</h3><div class="profile-scientific-links">${person.links.map(externalLink).join('')}</div>` : ''}${publications}</section>
        ${students.length ? `<section><h2>Encadrement doctoral</h2><ul class="profile-students">${students.map(student => `<li><a href="${profileURL(student)}">${escapeHTML(student.name)}</a><span>Inscription ${escapeHTML(student.year)}</span></li>`).join('')}</ul></section>` : ''}
      </div></div>`;
  }
} catch (error) {
  container.innerHTML = '<h1>Fiche individuelle</h1><p>Le chargement a échoué. Actualisez la page pour réessayer.</p><a class="text-link" href="membres.html">Retour à l’annuaire →</a>';
}
