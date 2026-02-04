import { Router } from 'express';
import { authController } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

export const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: S'inscrire avec email et password
 *     description: Créer un nouveau compte utilisateur. Retourne les tokens d'accès et de refresh en cookies HttpOnly.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               firstname:
 *                 type: string
 *                 example: John
 *               name:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès. Cookies HttpOnly configurés automatiquement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: MEMBER
 *       400:
 *         description: Email déjà utilisé ou données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter avec email et password
 *     description: Authentifier un utilisateur. Retourne les tokens d'accès et de refresh en cookies HttpOnly.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Authenticated
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: MEMBER
 *       401:
 *         description: Email ou mot de passe invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renouveler les tokens d'authentification
 *     description: Utilise le refresh token pour générer un nouvel access token et refresh token. Les tokens sont envoyés via cookies HttpOnly.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Nouveaux tokens générés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: MEMBER
 *       401:
 *         description: Refresh token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter
 *     description: Supprime les cookies d'authentification côté serveur.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnecté.
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer l'utilisateur authentifié
 *     description: Retourne les informations de l'utilisateur courant. Nécessite un token d'accès valide dans les cookies.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: MEMBER
 *       401:
 *         description: Non authentifié ou token invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/me', authMiddleware, authController.me);
