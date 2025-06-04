import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserService } from '../../domain/services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.userService.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}