export const labels = {
  permanent: 'Membre permanent',
  associe: 'Membre associé',
  doctorant: 'Doctorant'
};

export function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function slug(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function escapeHTML(value) {
  const characters = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  return String(value ?? '').replace(/[&<>"']/g, character => characters[character]);
}

export function profileURL(person) {
  return 'membre.html?id=' + encodeURIComponent(person.id);
}

export async function loadPeople() {
  const filenames = ['membres.json', 'doctorants.json', 'profils.json'];
  const [members, students, profiles] = await Promise.all(filenames.map(async filename => {
    const response = await fetch(filename);
    if (!response.ok) throw new Error('Chargement de l’annuaire impossible');
    return response.json();
  }));

  const people = members.map(member => ({
    ...member,
    id: 'membre-' + slug(member.nom + ' ' + member.prenom),
    name: member.nom + ' ' + member.prenom,
    displayName: member.prenom + ' ' + member.nom,
    sortName: member.nom + ' ' + member.prenom
  })).concat(students.map(student => ({
    ...student,
    id: 'doctorant-' + slug(student.name),
    displayName: student.name,
    sortName: student.name,
    statut: 'doctorant',
    etablissement: 'Faculté des Sciences de Rabat'
  })));

  return people.map(person => ({...person, ...profiles[person.id]}))
    .sort((a, b) => a.sortName.localeCompare(b.sortName, 'fr', {sensitivity: 'base'}));
}
