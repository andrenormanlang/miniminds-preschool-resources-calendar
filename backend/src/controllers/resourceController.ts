import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resourceService.js';
import { validationResult } from 'express-validator';

export const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await resourceService.getAllResources();
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = await resourceService.getResourceById(parseInt(req.params.id));
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resource = await resourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = await resourceService.updateResource(parseInt(req.params.id), req.body);
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resourceService.deleteResource(parseInt(req.params.id));
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await resourceService.bulkCreateResources(req.body);
    res.status(201).json(resources);
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await resourceService.bulkUpdateResources(req.body);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await resourceService.bulkDeleteResources(req.body.ids);
    res.json({ message: 'Resources deleted', count });
  } catch (error) {
    next(error);
  }
};
