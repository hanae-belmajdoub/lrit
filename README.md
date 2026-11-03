# LRIT + Master IT — publication GitHub Pages

Cette archive réunit les deux sites. Le LRIT est à la racine et le Master dans master-it/. Les liens entre eux sont relatifs, sans hébergement ChatGPT.

## Publier sans terminal
1. Décompresser cette archive.
2. Créer un dépôt GitHub public, par exemple lrit.
3. Add file > Upload files : envoyer tout le contenu du dossier décompressé, avec assets/ et master-it/. Ne pas envoyer le ZIP lui-même ni un dossier parent supplémentaire.
4. Commit changes.
5. Settings > Pages > Source : Deploy from a branch > main > /(root) > Save.
6. Attendre le déploiement puis cliquer Visit site. Partager l’adresse affichée. Le lien Formations > Site du Master IT mène au Master et le pied de page du Master permet de revenir au LRIT.

index.html doit être directement à la racine du dépôt. Le fichier vide .nojekyll est inclus ; si le navigateur masque ce fichier et ne l’envoie pas, vous pouvez le créer avec Add file > Create new file.

GitHub Pages classique publie le site sur Internet, sans restriction au seul professeur. Ne pas mettre de documents confidentiels. Le code et les contenus du dépôt public sont accessibles.

La vidéo est intégrée depuis Google Drive et ne se trouve pas dans l’archive. Garder son partage accessible aux visiteurs. Le programme du Master reprend la plaquette 2025–2026 fournie.

## Modifier
LRIT : index.html et autres pages à la racine ; données dans les fichiers JSON.
Master : master-it/index.html ; modules dans master-it/programme.json.
