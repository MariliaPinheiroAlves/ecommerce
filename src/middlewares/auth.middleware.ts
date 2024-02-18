import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

interface User {
    id: string;
    username: string;
}

interface AuthenticatedRequest extends Request {
    user?: User;
}

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
	if (!token) {
		return res.status(401).json({ mensagem: 'Não autorizado' })
	}

    try {
        const decoded = jwt.verify(token, 'senha_segura') as User;
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Não autorizado'})
    }
}

