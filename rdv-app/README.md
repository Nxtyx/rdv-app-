# ToiDécide — guide de mise en ligne

Le site est codé. Voici comment le mettre en ligne, gratuitement, étape par étape.

## 1. Créer un compte GitHub (pour héberger le code)
- Va sur github.com, crée un compte gratuit
- Crée un nouveau dépôt (repository), par exemple nommé `rdv-app`
- Mets tout le contenu de ce dossier dedans (GitHub te propose un bouton "upload files" si tu ne connais pas Git en ligne de commande)

## 2. Créer la base de données sur Supabase
- Va sur supabase.com, crée un compte gratuit
- Crée un nouveau projet
- Une fois dedans, va dans "SQL Editor" > "New query"
- Copie-colle tout le contenu du fichier `supabase-schema.sql` et clique "Run"
- Va dans "Project Settings" > "API" : tu y trouveras
  - `Project URL` → c'est ta `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → c'est ta `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → c'est ta `SUPABASE_SERVICE_ROLE_KEY` (garde-la secrète)

## 3. Créer le compte email sur Resend
- Va sur resend.com, crée un compte gratuit
- Dans "API Keys", crée une clé → c'est ta `RESEND_API_KEY`
- Pour commencer, tu peux envoyer depuis `onboarding@resend.dev` (déjà configuré par défaut). Plus tard, si tu veux envoyer depuis ton propre nom de domaine, Resend t'expliquera comment le vérifier.

## 4. Mettre le site en ligne sur Vercel
- Va sur vercel.com, crée un compte gratuit (tu peux te connecter directement avec ton compte GitHub)
- Clique "Add New Project", choisis ton dépôt `rdv-app`
- Avant de cliquer "Deploy", ouvre la section "Environment Variables" et ajoute :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `EMAIL_FROM` = `onboarding@resend.dev`
  - `NEXT_PUBLIC_SITE_URL` = (laisse vide pour l'instant, tu la remplieras après le premier déploiement avec l'URL que Vercel te donne, ex: `https://rdv-app.vercel.app`)
  - `CRON_SECRET` = invente une longue suite de caractères aléatoires (ex: `a8f3k9d7q2...`)
- Clique "Deploy"
- Une fois en ligne, récupère l'URL donnée par Vercel, retourne dans les Environment Variables et mets-la dans `NEXT_PUBLIC_SITE_URL`, puis redéploie (Vercel te propose un bouton "Redeploy")

## 5. Tester
- Va sur ton site, clique "Créer un RDV", remplis le parcours
- Récupère le lien généré, ouvre-le dans un autre onglet (ou envoie-le toi-même sur ton téléphone) pour simuler le destinataire
- Réponds, vérifie que l'email récap arrive bien à l'adresse du créateur

## Notes
- Le fichier `vercel.json` configure l'envoi automatique quotidien qui gère la règle "4 jours avant si plus de 6 invités". Vercel s'en occupe tout seul, rien à faire une fois déployé.
- Pour ajouter une nouvelle étape plus tard (budget, lieu...), le code est organisé en blocs : les options sont centralisées dans `lib/options.js`, chaque étape du parcours créateur est un bloc indépendant dans `app/create/page.js`.
