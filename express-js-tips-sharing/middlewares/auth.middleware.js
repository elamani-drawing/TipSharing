const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const path = require("path");

const DB = require("../models/index");
const User = DB.User
const { Op } = require("sequelize");
const env = require("../modules/env.module");
const { pictureValidator, uploadFile, linkUserPdp } = require("../modules/file.module");
const { userValidator, pseudoDisponnible, emailDisponnible } = require("../modules/user.module");
//route qui s'occupe de créer un utilisateur
passport.use(
    'register',
    new localStrategy({
        //passe la requete en parametre 
        passReqToCallback: true,
        //on lui passe le pseudo et le password 
        usernameField: 'pseudo',
        passwordField: 'password'
    },
        async (req, pseudo, password, done) => {
            const body = req.body
            let res;
            //verification de picture
            const pictureValid = await pictureValidator(req.files);
            //s'il y a eu un probleme sur l'image on retourne l'erreur indiquer par le validator
            if (pictureValid.etat == false) {
                return done(pictureValid.message);
            }
            const picture = `${pseudo}${path.extname(req.files.picture.name)}`
            //sinon on continue
            const { messages, user } = await userValidator({
                pseudo: pseudo,
                password: password,
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                picture: picture,
                isAdmin: false, 
                isActif: true, // par defaut tout les comptes sont actif
            });

            if (messages.length > 0) {
                // il y a une erreur quelque part 
                return done(messages);
            }
            res = await pseudoDisponnible(body.pseudo);
            if (res.etat == false) {
                return done(res.message);
            }
            res = await emailDisponnible(body.email)
            if (res.etat == false) {
                return done(res.message);
            }
            //nous avons un fichier et un utilisateur valide
            try {
                new_user = await User.build(user);
            } catch (error) {
                //ce n'est jamais censer se realiser, mais on laisse un message d'erreur au cas ou
                return done('La création a échouée');
            }
            // nous avons pus créer un utilisateur 
            // nous sauvegardons donc ca photo de profil
            uploadFile(linkUserPdp+ picture, req.files.picture);
            //sauvegarde de l'utilisateur dans la bdd
            await new_user.save();
            //passe les données de l'utilisateur à la fonction 
            return done(null, user);
        }
    )
);

passport.use(
    'login',
    new localStrategy({
        //on lui passe le username et le password 
        usernameField: 'username',
        passwordField: 'password'
    },
        async (username, password, done) => {
            if (!username || !password) {
                return done(undefined, false, 'Les identifiants sont incorrect' )
            }
            // recherche d'un utilisateur ayant le meme pseudo/emaildd
            // where password = password and pseudo = username or email = username
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { pseudo: username },
                        { email: username }
                    ],
                    isActif: true // seul les personnes actif peuvent se connecter
                }
            });
            if (user) {
                // verification du mot de passe
                //sinon on lui passe un message de succes et on poursuit
                let resultat = await User.checkPassword(password, user.password)
                if (resultat) {
                    return done(null, user, "Connexion établi avec succes" );
                }
            }
            //si nous avons trouver aucun utilisateur, nous renvoyons une erreur
            return done(undefined, false, 'Les identifiants sont incorrect');
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            //reccuperation de la cle secrete dans le fichier env
            secretOrKey: env.SECRET_JWT_KEY,
            //lecture du parametre secret_token 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done('erreur');
            }
        }
    )
);

//exporte le passport
module.exports = passport;