import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../middlewares/jwt';
import logger from '../middlewares/logger';
import type { CookieOptions } from 'express';
import { config } from '../config/env';

const isProd = config.NODE_ENV === 'production';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstname, name, inviteCode, householdName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        logger.http(`Register échoué : email existant (${email})`);
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      let householdId: number | null = null;

      if (inviteCode && !householdName) {
        // Rejoindre un foyer existant
        const household = await prisma.household.findFirst({ where: { invite_code: inviteCode } });
        if (!household) {
          return res.status(400).json({ message: "Code d'invitation invalide." });
        }
        householdId = household.id;
      } else if (inviteCode && householdName) {
        // Créer un nouveau foyer
        const existingHousehold = await prisma.household.findFirst({
          where: { invite_code: inviteCode },
        });
        if (existingHousehold) {
          return res.status(400).json({ message: "Ce code d'invitation est déjà utilisé." });
        }
        const newHousehold = await prisma.household.create({
          data: {
            name: householdName,
            invite_code: inviteCode,
          },
        });
        householdId = newHousehold.id;
      } else {
        // fallback: aucun code fourni
        return res.status(400).json({ message: "Code d'invitation requis." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstname: firstname || 'User',
          name: name || 'User',
          role: 'MEMBER',
          household_id: householdId,
        },
      });

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken({ id: user.id });

      res
        .status(201)
        .cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE })
        .cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE })
        .json({
          status: 201,
          message: 'Utilisateur créé avec succès.',
          user: { id: user.id, email: user.email, role: user.role },
        });

      logger.info(`Register réussi : ${email}`);
    } catch (error) {
      logger.error(`Erreur register : ${error}`);
      return res.status(500).json({ message: 'Erreur serveur lors de la création du compte.' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.http(`Login échoué : utilisateur inexistant (${email})`);
        return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
      }

      const valid = await bcrypt.compare(password, user.password || '');
      if (!valid) {
        logger.http(`Login échoué : password incorrect (${email})`);
        return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken({ id: user.id });

      res
        .status(200)
        .cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE })
        .cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE })
        .json({
          status: 200,
          message: 'Authenticated',
          user: { id: user.id, email: user.email, role: user.role, firstname: user.firstname },
        });

      logger.info(`Login réussi : ${email}`);
    } catch (error) {
      logger.error(`Erreur login : ${error}`);
      return res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const refreshToken = (req as any).cookies?.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token manquant.' });
      }

      let payload: any;
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch (err) {
        res.clearCookie('refresh_token', COOKIE_OPTIONS);
        logger.http('Refresh token invalide');
        return res.status(401).json({ message: 'Refresh token invalide.' });
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        res.clearCookie('refresh_token', COOKIE_OPTIONS);
        return res.status(401).json({ message: 'Utilisateur introuvable.' });
      }

      const newAccessToken = createAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      const newRefreshToken = createRefreshToken({ id: user.id });

      res
        .status(200)
        .cookie('access_token', newAccessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE })
        .cookie('refresh_token', newRefreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        })
        .json({
          user: { id: user.id, email: user.email, role: user.role },
        });

      logger.info(`Refresh : nouveaux tokens pour ${user.email}`);
    } catch (error) {
      logger.error(`Erreur refresh : ${error}`);
      return res.status(500).json({ message: 'Erreur serveur lors du refresh.' });
    }
  },

  logout: async (_req: Request, res: Response) => {
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
    logger.info('Logout effectué');
    return res.status(200).json({ message: 'Déconnecté.' });
  },

  me: async (req: Request, res: Response) => {
    try {
      const userPayload = (req as any).user;

      if (!userPayload) {
        return res.status(401).json({ message: 'Non authentifié.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userPayload.id },
        include: { household: true },
      });
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur introuvable.' });
      }

      logger.info(`ME : ${user.email}`);
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          name: user.name,
          role: user.role,
          photo: user.photo,
          household_id: user.household_id,
          inviteCode: user.household?.invite_code,
        },
      });
    } catch (error) {
      logger.error(`Erreur me : ${error}`);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
};
